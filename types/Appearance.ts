export type Appearance = {
  text?: TextAppearance;
  opacity?: number;
  fill?: string;
  gradient?: ColorStop[];
  fillOpacity?: number;
  pattern?: PatternAppearance;
  stroke?: string;
  strokeWidth?: number;
  strokeOpacity?: number;
  strokeLineJoin?: "round" | "bevel" | "miter" | "round";
  markerEnd?: "tip" | "triangle";
};

export type TextAppearance = {
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: "normal" | "bold" | "bolder" | "lighter" | number;
  fontStyle?: "normal" | "italic";
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
};

export type PatternAppearance = {
  id: string;
  size?: number;
  patternTransform?: {
    angle?: number;
  };
  patternUnits?: "userSpaceOnUse" | "objectBoundingBox";
  angle?: number;
  color?: string;
  stroke?: string;
  strokeWidth?: number;
  family?: string;
};

export type ColorStop = { color: string; stop: number };
