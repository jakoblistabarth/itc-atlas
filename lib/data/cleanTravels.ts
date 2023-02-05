import { Travel } from "../../types/Travels";
import * as aq from "arquero";

const cleanTravels = (data: any) => {
  //TODO: add type TravelRaw
  const tb = aq
    .from(data)
    .derive({
      dateStart: aq.escape((d: any) => d.FromDate.toISOString() ?? null),
      dateEnd: aq.escape((d: any) => d.ToDate.toISOString() ?? null),
    })
    .rename({
      MNumber: "mNumber",
      Country: "country",
      Destination: "destination",
      Dept: "department",
      Type: "type",
    })
    .select([
      "dateStart",
      "dateEnd",
      "mNumber",
      "country",
      "destination",
      "department",
      "type",
    ]);

  return tb.objects() as Travel[];
};

export default cleanTravels;
