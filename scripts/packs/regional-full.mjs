/**
 * Complete UI packs for regional locales (bn, gu, mr, ta, te, ml, pa, as).
 * Keys use semantic ids from ui-keys.ts.
 */
import { bnPack } from "./bn-pack.mjs";
import { guPack } from "./gu-pack.mjs";
import { taPack } from "./ta-pack.mjs";
import { tePack } from "./te-pack.mjs";
import { mlPack } from "./ml-pack.mjs";
import { paPack } from "./pa-pack.mjs";
import { asPack } from "./as-pack.mjs";
import { mrOverrides } from "./mr-overrides.mjs";

export const regionalFullPacks = {
  bn: bnPack,
  gu: guPack,
  mr: mrOverrides,
  ta: taPack,
  te: tePack,
  ml: mlPack,
  pa: paPack,
  as: asPack,
};
