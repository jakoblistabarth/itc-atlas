import eth from "./themes/eth";
import raisz from "./themes/raisz";
import bayer from "./themes/bayer";
import defaultTheme from "./themes/defaultTheme";

export enum ThemeNames {
  DEFAULT = "Default",
  RAISZ = "Raisz",
  BAYER = "Bayer",
  ETH = "ETH",
}

const themes = new Map([
  [ThemeNames.DEFAULT, defaultTheme],
  [ThemeNames.BAYER, bayer],
  [ThemeNames.ETH, eth],
  [ThemeNames.RAISZ, raisz],
]);

export default themes;
