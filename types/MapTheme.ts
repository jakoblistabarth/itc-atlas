import { Appearance, TextAppearance } from "./Appearance";

export type MapTheme = {
  fontFamily?: string;
  background: Appearance;
  graticule: Appearance;
  graticuleLabel?: TextAppearance;
  base: Appearance;
  choropleth?: Appearance;
  symbol?: Appearance;
  flow?: Appearance;
  scaledPie?: Appearance;
  label?: TextAppearance;
  hasGraticuleLables?: boolean;
  hasOutline?: boolean;
  hasShadow?: boolean;
  hasLakes?: boolean;
  hasRivers?: boolean;
};
