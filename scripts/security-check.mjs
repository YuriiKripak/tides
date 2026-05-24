import { execFileSync } from "node:child_process";

const forbiddenTrackedPaths = [
  /^\.DS_Store$/,
  /^\.env(?:\.|$)/,
  /^\.dev\.vars(?:\.|$)/,
  /^\.claude\//,
  /^\.playwright-mcp\//,
  /^\.wrangler\//,
  /^\.cloudflare\//,
  /^node_modules\//,
  /^tide_widget_png_v3\//,
  /\.zip$/i,
  /\.npmrc$/,
  /\.(?:pem|key|p12|pfx)$/i,
  /(?:^|\/)id_(?:rsa|ed25519)$/,
];

const secretPatterns = [
  { name: "private key", regex: /-----BEGIN [A-Z ]*PRIVATE KEY-----/ },
  { name: "GitHub token", regex: /\b(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9_]{20,}\b/ },
  { name: "GitHub fine-grained token", regex: /\bgithub_pat_[A-Za-z0-9_]{30,}\b/ },
  { name: "AWS access key", regex: /\bAKIA[0-9A-Z]{16}\b/ },
  { name: "Bearer token", regex: /\bBearer\s+[A-Za-z0-9._~+/=-]{24,}\b/i },
  { name: "npm auth token", regex: /\/\/registry\.npmjs\.org\/:_authToken\s*=\s*\S+/i },
  {
    name: "assigned secret value",
    regex: /\b(?:api[_-]?key|access[_-]?token|auth[_-]?token|client_secret|secret|password|passwd)\b\s*[:=]\s*["']?[A-Za-z0-9._~+/=-]{12,}/i,
  },
];

function git(args, options = {}) {
  return execFileSync("git", args, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    ...options,
  }).trim();
}

function isProbablyBinary(text) {
  return text.includes("\u0000");
}

function findSecrets(label, text, failures) {
  if (!text || isProbablyBinary(text)) return;

  for (const pattern of secretPatterns) {
    const match = text.match(pattern.regex);
    if (match) {
      failures.push(`${label}: matched ${pattern.name}`);
    }
  }
}

const failures = [];
const warnings = [];
const trackedFiles = git(["ls-files"]).split("\n").filter(Boolean);

for (const file of trackedFiles) {
  if (forbiddenTrackedPaths.some((pattern) => pattern.test(file))) {
    failures.push(`forbidden tracked path: ${file}`);
  }
}

for (const file of trackedFiles) {
  const text = git(["show", `HEAD:${file}`], { maxBuffer: 8 * 1024 * 1024 });
  findSecrets(file, text, failures);
}

const objects = git(["rev-list", "--objects", "--all"])
  .split("\n")
  .map((line) => {
    const [oid, ...pathParts] = line.split(" ");
    return { oid, path: pathParts.join(" ") || oid };
  })
  .filter((entry) => entry.oid);

for (const { oid, path } of objects) {
  const type = git(["cat-file", "-t", oid]);
  if (type !== "blob") continue;

  const size = Number(git(["cat-file", "-s", oid]));
  if (!Number.isFinite(size) || size > 1024 * 1024) continue;

  const text = git(["cat-file", "-p", oid], { maxBuffer: 2 * 1024 * 1024 });
  findSecrets(`history:${path}`, text, failures);
}

const authorLines = git(["log", "--all", "--format=%ae%n%ce"])
  .split("\n")
  .filter(Boolean);
const publicEmails = [
  ...new Set(authorLines.filter((email) => {
    const normalized = email.toLowerCase();
    return normalized.includes("@")
      && !normalized.endsWith("@users.noreply.github.com")
      && normalized !== "noreply@github.com";
  })),
];
for (const email of publicEmails) {
  warnings.push(`commit history exposes author email: ${email}`);
}

if (warnings.length) {
  console.warn("Security warnings:");
  for (const warning of warnings) console.warn(`- ${warning}`);
}

if (failures.length) {
  console.error("Security check failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Security check passed: no tracked secrets or forbidden tracked paths found.");
