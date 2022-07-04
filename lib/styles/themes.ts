import eth from "./themes/eth";
import raisz from "./themes/raisz";
import bayer from "./themes/bayer";

export enum ThemeNames {
  RAISZ = "raisz",
  BAYER = "bayer",
  ETH = "eth",
}

const themes = new Map([
  [ThemeNames.BAYER, bayer],
  [ThemeNames.ETH, eth],
  [ThemeNames.RAISZ, raisz],
]);

export default themes;
