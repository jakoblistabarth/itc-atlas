import { Row } from "../lib/DataFrame/DataFrame";
import { Vector2 } from "three";

export type SpaceTimeCubeEvent = {
  name: string;
  dateStart: Date;
  dateEnd?: Date;
  coordinates: Vector2;
  color?: string;
  data?: Row;
  size?: number;
};
