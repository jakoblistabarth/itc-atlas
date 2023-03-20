import React, { FC, useEffect, useState } from "react";
import { Text } from "@visx/text";
import { Label } from "@visx/annotation";
import { groups, linkVertical, range, ScaleBand, scaleBand } from "d3";
import useMeasure from "react-use-measure";
import { LinkVerticalCurve } from "@visx/shape";

type Props = {
  hierarchy: Hierarchy;
  height: number;
};

export type Hierarchy = {
  nodes: { level: number; id: number; label: string }[];
  relations: { from: string; to: string[] }[];
};

const HierarchyTree: FC<Props> = ({ hierarchy, height }) => {
  const [isSSR, setIsSSR] = useState(true);
  useEffect(() => {
    setIsSSR(false);
  }, []);
  const [containerRef, { width }] = useMeasure();

  const margin = 50;

  const groupedByLevel = groups(hierarchy.nodes, (d) => d.level);
  const levels = groupedByLevel.map((d) => d[0]);

  const yScale = scaleBand<number>()
    .domain(levels)
    .range([margin, height - margin]);

  const xScales = groupedByLevel.reduce(
    (acc: { level: number; scale: ScaleBand<number> }[], [level, nodes]) => {
      acc.push({
        level: level,
        scale: scaleBand<number>()
          .domain(range(nodes.length).map((_, i) => i + 1))
          .range([0, width])
          .paddingOuter(1)
          .align(0.5),
      });
      return acc;
    },
    []
  );

  return (
    <div style={{ width: "100%" }} ref={containerRef}>
      <svg width={"100%"} height={"100%"} viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <linearGradient id="gradient" gradientTransform="rotate(90)">
            <stop offset="30%" stop-color="PaleTurquoise" />
            <stop offset="90%" stop-color="teal" />
          </linearGradient>
        </defs>
        {hierarchy.nodes.map((d, idx) => {
          const scale = xScales.find((e) => e.level === d.level)?.scale;
          const links = hierarchy.relations.find(
            (e) => e.from === `${d.level}.${d.id}`
          );
          if (!scale) return;
          const origin = {
            x: (scale(d.id) ?? 0) + scale.bandwidth() / 2,
            y: yScale(d.level),
          };
          const isProject = d.level === 6;
          return (
            <g key={`circle-${idx}`}>
              {links &&
                links.to.map((link) => {
                  const [level, id] = link.split(".").map((d) => Number(d));
                  const targetXScale = xScales.find(
                    (d) => d.level === level
                  )?.scale;
                  if (!targetXScale || !origin.y) return;
                  const target = {
                    x: (targetXScale(id) ?? 0) + targetXScale.bandwidth() / 2,
                    y: yScale(level),
                  };
                  if (!target.y) return;
                  const curve = linkVertical()({
                    source: [origin.x, 20 + origin.y ?? 1],
                    target: [target.x, -15 + target.y ?? 1],
                  });
                  return (
                    <path
                      key={`link-${d.level}.${d.id}-${level}.${id}`}
                      d={curve?.toString()}
                      fill="none"
                      stroke={
                        level === 6 ? "url('#gradient')" : "PaleTurquoise"
                      }
                    />
                  );
                })}
              <Label
                x={origin.x}
                y={origin.y}
                verticalAnchor="middle"
                horizontalAnchor="middle"
                width={scale.bandwidth() * 0.8}
                backgroundFill={isProject ? "teal" : "PaleTurquoise"}
                backgroundProps={{ rx: 4 }}
                titleFontSize={10}
                titleProps={{
                  textAnchor: "middle",
                  fontFamily: "Fraunces",
                  fill: isProject ? "white" : "teal",
                }}
                title={d.label}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default HierarchyTree;
