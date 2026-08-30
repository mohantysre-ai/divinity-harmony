import fs from "node:fs";

const p = "scripts/packs/bn-pack.mjs";
let s = fs.readFileSync(p, "utf8");
s = s.replace(
  /footerDisclaimer: "[^"]+"/,
  'footerDisclaimer: "শিক্ষামূলক ভক্তিমূলক বিষয় · মুহূর্ত ও ঔপচারিক সংস্কার যোগ্য আঞ্চলিক উৎস দিয়ে যাচাই করুন।"',
);
fs.writeFileSync(p, s);
console.log("fixed bn footerDisclaimer");
