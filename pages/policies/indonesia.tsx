import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Footer from "../../components/Footer";
import Heading, { Headings } from "../../components/Heading";
import getBTORsByCountry, {
  BtorsByCountry,
} from "../../lib/data/queries/btors/getBTORsByCountry";
import styles from "../../styles/home.module.css";
import { ProjectIndonesia } from "../../types/Project";
import { TimelineEvent } from "../../types/TimelineEvent";
import getDutchForeignAffairsMinisters from "../../lib/data/getDutchForeignAffairsMinisters";
import { Minister } from "../../types/Minister";
import {
  ascending,
  max,
  range,
  scaleBand,
  scaleOrdinal,
  scalePoint,
  scaleTime,
  sum,
} from "d3";
import LocatorMap from "../../components/map/LocatorMap";
import getCountries from "../../lib/data/getCountries";
import { NeCountriesTopoJson } from "../../types/NeTopoJson";
import { Vector2 } from "three";
import TimelineGrid from "../../components/charts/timeline/TimelineGrid";
import EventPeriod from "../../components/charts/timeline/EventPeriod";
import PointLabel from "../../components/map/PointLabel";
import { LabelPlacement } from "../../types/LabelPlacement";
import { nanoid } from "nanoid";
import Building, { ITClocations } from "../../components/Building";
import PointSymbol from "../../components/map/PointSymbol";
import Star from "../../components/shapes/Star";
import getLongTermMissions from "../../lib/data/getLongTermMissions";
import { LongTermMission } from "../../types/LongTermMission";
import LeaderLine from "../../components/LeaderLine";
import NsidedPolygon from "../../components/shapes/NsidedPolygon";
import { useEffect, useState } from "react";
import NominalLegend from "../../components/map/NominalLegend";
import getProjectsIndonesia from "../../lib/data/getProjectsIndonesia";
import getPhdCandidatesByYear, {
  phdCandidateByYearWithCount,
} from "../../lib/data/queries/phdCandidate/getPhdCandidatesByYear";
import getApplicationsByYear, {
  ApplicationByYearWithCount,
} from "../../lib/data/queries/application/getApplicationsByYear";
import { Text } from "@visx/text";
import { Group } from "@visx/group";
import TopicPatterns from "../../components/TopicPatterns";
import TimelineSeparator from "../../components/charts/timeline/TimelineSeparator";
import TimelineHeader from "../../components/charts/timeline/TimelineHeader";
import Tooltip from "../../components/Tooltip/Tooltip";
import { TooltipTrigger } from "../../components/Tooltip/TooltipTrigger";
import TooltipContent from "../../components/Tooltip/TooltipContent";
import useMeasure from "react-use-measure";

type Props = {
  projects: ProjectIndonesia[];
  phdGraduatesByYear: phdCandidateByYearWithCount;
  applications: ApplicationByYearWithCount;
  btors: BtorsByCountry;
  longTermMissions: LongTermMission[];
  ministers: Minister[];
  neCountries: NeCountriesTopoJson;
};

