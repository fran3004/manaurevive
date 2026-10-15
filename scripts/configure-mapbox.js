const fs = require("fs");
const path = require("path");

const tokenName = "MAPBOX_ACCESS_TOKEN";
const envFile = path.resolve(".env.local");

function readLocalToken() {
  if (!fs.existsSync(envFile)) return "";

  const assignment = fs.readFileSync(envFile, "utf8")
    .split(/\r?\n/)
    .find((line) => /^\s*MAPBOX_ACCESS_TOKEN\s*=/.test(line));
  if (!assignment) return "";

  const value = assignment.replace(/^\s*MAPBOX_ACCESS_TOKEN\s*=\s*/, "").trim();
  if (value.startsWith('"') && value.endsWith('"')) return JSON.parse(value);
  if (value.startsWith("'") && value.endsWith("'")) return value.slice(1, -1);
  return value.replace(/\s+#.*$/, "").trim();
}

const token = (process.env[tokenName] || readLocalToken()).trim();
if (token && !token.startsWith("pk.")) {
  throw new Error(`${tokenName} must be a public Mapbox token starting with "pk."`);
}

const configPath = path.resolve("public", "brochure", "mapbox-config.js");
fs.writeFileSync(
  configPath,
  `window.MAPBOX_ACCESS_TOKEN = ${JSON.stringify(token)};\n`,
  "utf8"
);
console.log("Generated local Mapbox browser configuration.");
