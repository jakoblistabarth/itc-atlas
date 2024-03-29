import {
  ascending,
  descending,
  groups,
  linkHorizontal,
  max,
  range,
  rollups,
  scaleBand,
  scaleLinear,
  scaleOrdinal,
  scalePoint,
  scaleTime,
  stack,
  sum,
  timeYear,
} from "d3";
import useMeasure from "react-use-measure";
import { Vector2 } from "three";
import Cross from "../../components/Cross/Cross";
import LabelPoint from "../../components/LabelPoint";
import LegendProportionalRectangle from "../../components/LegendProportionalRectangle";
import Timeline from "../../components/Timeline";
import TimelineGrid from "../../components/Timeline/TimelineGrid";
import Tooltip from "../../components/Tooltip";
import toInt from "../../lib/utilities/toInt";
import { CourseGenealogy as Genealogy } from "../../types/CourseGenealogy";
import { LabelPlacement } from "../../types/LabelPlacement";
import { FC } from "react";

type Props = {
  genealogy: Genealogy;
};

const CourseGenealogy: FC<Props> = ({ genealogy }) => {
  const linkGenerator = linkHorizontal();

  genealogy.nodes.forEach((node) => {
    node.dateStart = new Date(node.dateStart);
    node.size = toInt(node.size) ?? 0;
  });

  genealogy.links.forEach((link) => {
    link.start = new Date(link.start.toString());
    link.end = new Date(link.end.toString());
  });

  const sumsPerYear = rollups(
    genealogy.nodes,
    (v) => sum(v, (d) => d.size),
    (d) => d.dateStart,
  );

  const coursesPerYear = groups(genealogy.nodes, (d) =>
    d.dateStart.getFullYear(),
  ).map((g) => ({
    year: g[0],
    ...Object.fromEntries(
      rollups(
        g[1],
        (v) => sum(v, (d) => d.size),
        (d) => d.fill,
      ),
    ),
  }));
  // complete missing keys for d3.stack
  // QUESTION: better way to do this?
  coursesPerYear.forEach((year) => {
    range(1, 7).forEach((stemId) => {
      if (!year[stemId]) year[stemId] = 0;
    });
  });

  const [containerRef, { width }] = useMeasure();

  const genealogyHeight = 350;
  const barChartHeight = 75;
  const gap = 25;
  const height = genealogyHeight + gap + barChartHeight;
  const margin = {
    x: 25,
    t: 35,
    b: 25,
  };
  const tDomain = [new Date("1949"), new Date("2023")];
  const tSeq = timeYear.range(tDomain[0], tDomain[1]);
  const xRange = [margin.x, width - margin.x];
  const xScale = scaleTime().domain(tDomain).range(xRange).nice(15);
  const xScale2 = scaleBand()
    .domain(tSeq.map((d) => d.toISOString()))
    .range(xRange)
    .paddingInner(0.2);
  const yScale = scalePoint()
    .range([margin.t, genealogyHeight])
    .domain(
      genealogy.links
        .sort((a, b) => descending(new Date(a.start), new Date(b.start)))
        .sort((a, b) =>
          ascending(parseInt(a.stem.toString()), parseInt(b.stem.toString())),
        )
        .flatMap((d) => [d.source, d.target]),
    );
  const maxCount = max(genealogy.nodes, (n) => n.size);
  const heightScale = scaleLinear()
    .domain([0, maxCount ?? 0])
    .range([0, 32]);
  const yScaleSum = scaleLinear()
    .domain([0, max(sumsPerYear, (d) => d[1]) ?? 1])
    .range([barChartHeight - margin.b, 0]);

  const stems = genealogy.links.reduce((stems, s) => {
    if (!stems.includes(s.stem)) stems.push(s.stem);
    return stems;
  }, [] as string[]);

  const colorScale = scaleOrdinal<string, string>()
    .domain(stems)
    .range([
      "orange",
      "red",
      "darkred",
      "purple",
      "cornflowerblue",
      "darkslateblue",
    ]);

  const yearStack = stack().keys(stems);
  const graduatesStack = yearStack(coursesPerYear);

  return (
    <div className="w-full" ref={containerRef}>
      <svg width={"100%"} height={"100%"} viewBox={`0 0 ${width} ${height}`}>
        <Timeline xScale={xScale}>
          <TimelineGrid height={height} margin={margin.t} />
          <g id={"nodes"} opacity={0.8}>
            {genealogy.nodes.map((node, idx) => {
              const year = node.dateStart.getFullYear();
              const pos = {
                x: xScale(node.dateStart),
                y: yScale(node.yOffset),
              } as Vector2;
              const height = heightScale(node.size ?? 1);
              return node.data?.value === "-" ? (
                <Cross
                  key={idx}
                  transform={`translate(${pos.x} ${pos.y})`}
                  length={2}
                  halos={[{ size: 4, color: "white" }]}
                />
              ) : (
                <Tooltip.Root key={idx}>
                  <Tooltip.Trigger asChild>
                    <g fill={colorScale(node.fill ?? "")}>
                      <rect
                        x={pos.x - xScale2.bandwidth() / 2}
                        y={pos.y - height / 2}
                        width={xScale2.bandwidth()}
                        height={height}
                      />
                    </g>
                  </Tooltip.Trigger>
                  <Tooltip.Content>
                    <strong>
                      {year}, {node.name}
                    </strong>
                    <br />
                    {node.size} MSc. alumni
                  </Tooltip.Content>
                </Tooltip.Root>
              );
            })}
          </g>
          <g id={"links"}>
            {genealogy.links.map((link) => {
              const sourcePos = new Vector2(
                xScale(link.start),
                yScale(link.source) ?? 1,
              );
              const targetPos = new Vector2(
                xScale(link.end),
                yScale(link.target) ?? 1,
              );
              return (
                <g
                  key={`${link.start}-${link.end}-${link.source}-${link.target}`}
                >
                  <g opacity={0.25}>
                    <path
                      stroke={"black"}
                      strokeWidth={0.5}
                      d={
                        linkGenerator({
                          source: [sourcePos.x, sourcePos.y],
                          target: [targetPos.x, targetPos.y],
                        }) || ""
                      }
                      fill={"none"}
                    />
                    {[sourcePos, targetPos].map((p, idx) => (
                      <circle
                        key={idx}
                        cx={p.x}
                        cy={p.y}
                        fill={"black"}
                        // stroke={"black"}
                        r={1}
                      ></circle>
                    ))}
                  </g>
                  {link.source === link.target && (
                    <LabelPoint
                      position={sourcePos}
                      placement={LabelPlacement.LEFT}
                      fontSize={6}
                      fontFamily={"Fraunces Variable"}
                      fill={"black"}
                      stroke={"white"}
                      strokeWidth={2}
                    >
                      <tspan fontWeight={"bold"}>{link.source}</tspan>
                    </LabelPoint>
                  )}
                </g>
              );
            })}
          </g>
          <g
            id="sum-layer"
            transform={`translate(0, ${genealogyHeight + gap})`}
          >
            <g id={"seperator"}>
              <line
                x1={0}
                x2={width}
                y1={-gap / 2}
                y2={-gap / 2}
                stroke="white"
                strokeWidth={2}
              />
            </g>
            <g id="axis">
              {yScaleSum.ticks().map((tick) => (
                <g key={tick}>
                  <line
                    stroke={"lightgrey"}
                    y1={yScaleSum(tick)}
                    y2={yScaleSum(tick)}
                    x1={width - margin.x}
                    x2={width - margin.x + 2 + +(+(tick % 50 === 0)) * 2}
                  />
                  {tick % 50 === 0 && (
                    <>
                      <LabelPoint
                        position={
                          new Vector2(width - margin.x + 2, yScaleSum(tick))
                        }
                        placement={LabelPlacement.RIGHT}
                      >
                        {tick}
                      </LabelPoint>
                      <line
                        stroke={"lightgrey"}
                        strokeWidth={0.5}
                        y1={yScaleSum(tick)}
                        y2={yScaleSum(tick)}
                        x1={margin.x}
                        x2={width - margin.x}
                      />
                    </>
                  )}
                </g>
              ))}
            </g>
            <g id="bars">
              {graduatesStack.map((s) => {
                const stem = s.key;
                return s.map((y, idx) => (
                  <rect
                    key={`${idx}`}
                    fill={colorScale(stem)}
                    x={
                      xScale(new Date(y.data.year, 0, 1)) -
                      xScale2.bandwidth() / 2
                    }
                    y={yScaleSum(y[1])}
                    height={Math.abs(yScaleSum(y[0]) - yScaleSum(y[1]))}
                    width={xScale2.bandwidth()}
                  />
                ));
              })}
            </g>
          </g>
        </Timeline>
        <LegendProportionalRectangle
          transform={`translate(${margin.x} ${height / 3})`}
          data={genealogy.nodes.map((n) => n.size ?? 0)}
          scaleHeight={heightScale}
          title={"Graduates per course per year"}
        />
      </svg>
    </div>
  );
};

export default CourseGenealogy;
