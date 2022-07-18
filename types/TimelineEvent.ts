import { Project } from "./Project";

export type TimelineEvent = {
  name: string;
  yOffset: string;
  dateStart: Date;
  dateEnd: Date;
  data?: Project[];
};
