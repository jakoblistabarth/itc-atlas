export type Appearance = {
  text?: TextAppearance;
  opacity?: number;
  fill?: string;
  fillOpacity?: number;
  pattern?: PatternAppearance;
  stroke?: string;
  strokeWidth?: number;
  strokeOpacity?: number;
  strokeLineJoin?: "round" | "bevel" | "miter" | "round";
  markerEnd?: string;
};

export type TextAppearance = {
  fontFamily?: string;
  fontSize?: number;
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
