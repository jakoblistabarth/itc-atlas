import {
  ascending,
  descending,
  groups,
  linkHorizontal,
  max,
  path,
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
import { nanoid } from "nanoid";
import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { Vector2 } from "three";
import EventPoint from "../../components/charts/timeline/EventPoint";
import Timeline from "../../components/charts/timeline/Timeline";
import TimelineGrid from "../../components/charts/timeline/TimelineGrid";
import Footer from "../../components/Footer";
import Heading, { Headings } from "../../components/Heading";
import PointLabel from "../../components/map/PointLabel";
import ProportionalSymbolLegend from "../../components/map/ProportionalSymbolLegend";
import Cross from "../../components/shapes/Cross";
import getCourseGenealogy from "../../lib/data/getCourseGenealogy";
import styles from "../../styles/home.module.css";
import { CourseGenealogy } from "../../types/CourseGenealogy";
import { LabelPlacement } from "../../types/LabelPlacement";
import { TimelineEvent } from "../../types/TimelineEvent";

type Props = {
  courseGenealogy: CourseGenealogy;
};

const CourseGenealogy: NextPage<Props> = ({ courseGenealogy }) => {
  const linkGenerator = linkHorizontal();

  courseGenealogy.nodes.forEach((node) => {
    node.dateStart = new Date(node.dateStart);
    node.size = parseInt(node.size);
  });

  courseGenealogy.links.forEach((link) => {
    link.start = new Date(link.start.toString());
    link.end = new Date(link.end.toString());
  });

  const sumsPerYear = rollups(
    courseGenealogy.nodes,
    (v) => sum(v, (d) => d.size),
    (d) => d.dateStart
  );

  const coursesPerYear = groups(courseGenealogy.nodes, (d) =>
    d.dateStart.getFullYear()
  ).map((g) => ({
    year: g[0],
    ...Object.fromEntries(
      rollups(
        g[1],
        (v) => sum(v, (d) => d.size),
        (d) => d.fill
      )
    ),
  }));
  // complete missing keys for d3.stack
  // QUESTION: better way to do this?
  coursesPerYear.forEach((year) => {
    range(1, 7).forEach((stemId) => {
      if (!year[stemId]) year[stemId] = 0;
    });
  });

  const genealogyHeight = 400;
  const barChartHeight = 75;
  const gap = 25;
  const width = 600;
  const height = genealogyHeight + gap + barChartHeight;
  const margin = {
    x: 25,
    t: 35,
    b: 25,
  };
  const tDomain = [new Date(1949, 0, 1), new Date(2020, 0, 1)];
  const tSeq = timeYear.range(tDomain[0], tDomain[1]);
  const xRange = [margin.x, width - margin.x];
  const xScale = scaleTime().domain(tDomain).range(xRange).nice();
  const xScale2 = scaleBand()
    .domain(tSeq.map((d) => d.toISOString()))
    .range(xRange)
    .paddingInner(0.2);
  const yScale = scalePoint()
    .range([margin.t, genealogyHeight])
    .domain(
      courseGenealogy.links
        .sort((a, b) => descending(new Date(a.start), new Date(b.start)))
        .sort((a, b) =>
          ascending(parseInt(a.stem.toString()), parseInt(b.stem.toString()))
        )
        .flatMap((d) => [d.source, d.target])
    );
  const heightScale = scaleLinear()
    .domain([0, max(courseGenealogy.nodes, (n) => n.size) ?? 0])
    .range([0, 25]);
  const yScaleSum = scaleLinear()
    .domain([0, max(sumsPerYear, (d) => d[1]) ?? 1])
    .range([barChartHeight - margin.b, 0]);

  const stems = courseGenealogy.links.reduce((stems, s) => {
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

  // QUESTION: where should I put this? use a customHook? or probably just a utils function?
  const getConnectionPath = (
    node: TimelineEvent,
    previousNode: TimelineEvent | undefined,
    connectionWidth: number
  ) => {
    const height = heightScale(node.size ?? 1);
    const x =
      xScale(node.dateStart) - xScale2.bandwidth() / 2 + connectionWidth;
    const y = yScale(node.yOffset) ?? 0;
    if (!previousNode) {
      const endPath = path();
      endPath.moveTo(x, y - height);
      endPath.lineTo(x - connectionWidth, y);
      endPath.lineTo(x, y + height);
      endPath.closePath();
      return endPath;
    }
    const xPrev =
      xScale(previousNode.dateStart) +
      xScale2.bandwidth() / 2 -
      connectionWidth;
    const heightPrev = heightScale(previousNode.size ?? 1);
    const connectionPath = path();
    connectionPath.moveTo(
      xPrev,
      (yScale(previousNode.yOffset) ?? 0) - heightPrev
    );
    connectionPath.lineTo(x, (yScale(node.yOffset) ?? 0) - height);
    connectionPath.lineTo(x, (yScale(node.yOffset) ?? 0) + height);
    connectionPath.lineTo(
      xPrev,
      (yScale(previousNode.yOffset) ?? 0) + heightPrev
    );
    connectionPath.closePath();
    return connectionPath;
  };

  return (
    <>
      <Head>
        <title>ITC's courses</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Heading Tag={Headings.H1}>Course Genealogy</Heading>
        <Heading Tag={Headings.H2}>
          Graduates of M.Sc. courses over time
        </Heading>
        <svg width={width} height={height}>
          <Timeline>
            <TimelineGrid scale={xScale} height={height} margin={margin.t} />
            <g id={"nodes"} opacity={0.8}>
              {courseGenealogy.nodes.map((node) => {
                const year = node.dateStart.getFullYear();
                const pos = {
                  x: xScale(node.dateStart),
                  y: yScale(node.yOffset),
                } as Vector2;
                const height = heightScale(node.size ?? 1) * 2;
                // const connectionWidth = xScale2.bandwidth() * 0.25;
                const connectionWidth = 0;
                const width = xScale2.bandwidth() - 2 * connectionWidth;
                const prevYear = year - 1;
                const prevNode = courseGenealogy.nodes.find((n) => {
                  return (
                    n.name === node.name &&
                    n.dateStart.getFullYear() == prevYear
                  );
                });
                const connectionPath = getConnectionPath(
                  node,
                  prevNode,
                  connectionWidth
                );
                return node.data?.value === "-" ? (
                  <Cross
                    key={nanoid()}
                    position={pos}
                    length={2}
                    halos={[{ size: 4, color: "white" }]}
                  />
                ) : (
                  <g key={nanoid()} fill={colorScale(node.fill ?? "")}>
                    {/* <path
                      d={connectionPath.toString()}
                      //TODO: add end shape if a stream ands + handle merges
                    /> */}
                    <rect
                      key={nanoid()}
                      x={pos.x - xScale2.bandwidth() / 2}
                      y={pos.y - height / 2}
                      width={xScale2.bandwidth()}
                      height={height}
                    />
                  </g>
                );
              })}
            </g>
            <g id={"links"}>
              {courseGenealogy.links.map((link) => {
                const sourcePos = new Vector2(
                  xScale(link.start),
                  yScale(link.source) ?? 1
                );
                const targetPos = new Vector2(
                  xScale(link.end),
                  yScale(link.target) ?? 1
                );
                return (
                  <g key={nanoid()}>
                    <g opacity={0.25}>
                      <path
                        key={nanoid()}
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
                      {[sourcePos, targetPos].map((p) => (
                        <EventPoint
                          key={nanoid()}
                          position={p}
                          fill={"white"}
                          stroke={"black"}
                          radius={0.5}
                        ></EventPoint>
                      ))}
                    </g>
                    {link.source === link.target && (
                      <PointLabel
                        position={sourcePos}
                        placement={LabelPlacement.LEFT}
                        key={nanoid()}
                        style={{
                          fontSize: 6,
                          fontFamily: "Fraunces",
                          fill: "black",
                          stroke: "white",
                          strokeWidth: 2,
                        }}
                      >
                        <tspan fontWeight={"bold"}>{link.source}</tspan>
                      </PointLabel>
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
                  <>
                    <line
                      key={nanoid()}
                      stroke={"lightgrey"}
                      y1={yScaleSum(tick)}
                      y2={yScaleSum(tick)}
                      x1={width - margin.x}
                      x2={width - margin.x + 2 + +(+(tick % 50 === 0)) * 2}
                    />
                    {tick % 50 === 0 && (
                      <>
                        <PointLabel
                          position={
                            new Vector2(width - margin.x + 2, yScaleSum(tick))
                          }
                          placement={LabelPlacement.RIGHT}
                          key={nanoid()}
                        >
                          {tick}
                        </PointLabel>
                        <line
                          key={nanoid()}
                          stroke={"lightgrey"}
                          strokeWidth={0.5}
                          y1={yScaleSum(tick)}
                          y2={yScaleSum(tick)}
                          x1={margin.x}
                          x2={width - margin.x}
                        />
                      </>
                    )}
                  </>
                ))}
              </g>
              <g id="bars">
                {graduatesStack.map((s) => {
                  const stem = s.key;
                  return s.map((y) => (
                    <rect
                      key={nanoid()}
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
          <ProportionalSymbolLegend
            x={margin.x}
            y={height / 3}
            data={courseGenealogy.nodes.map((n) => n.size ?? 0)}
            scaleRadius={heightScale}
            title={"Graduates per course per year"}
            unitLabel={"graduate"}
            showFunction={false}
          />
        </svg>
      </main>

      <Footer />
    </>
  );
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const courseGenealogy = await getCourseGenealogy();
  return {
    props: {
      courseGenealogy,
    },
  };
};

export default CourseGenealogy;
