import DataFrame from "../DataFrame/DataFrame";
import { Alumni } from "../../types/Alumni";

const cleanAlumni = (data: any) => {
  const df = new DataFrame(data)
    .renameColumn({ City: "city" })
    .renameColumn({ "No.": "contactNo" })
    .select(["city", "contactNo"]);

  console.log(df);
  return df.toArray() as Alumni[];
};

export default cleanAlumni;
