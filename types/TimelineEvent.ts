import { Struct } from "arquero/dist/types/table/transformable";

export type TimelineEvent = {
  name: string;
  yOffset: string;
  dateStart: Date;
  dateEnd?: Date;
  fill?: string;
  data?: Struct;
  size?: number;
};
