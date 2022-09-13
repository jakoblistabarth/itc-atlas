import DataFrame from "../DataFrame/DataFrame";
import { Alumni } from "../../types/Alumni";

const cleanAlumni = (data: any) => {
  const df = new DataFrame(data)
    .renameColumn({ City: "city" })
    .renameColumn({ "No.": "contactNo" })
    .renameColumn({ Country: "country" })
    .mutate("examYear", (row) => {
      const value = row["Exam Year"];
      if (!value || !Number.isInteger(value)) return null;
      return new Date(value + "").toISOString();
    })
    .select(["contactNo", "examYear", "city", "country"]);

  return df.toArray() as Alumni[];
};

export default cleanAlumni;
