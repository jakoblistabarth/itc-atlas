import { Travel } from "../../types/Travels";
import DataFrame from "../DataFrame/DataFrame";

const cleanTravels = (data: any) => {
  const df = new DataFrame(data)
    .mutate("dateStart", (row) => row.FromDate.toISOString() ?? null)
    .mutate("dateEnd", (row) => row.ToDate.toISOString() ?? null)
    .renameColumn({ MNumber: "mNumber" })
    .renameColumn({ Country: "country" })
    .renameColumn({ Destination: "destination" })
    .renameColumn({ Dept: "department" })
    .renameColumn({ Type: "type" })
    .select([
      "dateStart",
      "dateEnd",
      "mNumber",
      "country",
      "destination",
      "department",
      "type",
    ]);

  return df.toArray() as Travel[];
};

export default cleanTravels;
