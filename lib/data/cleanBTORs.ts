import { BTOR } from "../../types/Travels";
import * as aq from "arquero";

const cleanBTORs = (data: any) => {
  //TODO: add type BTORRaw
  const output = aq
    .from(data)
    .derive({
      dateStart: aq.escape((d: any) => d.Departure.toISOString()),
      dateEnd: aq.escape((d: any) => d.Return.toISOString()),
    })
    .rename({
      Dept: "department",
      "Purpose of travel": "purpose",
      Budget: "budget",
      Destination: "destination",
      "Nr of days": "daysOfTravel",
    })
    .select([
      "dateStart",
      "dateEnd",
      "destination",
      "purpose",
      "budget",
      "department",
      "daysOfTravel",
    ]);

  return output.objects() as BTOR[];
};

export default cleanBTORs;
