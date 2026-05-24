import { access, readFile } from "node:fs/promises";

const requiredFiles = [
  "tide-deploy/index.html",
  "tide-deploy/site.webmanifest",
  "tide-deploy/favicon.svg",
];

for (const file of requiredFiles) {
  await access(file);
}

const html = await readFile("tide-deploy/index.html", "utf8");
const requiredSnippets = [
  "const langSeq=['en','ru','ua','es']",
  "'loc-label':    'Hora local'",
  "new Intl.DateTimeFormat",
  "timeZone: 'America/New_York'",
  "'tide-walk-score':'Tide Walk Score'",
  "id=\"score-beacon\"",
  "id=\"motion-btn\"",
  "grid-template-columns:minmax(0,1fr) auto",
  "08:12 10:42",
  "body.motion-on .wave1",
  "body.classList.add('motion-on')",
  "body.classList.remove('motion-on')",
  "function renderStatic()",
  "function startMotion()",
  "function stopMotion()",
  "let motionEnabled=false",
  "const perf={",
  "const targetFps=isMobile?24:30",
  "--glass:rgba(8,18,36,.88)",
];

for (const snippet of requiredSnippets) {
  if (!html.includes(snippet)) {
    throw new Error(`Missing deploy snippet: ${snippet}`);
  }
}

console.log("Deploy files look ready.");
