import { BTOR } from "../../types/Travels";
import DataFrame from "../DataFrame/DataFrame";

const cleanBTORs = (data: any) => {
  const df = new DataFrame(data);

  const output = df
    .mutate("dateStart", (row) => row.Departure.toISOString())
    .mutate("dateEnd", (row) => row.Return.toISOString())
    .renameColumn({ Dept: "department" })
    .renameColumn({ "Purpose of travel": "purpose" })
    .renameColumn({ Budget: "budget" })
    .renameColumn({ Destination: "destination" })
    .renameColumn({ "Nr of days": "daysOfTravel" })
    .select([
      "dateStart",
      "dateEnd",
      "destination",
      "purpose",
      "budget",
      "department",
      "daysOfTravel",
    ]);

  return output.toArray() as BTOR[];
};

export default cleanBTORs;
