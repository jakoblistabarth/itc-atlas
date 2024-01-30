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
  async function merge(programStem: ProgramStem[], years: number[]) {
    // why using 'for' rather than the 'map' due to the multiple layer of the async function
    for (let i = 0; i < programStem.length; i++) {
      for (let j = 0; j < years.length; j++) {
        const count: MscApplicationsByProgramByYearWithCount =
          await getMscApplicationsByProgramByYear(
            programStem[i].name,
            years[j],
          );
        const course: TimelineEvent = {
          name: programStem[i].name,
          yOffset: programStem[i].name,
          dateStart: new Date(years[j] + "-01-01T00:00:00.000Z"),
          fill: programStem[i].stem,
          data: {
            code: programStem[i].name,
            year: years[j],
            value: count[0]?._count._all,
            stem: programStem[i].stem,
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
