import fs from "node:fs";

const p = "scripts/packs/as-pack.mjs";
let s = fs.readFileSync(p, "utf8");
s = s.replace(
  /guestAccessAvailable: "[^"]+"/,
  'guestAccessAvailable: "অতিথি প্ৰৱেশ উপলব্ধ। লগইন সক্ৰিয় কৰিবলৈ Supabase ৰ স্থাপনা চলচ যোগ কৰক।"',
);
s = s.replace(
  /emailConfirmationNote: "[^"]+"/,
  'emailConfirmationNote: "আপোনাৰ Supabase প্ৰকল্পৰ দ্বাৰা ইমেইল নিশ্চিতকৰণ প্ৰয়োজন হ\'ব পাৰে।"',
);
s = s.replace(/accessibility: "[^"]+"/, 'accessibility: "\u09B8\u09C1\u0997\u09F0\u09A4\u09BE"');
fs.writeFileSync(p, s);
