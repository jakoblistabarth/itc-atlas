import csv from "csvtojson";
import fs from "fs";
import type { Link, Node } from "../../types/CourseGenealogy";
import { TimelineEvent } from "../../types/TimelineEvent";
import { Row } from "../DataFrame/DataFrame";

const createCourseGenealogy = async () => {
  const nodesPath = "./data/static/course-genealogy-nodes.csv";
  const linksPath = "./data/static/course-genealogy-links.csv";

  const csvOpts = {
    delimiter: ";",
  };

  const nodesRaw: Node[] = await csv(csvOpts).fromFile(nodesPath);
  const linksRaw: Link[] = await csv(csvOpts).fromFile(linksPath);

  const links = linksRaw
    .map((link) => {
      return {
        start: link.start,
        end: link.end,
        source: link.in ? link.in.split("-") : [],
        target: link.out ? link.out.split("-") : [],
        stem: link.stem,
      };
    })
    .flatMap((link) => {
      const type =
        link.source.length > 1
          ? "merge"
          : link.target.length > 1
          ? "split"
          : "link";
      const outputs = link.target.map((t) => ({
        ...link,
        source: link.source[0],
        target: t,
      }));
      const inputs = link.source.map((s) => ({
        ...link,
        target: link.target[0],
        source: s,
      }));
      switch (type) {
        case "split":
          return outputs;
        case "merge":
          return inputs;
        default:
          return [
            {
              ...link,
              source: link.source[0],
              target: link.target[0],
            },
          ];
      }
    });

  const nodes = nodesRaw.flatMap((course) => {
    const { code, description, ...rest } = course;
    const timelineEvents: TimelineEvent[] = Object.entries(rest)
      .map(([year, value]) => {
        const stem = links.find((l) => l.source === code)?.stem;

        return {
          name: code,
          yOffset: code,
          dateStart: new Date(year),
          size: value as number,
          data: { code, year, value, stem } as Row,
          fill: stem,
        };
      })
      .filter((n) => !(n.size == 0));
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
