import { randomInt, range } from "d3";
import { Hierarchy } from "./";

export const getHierarchyData = (detailed = false): Hierarchy => {
  const nLevels = detailed ? 8 : 3;
  const nodeStructure = range(0, nLevels).map(() => randomInt(2, 5)());

  const hierarchy = nodeStructure.reduce(
    (acc: Hierarchy, d, idx) => {
      const level = idx + 1;
      acc.levelNames?.push(`level ${level}`);
      acc.nodes.push(
        ...range(1, d).map((n) => ({
          level: level,
          id: n,
          label: `${level}.${n}`,
        }))
      );
      if (level < nLevels)
        acc.relations.push(
          ...range(1, d).map((n) => ({
            from: `${level}.${n}`,
            //TODO: add several random children to one parent
            to: [`${level + 1}.${randomInt(1, nodeStructure[idx + 1])()}`],
          }))
        );
      return acc;
    },
    { relations: [], nodes: [], levelNames: [] }
  );

  return hierarchy;
};
