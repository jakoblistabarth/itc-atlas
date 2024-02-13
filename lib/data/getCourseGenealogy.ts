import fs from "fs";
import { CourseGenealogy } from "../../types/CourseGenealogy";
import getMscApplicationsByProgramByYear from "./queries/application/getMscApplicationByProgramByYear";
import { TimelineEvent } from "../../types/TimelineEvent";
import { CourseGenealogyItem } from "../../types/CourseGenealogy";

type ProgramStem = {
  name: string;
  stem: string;
};

const getCourseGenealogy = async () => {
  const filePath = "./data/compiled/courseGenealogy.json";
  const raw = fs.readFileSync(filePath);
  const genealogy: CourseGenealogy = JSON.parse(raw.toString());
  const linksAES: CourseGenealogyItem[] = [
    {
      start: new Date("2019"),
      end: new Date("2019"),
      source: "AES",
      target: "NHR",
      stem: "6",
    },
    {
      start: new Date("2019"),
      end: new Date("2019"),
      source: "AES",
      target: "ARS",
      stem: "6",
    },
    {
      start: new Date("2020"),
      end: new Date("2022"),
      source: "ARS",
      target: "ARS",
      stem: "6",
    },
    {
      start: new Date("2020"),
      end: new Date("2022"),
      source: "NHR",
      target: "NHR",
      stem: "6",
    },
  ];
  linksAES.map((d) => genealogy.links.push(d));

  const mergeGenealogyData = async (
    programStem: ProgramStem[],
    years: number[],
  ) => {
    for (const programme of programStem) {
      for (const year of years) {
        const count = await getMscApplicationsByProgramByYear(
          programme.name,
          year,
        );
        const course: TimelineEvent = {
          name: programme.name,
          yOffset: programme.name,
          dateStart: new Date(year + ""),
          fill: programme.stem,
          data: {
            code: programme.name,
            year: year,
            value: count[0]?._count._all,
            stem: programme.stem,
          },
          size: count[0]?._count._all,
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
      { name: "ARS", stem: "6" },
      { name: "NHR", stem: "6" },
    ],
    [2020, 2021, 2022],
  );
};

export default getCourseGenealogy;
