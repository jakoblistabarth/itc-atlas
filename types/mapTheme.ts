import { Appearance, TextAppearance } from "./Appearance";

export type MapTheme = {
  background: Appearance;
  graticule: Appearance;
  graticuleLabel?: TextAppearance;
  base: Appearance;
  choropleth?: Appearance;
  symbol?: Appearance;
  scaledPie?: Appearance;
  label?: TextAppearance;
  hasGraticuleLables?: boolean;
  hasOutline?: boolean;
  hasShadow?: boolean;
};
