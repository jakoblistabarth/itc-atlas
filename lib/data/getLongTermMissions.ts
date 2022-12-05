import csv from "csvtojson";
import {
  LongTermMission,
  LongTermMissionRaw,
} from "../../types/LongTermMission";
import * as aq from "arquero";

export default async function getLongTermMissions() {
  const csvFilePath = "./data/itc/longTermMissions.csv";
  const data = await csv({ checkType: true }).fromFile(csvFilePath);

  const tb = aq.from(data).derive({
    dateStart: aq.escape((d: LongTermMissionRaw) =>
      new Date(d?.dateStart + "GMT").toISOString()
    ),
    dateEnd: aq.escape((d: LongTermMissionRaw) =>
      new Date(d?.dateEnd + "GMT").toISOString()
    ),
  });

  return tb.objects() as LongTermMission[];
}
