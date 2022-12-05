export type LongTermMissionRaw = {
  project: string;
  id: string;
  name: string;
  dateStart: string;
  dateEnd: string;
  country: string;
};

export type LongTermMission = {
  project: string;
  id: string;
  name: string;
  dateStart: Date;
  dateEnd: Date;
  country: string;
};
