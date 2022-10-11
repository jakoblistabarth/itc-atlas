import csv from "csvtojson";
import fs from "fs";
import type { Link, Fork } from "../../types/CourseGenealogy";
import { TimelineEvent } from "../../types/TimelineEvent";
import { Row } from "../DataFrame/DataFrame";

const createCourseGenealogy = async () => {
  const nodesPath = "./data/static/course-genealogy-links.csv";
  const forksPath = "./data/static/course-genealogy-forks.csv";

  const csvOpts = {
    delimiter: ";",
  };

  const nodesRaw: Link[] = await csv(csvOpts).fromFile(nodesPath);
  const forksRaw: Fork[] = await csv(csvOpts).fromFile(forksPath);

  const forks = forksRaw.map((fork) => ({
    year: parseInt(fork.year),
    in: fork.in ? fork.in.split("-") : undefined,
    out: fork.out ? fork.out.split("-") : undefined,
  }));

  const findNextOccurence = (code: string, year: number) => {
    const nextOccurences = forks.filter(
      (fork) => fork.in && fork.in.includes(code)
    );
    if (!nextOccurences.length) return;
    const nextOccurence = nextOccurences.reduce((min, fork) =>
      fork.year < min.year ? fork : min
    );
    return nextOccurence.year;
  };

  const findPreviousOccurence = (code: string, year: number) => {
    const nextOccurence = forks
      .filter((fork) => fork.out && fork.out.includes(code))
      .reduce((max, fork) => (fork.year > max.year ? fork : max));
    return nextOccurence.year;
  };

  const headTails = forks
    .map((fork) => {
      const type = !fork.in
        ? "start"
        : !fork.out
        ? "end"
        : fork.in.length > 1
        ? "merge"
        : "split";
      const start =
        type == "end"
          ? findPreviousOccurence(fork.in ? fork.in[0] : "", fork.year)
          : fork.year;
      const end =
        type == "start"
          ? findNextOccurence(fork.out ? fork.out[0] : "", fork.year)
          : ["merge", "split"].includes(type)
          ? fork.year - 1
          : fork.year;
      switch (type) {
        case "start":
          return {
            start,
            end: fork.year,
            source: fork.out ? fork.out[0] : "",
            target: fork.out ? fork.out[0] : "",
            type,
          };
        case "end":
          return {
            start,
            end: fork.year,
            source: fork.in ? fork.in[0] : "",
            target: fork.in ? fork.in[0] : "",
            type,
          };
        case "merge": {
          return fork.in?.map((forkIn) => ({
            start,
            end: fork.year,
            source: forkIn,
            target: fork.in ? fork.in[0] : "",
            type: "merge",
          }));
        }
        case "split": {
          return fork.out?.map((forkOut) => ({
            start,
            end: fork.year,
            source: fork.in ? fork.in[0] : "",
            target: forkOut,
            type: "split",
          }));
        }
      }
    })
    .flat();

  const links = headTails
    // .filter((l) => [l?.source, l?.target].includes("N.4.3"))
    .flatMap((l) => {
      const closed = l?.type === "end";
      // console.log(l, closed);
      if (closed) return [l];
      // console.log(l.source, "->", l.target);
      const target = findNextOccurence(l.target, l.end);
      const l2: typeof l = {
        start: l.start,
        end: target,
        source: l.target,
        target: l.target,
        type: "link",
      };
      // console.log("new!", l2);
      return [l, l2];
    });

  // console.log(
  //   headTails.filter((l) => [l?.source, l?.target].includes("N.4.3"))
  // );
  // console.log(links.filter((l) => [l?.source, l?.target].includes("N.4.3")));

  const nodes = nodesRaw.flatMap((course) => {
    const { code, description, ...rest } = course;
    const timelineEvents: TimelineEvent[] = Object.entries(rest).map(
      ([year, value]) => ({
        name: value as string,
        yOffset: code,
        dateStart: new Date(year),
        size: value as number,
        data: { code, year, value } as Row,
        fill: code,
      })
    );
    return timelineEvents;
  });

  const genealogy = {
    links,
    nodes,
  };
  fs.writeFileSync(
    "./data/itc/courseGenealogy.json",
    JSON.stringify(genealogy)
  );
};

export default createCourseGenealogy;