const IndonesiaTimeline: NextPage<Props> = ({
  projects,
  phdGraduatesByYear,
  applications,
  btors,
  longTermMissions,
  ministers,
  neCountries,
}) => {
  const [timelineRef, { width }] = useMeasure();
  const [isSSR, setIsSSR] = useState(true);
  useEffect(() => {
    setIsSSR(false);
  }, []);

  const commonDomain = [new Date("1945"), new Date(2028, 0, 1)] as [Date, Date];

  const margin = 20;
  const sectionHeaderHeight = 12;
  const rowHeaderHeight = 9;
  const separatorHeight = 10;
  const tlHeights = {
    itcContext: [25, 70],
    policy: [20, 45],
    itc: [130, 20, 30],
  };
  const getSectionHeight = (idx: number) => {
    const section = Object.values(tlHeights)[idx];
    return sum([
      ...section,
      sectionHeaderHeight,
      rowHeaderHeight * section.length,
      separatorHeight,
    ]);
  };
  const getSectionY = (idx: number) => {
    const sections = Object.values(tlHeights).slice(0, idx + 1);
    return sum([...sections.map((_, idx) => getSectionHeight(idx)), margin]);
  };
  const getRowY = (sectionIdx: number, rowIdx: number) => {
    const section = Object.values(tlHeights)[sectionIdx];
    const rows = Object.values(section).slice(0, rowIdx);
    return sum([...rows, sectionHeaderHeight, rowHeaderHeight * rows.length]);
  };
  const height = sum([
    ...range(0, 3).map((idx) => getSectionHeight(idx)),
    margin * 2,
  ]);
  const itcGreen = "teal";
  const itcBlue = "rgb(0, 35, 149)";
  const indonesiaColor = "red";
  const xScale = scaleTime().domain(commonDomain).rangeRound([0, width]);

  const partnersScale = scaleOrdinal<string, string>()
    .domain([
      "BIG",
      "Ministry of environment and Forestry",
      "Gadjah Mada Univesity",
    ])
    .range(["A", "B", "C"]);

  const projectEvents: TimelineEvent[] = projects
    .flatMap((project) => {
      if (!project.dateStart || !project.dateEnd) return [];
      return {
        name: project.nameShort ?? "unnamed project",
        yOffset: project.id ?? "",
        dateStart: new Date(project.dateStart),
        dateEnd: new Date(project.dateEnd),
        data: project,
      };
    })
    .sort((a, b) => ascending(a.dateStart, b.dateStart));

  const projectsYScale = scalePoint()
    .domain(projectEvents.map((d) => d.yOffset))
    .range([0, 120]);

  const namesITC = [
    {
      year: 1950,
      name: "Internationaal Opleidingscentrum voor Luchtkartering",
    },
    {
      year: 1958,
      name: "International Training Centre for Aerial Survey I.T.C",
    },
    {
      year: 1966,
      name: "International Institute for Aerial Survey and Earth Sciences I.T.C.",
    },
    {
      year: 1972,
      name: "International Institute for Aerial Survey and Earth Sciences (ITC)",
    },
    {
      year: 1984,
      name: "International Institute for Aero-space Survey and Earth Sciences (ITC)",
    },
    {
      year: 2001,
      name: "International Institute for Geoinformation Science and Earth Observation",
    },
    {
      year: 2010,
      name: "Faculty of Geoinformation Science and Earth Observation",
    },
  ];
  const renamingEvents: TimelineEvent[] = namesITC.map((d, idx) => {
    const next = namesITC[idx + 1];
    const dateEnd = next ? new Date(next.year + "") : new Date();
    return {
      name: d.name,
      dateStart: new Date(d.year + ""),
      dateEnd: dateEnd,
      yOffset: "",
    };
  });

  const topicsRaw = [
    { name: "poverty reduction", dateStart: 1972, dateEnd: 2023 },
    { name: "water", dateStart: 2002, dateEnd: 2007 },
    { name: "water", dateStart: 2010, dateEnd: 2023 },
    { name: "food", dateStart: 2002, dateEnd: 2007 },
    { name: "food", dateStart: 2010, dateEnd: 2023 },
    { name: "health", dateStart: 2002, dateEnd: 2023 },
    { name: "climate", dateStart: 2007, dateEnd: 2010 },
    { name: "climate", dateStart: 2012, dateEnd: 2023 },
  ];
  const topics = topicsRaw
    .map((d) => {
      const start = new Date(d.dateStart + "");
      const end = new Date(d.dateEnd + "");
      return {
        name: d.name,
        dateStart: start,
        dateEnd: end,
      };
    })
    .sort((a, b) => ascending(a.dateStart, b.dateStart));

  const topicYScale = scaleBand()
    .domain(topics.map((d) => d.name))
    .range([0, tlHeights.policy[1] - 10])
    .paddingInner(0.15);
  const topicPatternScale = scaleOrdinal<string, string>()
    .domain(topics.map((d) => d.name))
    .range(["A", "B", "C", "D", "E"]);

  const firstTopicOccurences = topicPatternScale
    .domain()
    .map((topic) => topics.find((t) => t.name === topic));

  const btorEvents: TimelineEvent[] = btors.flatMap((btor) => {
    if (!btor.start || !btor.end) return [];
    return {
      name: "",
      yOffset: "",
      dateStart: new Date(btor.start),
      dateEnd: new Date(btor.end),
    };
  });
  const longTermMissionEvents: TimelineEvent[] = longTermMissions.flatMap(
    (ltm) => {
      if (!ltm.dateStart || !ltm.dateEnd) return [];
      return {
        name: ltm.project,
        yOffset: ltm.project,
        dateStart: new Date(ltm.dateStart),
        dateEnd: new Date(ltm.dateEnd),
      };
    }
  );
  const ltmYScale = scaleBand()
    .domain(longTermMissions.map((d) => d.project))
    .range([0, tlHeights.itc[1]]);

  const examEvents: TimelineEvent[] = applications.map((d) => {
    return {
      name: d.examYear + "",
      yOffset: "",
      dateStart: new Date(d.examYear ?? 0, 0, 1),
      size: d._count._all,
    };
  });

  const ministerEvents: TimelineEvent[] = ministers.map((minister, idx) => {
    const next = ministers[idx + 1];
    const dateEnd = next ? new Date(next.dateStart + "") : new Date();
    return {
      name: minister.name,
      yOffset: "",
      dateStart: new Date(minister.dateStart + ""),
      dateEnd: new Date(dateEnd),
      fill: "black",
      data: { party: minister.party },
    };
  });
  const parties = Array.from(new Set(ministers.map((d) => d.party)));
  const renderPartySymbol = (party: string) => {
    const size = 6;
    const oR = size / 2;
    const iR = oR / 2;
    const style = {
      fill: "white",
      stroke: itcBlue,
      strokeLinejoin: "round" as const, //QUESTION: good practice?
    };
    switch (party) {
      case parties[0]:
        return <Star {...style} innerRadius={iR} outerRadius={oR} />;
      case parties[1]:
        return <NsidedPolygon sides={4} radius={size / 2} {...style} />;
      case parties[2]:
        return (
          <NsidedPolygon
            sides={4}
            radius={size / 2}
            transform="rotate(45)"
            {...style}
          />
        );
      default:
        return <NsidedPolygon sides={3} radius={size / 2} {...style} />;
    }
  };

  return (
    <>
      <Head>
        <title>ITC&apos;s Impact in Indonesia</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Heading Tag={Headings.H1}>ITC&apos;s Activities in Indonesia</Heading>
        <div style={{ width: "100%", height: "100%", padding: "0 1em" }}>
          <svg
            ref={timelineRef}
            width={"100%"}
            height={"100%"}
            fontSize="6"
            fontFamily="Inter"
            viewBox={`0 0 ${width} ${height}`}
          >
            <TimelineGrid scale={xScale} height={height} margin={margin} />
            <TimelineSeparator
              width={width}
              strokeWidth={separatorHeight}
              y={getSectionY(0)}
            />
            <TimelineSeparator
              width={width}
              strokeWidth={separatorHeight}
              y={getSectionY(1)}
            />

            <g id="itcContextEvents" transform={`translate(0 ${margin})`}>
              <Group top={sectionHeaderHeight}>
                <TimelineHeader fill={itcGreen} fontSize={sectionHeaderHeight}>
                  ITC History
                </TimelineHeader>
                <g id="nameChanges" transform={`translate(0 ${getRowY(0, 0)})`}>
                  <TimelineHeader
                    fill={itcGreen}
                    fontWeight={"bold"}
                    fontSize={rowHeaderHeight}
                  >
                    Name changes
                  </TimelineHeader>
                  <Group top={rowHeaderHeight}>
                    {renamingEvents.map((ne, idx) => {
                      const isEven = idx % 2 === 0;
                      return (
                        <EventPeriod
                          key={`renaming-${idx}`}
                          dateStart={ne.dateStart}
                          dateEnd={ne.dateEnd ?? new Date()}
                          xScale={xScale}
                          yOffset={0}
                          height={1}
                          fill={itcGreen}
                        >
                          {!isSSR && (
                            <Text
                              fontSize={6}
                              fill={itcGreen}
                              width={200}
                              y={isEven ? 5 : -5}
                              x={5}
                              verticalAnchor={isEven ? "start" : "end"}
                            >
                              {ne.name}
                            </Text>
                          )}
                          <line
                            y2={10 * (isEven ? 1 : -1)}
                            stroke={itcGreen}
                            strokeWidth={0.5}
                          />
                          <PointSymbol
                            position={new Vector2()}
                            radius={2}
                            stroke={itcGreen}
                            fill={"white"}
                            fillOpacity={1}
                            interactive={false}
                          />
                        </EventPeriod>
                      );
                    })}
                  </Group>
                </g>
                <g id="moves" transform={`translate(0 ${getRowY(0, 1)})`}>
                  <TimelineHeader
                    fill={itcGreen}
                    fontWeight={"bold"}
                    fontSize={rowHeaderHeight}
                  >
                    Moves
                  </TimelineHeader>
                  <Group top={rowHeaderHeight}>
                    {Array.from(ITClocations.keys()).map((d, idx) => {
                      const currentLocation = ITClocations.get(d);
                      if (!currentLocation) return <></>;
                      const width = 70;
                      const next = Array.from(ITClocations.entries())[idx + 1];
                      const dateEnd = next
                        ? next[1].moveInDate
                        : new Date(2050, 0, 1);
                      return (
                        <g key={nanoid()}>
                          <rect
                            x={xScale(new Date(currentLocation.moveInDate))}
                            y={width / 2 - 1}
                            width={
                              xScale(new Date(dateEnd)) -
                              xScale(new Date(currentLocation.moveInDate))
                            }
                            height={1}
                            fill={itcGreen}
                          />
                          <g
                            transform={`translate(${xScale(
                              new Date(currentLocation.moveInDate)
                            )} 0)`}
                          >
                            <line
                              y1={width / 2}
                              y2={width / 2 + 5}
                              stroke={itcGreen}
                            />
                            <Building
                              position={new Vector2(0, width / 2 / 2)}
                              color={itcGreen}
                              width={width}
                              location={d}
                            />
                            <PointSymbol
                              position={new Vector2(0, width / 2)}
                              fillOpacity={1}
                              fill={"white"}
                              stroke={itcGreen}
                              interactive={false}
                            />
                            <PointLabel
                              position={new Vector2(0, width / 2)}
                              placement={LabelPlacement.BOTTOM}
                              fill={itcGreen}
                              fontSize={6}
                            >
                              <tspan
                                fontWeight={"bold"}
                                fontFamily={"Fraunces"}
                              >
                                {d}
                              </tspan>
                              <tspan x="0" dy="7">
                                {currentLocation.city}
                              </tspan>
                            </PointLabel>
                          </g>
                        </g>
                      );
                    })}
                  </Group>
                </g>
              </Group>
            </g>
            <g
              id="policyEvents"
              fill={itcBlue}
              transform={`translate(0 ${getSectionY(0)})`}
            >
              <Group top={sectionHeaderHeight}>
                <TimelineHeader fill={itcBlue} fontSize={sectionHeaderHeight}>
                  Government Context
                </TimelineHeader>
                <g id="ministers" transform={`translate(0 ${getRowY(1, 0)})`}>
                  <TimelineHeader
                    color={itcBlue}
                    fontWeight={"bold"}
                    fontSize={rowHeaderHeight}
                  >
                    Ministers in charge
                  </TimelineHeader>
                  <Group top={rowHeaderHeight}>
                    <NominalLegend
                      entries={parties.map((d) => ({
                        label: d,
                        color: itcBlue,
                        symbol: renderPartySymbol(d),
                      }))}
                      columns={4}
                      columnWidth={35}
                    />
                    {ministerEvents.map((ce) => {
                      return (
                        <EventPeriod
                          key={nanoid()}
                          dateStart={ce.dateStart}
                          dateEnd={ce.dateEnd ?? new Date()}
                          xScale={xScale}
                          yOffset={0}
                          height={1}
                        >
                          <g transform="rotate(-45) translate(2 0)">
                            <PointLabel placement={LabelPlacement.RIGHT}>
                              {ce.name}
                            </PointLabel>
                          </g>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <g>
                                {ce.data?.party &&
                                  renderPartySymbol(ce.data?.party as string)}
                              </g>
                            </TooltipTrigger>
                            <TooltipContent>
                              <h3>{ce.name}</h3>
                              {ce.data?.party} <br />
                              {ce.dateStart.getFullYear()}–
                              {ce.dateEnd?.getFullYear()}
                            </TooltipContent>
                          </Tooltip>
                        </EventPeriod>
                      );
                    })}
                  </Group>
                </g>
                <g id="topics" transform={`translate(0, ${getRowY(1, 1)})`}>
                  <TimelineHeader
                    color={itcBlue}
                    fontWeight={"bold"}
                    fontSize={rowHeaderHeight}
                  >
                    Development aid priorities
                  </TimelineHeader>
                  <Group top={rowHeaderHeight}>
                    <TopicPatterns color={itcBlue} />
                    {topics.map((topic) => (
                      <EventPeriod
                        key={nanoid()}
                        dateStart={new Date(topic.dateStart)}
                        dateEnd={new Date(topic.dateEnd)}
                        xScale={xScale}
                        yOffset={topicYScale(topic.name) ?? 0}
                        height={topicYScale.bandwidth()}
                        fill={`url(#${topicPatternScale(topic.name)})`}
                      />
                    ))}
                    {firstTopicOccurences.map((topic) => (
                      <PointLabel
                        key={nanoid()}
                        placement={LabelPlacement.LEFT}
                        position={
                          new Vector2(
                            xScale(topic?.dateStart ?? 0),
                            topicYScale(topic?.name ?? "")
                          )
                        }
                      >
                        {topic?.name}
                      </PointLabel>
                    ))}
                  </Group>
                </g>
              </Group>
            </g>
            <g id="itcEvents" transform={`translate(0 ${getSectionY(1)})`}>
              <Group top={sectionHeaderHeight}>
                <TimelineHeader
                  fill={indonesiaColor}
                  fontSize={sectionHeaderHeight}
                >
                  Activities in Indonesia
                </TimelineHeader>
                <g transform={`translate(0,${getRowY(2, 0)})`}>
                  <TimelineHeader
                    fill={indonesiaColor}
                    fontWeight={"bold"}
                    fontSize={rowHeaderHeight}
                  >
                    Projects
                  </TimelineHeader>
                  <Group top={rowHeaderHeight}>
                    {projectEvents.map((e) => (
                      <EventPeriod
                        key={nanoid()}
                        dateStart={e.dateStart}
                        dateEnd={e.dateEnd ?? new Date()}
                        xScale={xScale}
                        yOffset={projectsYScale(e.yOffset) ?? 0}
                        height={2}
                        fill={indonesiaColor}
                      >
                        {e.data?.projectPartner && (
                          <g transform="translate(-6 0)">
                            <circle r={4} fill={indonesiaColor} />
                            <text
                              textAnchor="middle"
                              dy={6 / 2.5}
                              fontWeight={"bold"}
                              fill={"white"}
                            >
                              {partnersScale(
                                (e.data?.projectPartner as string) ?? ""
                              )}
                            </text>
                          </g>
                        )}
                      </EventPeriod>
                    ))}
                  </Group>
                </g>

                <g transform={`translate(0 ${getRowY(2, 1)})`}>
                  <TimelineHeader
                    fill={indonesiaColor}
                    fontWeight={"bold"}
                    fontSize={rowHeaderHeight}
                  >
                    Staff travels
                  </TimelineHeader>
                  <Group top={rowHeaderHeight}>
                    {btorEvents.map((e) => (
                      <EventPeriod
                        key={nanoid()}
                        dateStart={e.dateStart}
                        dateEnd={e.dateEnd ?? new Date()}
                        xScale={xScale}
                        yOffset={0}
                        height={2}
                        fill={indonesiaColor}
                        fillOpacity={0.2}
                      />
                    ))}
                    <g transform={`translate(0 ${tlHeights.itc[1] / -2} )`}>
                      {longTermMissionEvents.map((e) => (
                        <EventPeriod
                          key={nanoid()}
                          dateStart={e.dateStart}
                          dateEnd={e.dateEnd ?? new Date()}
                          xScale={xScale}
                          yOffset={ltmYScale(e.yOffset) ?? 0}
                          height={2}
                          fill={indonesiaColor}
                          fillOpacity={0.2}
                        />
                      ))}
                    </g>
                  </Group>
                </g>

                <g transform={`translate(0 ${getRowY(2, 2)})`}>
                  <TimelineHeader
                    fill={indonesiaColor}
                    fontWeight={"bold"}
                    fontSize={rowHeaderHeight}
                  >
                    Graduates & PhDs
                  </TimelineHeader>
                  <Group top={rowHeaderHeight}>
                    {examEvents.map((e) => {
                      const barWidth = width / 100;
                      const height = (e.size ?? 0) / 3;
                      return (
                        <rect
                          key={nanoid()}
                          width={barWidth}
                          height={height}
                          x={xScale(e.dateStart) - barWidth / 2}
                          y={height / -2}
                          rx={1}
                          fill={indonesiaColor}
                        />
                      );
                    })}
                    {phdGraduatesByYear
                      .filter((d) => d.promotionYear)
                      .map((d) => {
                        const r = 2;
                        const gap = r * 3;
                        return range(0, d._count._all).map((_, idx) => {
                          const hasEvenChilds = d._count._all % 2 === 0;
                          const offset = hasEvenChilds ? gap / -2 : 0;
                          const direction = idx % 2 ? 1 : -1;
                          return (
                            <circle
                              key={nanoid()}
                              r={r}
                              cx={xScale(new Date(d.promotionYear + ""))}
                              cy={offset + Math.ceil(idx / 2) * gap * direction}
                              stroke={"black"}
                              strokeWidth={1}
                              fill={"white"}
                            />
                          );
                        });
                      })}
                  </Group>
                </g>
              </Group>
            </g>
            <g id="annotations">
              {!isSSR && (
                <g id="annotation-travels">
                  <g
                    textAnchor="center"
                    transform={`translate(${width / 2 + width / 10}, 370)`}
                  >
                    <Text fontFamily="Fraunces" fontWeight={"bold"}>
                      Travels over time
                    </Text>
                    <Text
                      verticalAnchor={"start"}
                      width={max([width / 2, 300])}
                      y={2}
                    >
                      The travels were comparatively long in the beginning and
                      got much shorter in the current century. Darker shades of
                      red indicate overlapping travels.
                    </Text>
                  </g>
                  <LeaderLine
                    sourcePos={new Vector2(xScale(new Date("2002")), 400)}
                    targetPos={new Vector2(xScale(new Date("1990")), 418)}
                    orientation="vertical"
                    stroke="black"
                    strokeWidth={0.5}
                  />
                  <LeaderLine
                    sourcePos={new Vector2(xScale(new Date("2002")), 400)}
                    targetPos={new Vector2(xScale(new Date("2010")), 425)}
                    orientation="vertical"
                    stroke="black"
                    strokeWidth={0.5}
                  />
                </g>
              )}
            </g>
          </svg>
        </div>
        <h2>Indonesia</h2>
        <LocatorMap neCountriesTopoJson={neCountries} highlight={["IDN"]} />
      </main>
      <Footer />
    </>
  );
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const [
    projects,
    phdGraduatesByYear,
    btors,
    longTermMissions,
    applications,
    ministers,
    neCountries,
  ] = await Promise.all([
    getProjectsIndonesia(),
    getPhdCandidatesByYear("IDN"),
    getBTORsByCountry("IDN"),
    getLongTermMissions(),
    getApplicationsByYear("IDN"),
    getDutchForeignAffairsMinisters(),
    getCountries(),
  ]);

  return {
    props: {
      projects,
      phdGraduatesByYear,
      btors,
      longTermMissions,
      applications,
      ministers,
      neCountries,
    },
  };
};

export default IndonesiaTimeline;
