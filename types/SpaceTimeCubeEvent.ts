import { Vector2 } from "three";
import { Struct } from "arquero/dist/types/table/transformable";

export type SpaceTimeCubeEvent = {
  name: string;
  dateStart: Date;
  dateEnd?: Date;
  coordinates: Vector2;
  color?: string;
  data?: Struct;
  size?: number;
};
