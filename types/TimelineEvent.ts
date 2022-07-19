import { Row } from "../lib/DataFrame/DataFrame";

export type TimelineEvent = {
  name: string;
  yOffset: string;
  dateStart: Date;
  dateEnd: Date;
  data?: Row;
};
