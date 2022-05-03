import { Appearance } from "./Appearance";

export type MapTheme = {
  background: Appearance;
  graticule: Appearance;
  base: Appearance;
  choropleth?: Appearance;
  symbol?: Appearance;
  label?: string;
};
