import fs from "fs";
import { CourseGenealogy } from "../../types/CourseGenealogy";
import getMscApplicationsByProgramByYear from "./queries/application/getMscApplicationByProgramByYear";
import { MscApplicationsByProgramByYearWithCount } from "./queries/application/getMscApplicationByProgramByYear";
import { TimelineEvent } from "../../types/TimelineEvent";

type ProgramStem = {
  name: string;
  stem: string;
};

const getCourseGenealogy = async () => {
  const filePath = "./data/compiled/courseGenealogy.json";
  const raw = fs.readFileSync(filePath);
  const genealogy: CourseGenealogy = JSON.parse(raw.toString());
  async function merge(p: ProgramStem[], y: number[]) {
    // why using 'for' rather than the 'map' due to the multiple layer of the async function
    for (let i = 0; i < p.length; i++) {
      for (let j = 0; j < y.length; j++) {
        const count: MscApplicationsByProgramByYearWithCount =
          await getMscApplicationsByProgramByYear(p[i].name, y[j]);
        const course: TimelineEvent = {
          name: p[i].name,
          yOffset: p[i].name,
          dateStart: new Date(y[j] + "-01-01T00:00:00.000Z"),
          fill: p[i].stem,
          data: {
            code: p[i].name,
            year: y,
            value: count[0]?._count._all,
            stem: p[i].stem,
          },
          size: count[0]?._count._all,
        };
        genealogy.nodes.push(course);
      }
    }
    return genealogy;
  }

  return await merge(
    [
      { name: "GFM", stem: "1" },
      { name: "NRM", stem: "2" },
      { name: "LA", stem: "3" },
      { name: "UPM", stem: "3" },
      { name: "WREM", stem: "5" },
      { name: "AES", stem: "6" },
    ],
    [2020, 2021, 2022],
  );
};

export default getCourseGenealogy;
