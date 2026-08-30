/**
 * Extends te/ml/pa/ta packs to 225 keys with native-script tail + fixes.
 * Run: node scripts/packs/finalize-all-packs.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { tePack } from "./te-pack.mjs";
import { mlPack } from "./ml-pack.mjs";
import { paPack } from "./pa-pack.mjs";
import { taPack } from "./ta-pack.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "../..");
const KEYS = Object.keys(
  JSON.parse(
    fs.readFileSync(path.join(root, "src/lib/ui-keys-export.json"), "utf8"),
  ),
);
const tail = JSON.parse(
  fs.readFileSync(path.join(__dirname, "tail-supplement.json"), "utf8"),
);

/** Native-script overrides (Unicode escapes avoid accidental Latin mixing). */
const FIXES = {
  te: {
    heroSubtitle:
      "\u0C2E\u0C40 \u0C30\u0C4B\u0C1C\u0C41\u0C35\u0C3E\u0C30\u0C40 \u0C2A\u0C35\u0C3F\u0C24\u0C4D\u0C30 \u0C2A\u0C4D\u0C30\u0C2F\u0C3E\u0C23\u0C02 \u0C15\u0C4B\u0C38\u0C02 \u0C2A\u0C4D\u0C30\u0C36\u0C3E\u0C02\u0C24 \u0C38\u0C4D\u0C25\u0C32\u0C02.",
    templePriestDirectory:
      "\u0C26\u0C47\u0C35\u0C3E\u0C32\u0C2F \u0C2E\u0C30\u0C3F\u0C2F\u0C41 \u0C2A\u0C41\u0C30\u0C4B\u0C39\u0C3F\u0C24 \u0C28\u0C3F\u0C30\u0C4D\u0C26\u0C47\u0C36\u0C3F\u0C15",
  },
  ml: {
    templePriestDirectory:
      "\u0D15\u0D4D\u0D37\u0D47\u0D24\u0D4D\u0D30\u0D35\u0D41\u0D02 \u0D2A\u0D41\u0D30\u0D4B\u0D39\u0D3F\u0D24 \u0D28\u0D3F\u0D30\u0D4D\u0D26\u0D47\u0D36\u0D3F\u0D15\u0DAF\u0D41\u0D02",
  },
  pa: {
    myDharma: "\u0A2E\u0A47\u0A30\u0A3E \u0A27\u0A30\u0A2E",
    livingDevotionalLibrary:
      "\u0A1C\u0A40\u0A35\u0A02\u0A24 \u0A2D\u0A15\u0A24\u0A40 \u0A32\u0A3E\u0A07\u0A2C\u0A30\u0A47\u0A30\u0A40",
    saveMyDharma: "\u0A2E\u0A47\u0A30\u0A3E \u0A27\u0A30\u0A2E \u0A38\u0A47\u0A35 \u0A15\u0A30\u0A4B",
    threeLivingPaths:
      "\u0A24\u0A3F\u0A02\u0A28 \u0A1C\u0A40\u0A35\u0A02\u0A24 \u0A30\u0A38\u0A24\u0A47\u0A06 \u0A07\u0A15 \u0A2A\u0A35\u0A3F\u0A24\u0A30 \u0A25\u0A3E\u0A06\u0A02",
    myAccount: "\u0A2E\u0A47\u0A30\u0A3E \u0A16\u0A3E\u0A24\u0A3E",
    useMyLocation: "\u0A2E\u0A47\u0A30\u0A3E \u0A38\u0A25\u0A3E\u0A28 \u0A35\u0A30\u0A24\u0A4B",
    email: "\u0A08\u0A2E\u0A47\u0A32",
    halfTithiDivision: "\u0A05\u0A71\u0A27-\u0A24\u0A3F\u0A25\u0A40 \u0A35\u0A3F\u0A06\u0A17",
  },
  ta: {
    digitalJapaMala: "\u0B9F\u0BBF\u0B9C\u0BBF\u0B9F\u0BCD\u0B9F\u0BB2\u0BCD \u0B9C\u0BAA \u0BAE\u0BBE\u0BB2\u0BC8",
    footerDisclaimer:
      "\u0B95\u0BB2\u0BCD\u0BB5\u0BBF \u0BAA\u0B95\u0BCD\u0BA4\u0BBF \u0B89\u0BB3\u0BCD\u0BB3\u0B9F\u0B95\u0BCD\u0B95\u0BAE\u0BCD \u00B7 \u0BAE\u0BC1\u0B95\u0BC2\u0BB0\u0BCD\u0BA4\u0BCD\u0BA4\u0BAE\u0BCD \u0BAE\u0BB1\u0BCD\u0BB1\u0BC1\u0BAE\u0BCD \u0B92\u0BAA\u0BCD\u0BAA\u0B9A\u0BBE\u0BB0\u0BBF\u0B95 \u0B9A\u0BAE\u0BCD\u0BB8\u0BCD\u0B95\u0BBE\u0BB0\u0BAE\u0BCD \u0BA4\u0B95\u0BC1\u0BA4\u0BBF\u0BAF\u0BBE\u0BA9 \u0BAA\u0BBF\u0BB0\u0BBE\u0BA8\u0BCD\u0BA4\u0BBF\u0BAF \u0B86\u0BA4\u0BBE\u0BB0\u0BA4\u0BCD\u0BA4\u0BC1\u0B9F\u0BA9\u0BCD \u0B9A\u0BB0\u0BBF\u0BAA\u0BBE\u0BB0\u0BCD\u0B95\u0BCD\u0B95\u0BB5\u0BC1\u0BAE\u0BCD.",
    noNoiseMenus:
      "\u0B9A\u0BA4\u0BCD\u0BA4\u0BAE\u0BCD \u0B87\u0BB2\u0BCD\u0BB2\u0BC8, \u0B9A\u0BBF\u0B95\u0BCD\u0B95\u0BB2\u0BBE\u0BA9 \u0BAE\u0BC7\u0BA9\u0BC1\u0B95\u0BB3\u0BCD \u0B87\u0BB2\u0BCD\u0BB2\u0BC8\u2014\u0B95\u0BC7\u0B9F\u0BCD\u0BAA\u0BA4\u0BC1, \u0BA4\u0BB0\u0BCD\u0B9A\u0BA9\u0BAE\u0BCD \u0BAE\u0BB1\u0BCD\u0BB1\u0BC1\u0BAE\u0BCD \u0BA8\u0BBF\u0BB2\u0BC8\u0BAF\u0BBE\u0BA9 \u0B9E\u0BBE\u0BA9\u0BA4\u0BCD\u0BA4\u0BBF\u0BB1\u0BCD\u0B95\u0BC1 \u0BA8\u0BC7\u0BB0\u0B9F\u0BBF \u0BAA\u0BBE\u0BA4\u0BC8.",
    panchangLocalized: "\u0B89\u0BB3\u0BCD\u0BB3\u0BC2\u0BB0\u0BCD \u0BAA\u0B9E\u0BCD\u0B9A\u0BBE\u0B99\u0BCD\u0B95\u0BAE\u0BCD",
    panchangCalendarAlt:
      "\u0B9A\u0BC2\u0BB0\u0BBF\u0BAF\u0BA9\u0BCD, \u0B9A\u0BA8\u0BCD\u0BA4\u0BBF\u0BB0\u0BA9\u0BCD \u0BAE\u0BB1\u0BCD\u0BB1\u0BC1\u0BAE\u0BCD \u0BA8\u0B95\u0BCD\u0B9A\u0BA4\u0BCD\u0BA4\u0BBF\u0BB0 \u0BB5\u0BBE\u0BA9\u0BBF\u0BAF\u0BB2\u0BCD \u0BAA\u0B9E\u0BCD\u0B9A\u0BBE\u0B99\u0BCD\u0B95\u0BAE\u0BCD",
    discoverDarshanStreams:
      "\u0BA4\u0BB1\u0BCD\u0BAA\u0BCB\u0BA4\u0BC1 \u0B92\u0BB3\u0BBF\u0BAA\u0BB0\u0BAA\u0BCD\u0BAA\u0BAA\u0BCD\u0BAA\u0B9F\u0BC1\u0BAE\u0BCD \u0BA4\u0BB0\u0BCD\u0B9A\u0BA9 \u0BB8\u0BCD\u0B9F\u0BCD\u0BB0\u0BC0\u0BAE\u0BCD\u0B95\u0BB3\u0BC8\u0B95\u0BCD \u0B95\u0BA3\u0BCD\u0B9F\u0BB1\u0BBF\u0BAF\u0BC1\u0B99\u0BCD\u0B95\u0BB3\u0BCD",
    templePriestDirectory:
      "\u0B95\u0BCB\u0BAF\u0BBF\u0BB2\u0BCD \u0BAE\u0BB1\u0BCD\u0BB1\u0BC1\u0BAE\u0BCD \u0BAA\u0BC1\u0BB0\u0BCB\u0B95\u0BBF\u0BA4\u0BB0\u0BCD \u0B85\u0B9F\u0BC8\u0BB5\u0BC1",
  },
};

const LOCALES = [
  { code: "te", base: tePack, export: "tePack", label: "Telugu" },
  { code: "ml", base: mlPack, export: "mlPack", label: "Malayalam" },
  { code: "pa", base: paPack, export: "paPack", label: "Punjabi" },
  { code: "ta", base: taPack, export: "taPack", label: "Tamil" },
];

function escape(str) {
  return str.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

for (const { code, base, export: exportName, label } of LOCALES) {
  const fixes = FIXES[code] ?? {};
  const merged = { ...base, ...tail[code], ...fixes };
  const missing = KEYS.filter((k) => !(k in merged));
  if (missing.length) {
    throw new Error(`${code} missing keys: ${missing.join(", ")}`);
  }
  const lines = KEYS.map((k) => `  ${k}: "${escape(merged[k])}",`);
  const body = `/** Complete ${label} UI pack — 225 semantic keys. */
export const ${exportName} = {
${lines.join("\n")}
};
`;
  fs.writeFileSync(path.join(__dirname, `${code}-pack.mjs`), body, "utf8");
  console.log(`Wrote ${code}-pack.mjs (${KEYS.length} keys)`);
}
