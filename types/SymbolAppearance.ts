export type SymbolAppearance = {
  stroke?: {
    color?: string;
    width?: number;
    opacity?: number;
    linejoin?: "round" | "bevel" | "miter" | "round";
  };
  fill?: {
    color?: string;
    opacity?: number;
  };
  text?: {
    size?: number;
    color?: string;
    stroke?: string;
  };
  opacity?: number;
};

export type textAppearance = {
  fontSize?: number;
  color?: string;
  stroke?: string;
};
