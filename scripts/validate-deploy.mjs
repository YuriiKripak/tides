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
  "id=\"score-beacon\" cx=\"180\" cy=\"180\" r=\"13\"",
  "id=\"motion-btn\"",
  "data-i18n=\"data-updated\"",
  "NOAA data · updated 04:00",
  "grid-template-columns:minmax(118px,1fr) auto minmax(78px,1fr)",
  "grid metrics-panel",
  "score-hero",
  "metrics-factors",
  ".score-number #score-value{font-size:clamp(58px,17vw,76px)",
  ".walk-time{font-size:clamp(23px,7vw,30px)",
  ".metric-value.wind-value{display:flex",
  "justify-self:center;display:flex;align-items:center;gap:6px",
  ".loc-name{font-size:19px;font-weight:500",
  ".wx-temp{font-size:25px",
  "transform-origin:180px 180px",
  "score-main caution",
  "metric-item safe",
  "card.className = `score-main ${band.cls}`",
  "const scoreColor = value ? getComputedStyle(value).color : band.color",
  "'tide-walk-score':'Score'",
  "'best-window':  'Best'",
  "'walk-time-value':'08:12–10:42 AM'",
  "'walk-time-value':'08:12–10:42'",
  "'val-wind-dir': 'S'",
  "'val-wind-speed':'10–15'",
  "data-i18n=\"walk-time-value\"",
  "body.motion-on #score-beacon",
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
