import fs from "fs";
import { CourseGenealogy } from "../../types/CourseGenealogy";
import getMscApplicationsByProgramByYear from "./queries/application/getMscApplicationByProgramByYear";
import { TimelineEvent } from "../../types/TimelineEvent";

type ProgramStem = {
  name: string;
  stem: string;
};

const getCourseGenealogy = async () => {
  const filePath = "./data/compiled/courseGenealogy.json";
  const raw = fs.readFileSync(filePath);
  const genealogy: CourseGenealogy = JSON.parse(raw.toString());

  const mergeGenealogyData = async (
    programStem: ProgramStem[],
    years: number[],
  ) => {
    for (const programme of programStem) {
      for (const year of years) {
        let countSize = 0;
        if (programme.name == "AES") {
          const count1 = await getMscApplicationsByProgramByYear("ARS", year);
          const count2 = await getMscApplicationsByProgramByYear("NHR", year);
          countSize = count1[0]?._count._all + count2[0]?._count._all;
        } else {
          const count = await getMscApplicationsByProgramByYear(
            programme.name,
            year,
          );
          countSize = count[0]?._count._all;
        }
        const course: TimelineEvent = {
          name: programme.name,
          yOffset: programme.name,
          dateStart: new Date(year + ""),
          fill: programme.stem,
          data: {
            code: programme.name,
            year: year,
            value: countSize,
            stem: programme.stem,
          },
          size: countSize,
        };
        genealogy.nodes.push(course);
      }
    }
    return genealogy;
  };

  return await mergeGenealogyData(
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
