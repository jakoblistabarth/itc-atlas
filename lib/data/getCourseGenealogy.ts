import fs from "fs";
import { CourseGenealogy } from "../../types/CourseGenealogy";

const getCourseGenealogy = async () => {
  const filePath = "./data/itc/courseGenealogy.json";
  const raw = fs.readFileSync(filePath);
  const genealogy: CourseGenealogy = JSON.parse(raw.toString());
  return genealogy;
};

export default getCourseGenealogy;
