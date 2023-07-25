/** @jsxImportSource theme-ui */

import {
  ascending,
  range,
  scaleBand,
  scaleOrdinal,
  scalePoint,
  scaleTime,
  sum,
  max,
} from "d3";
import { FC, PropsWithChildren, useEffect, useState } from "react";
import useMeasure from "react-use-measure";
import { Text as TextTui } from "theme-ui";
import { Text } from "@visx/text";
import { Group } from "@visx/group";
import { TimelineEvent } from "../types/TimelineEvent";
import Star from "./shapes/Star";
import NsidedPolygon from "./shapes/NsidedPolygon";
import TimelineGrid from "./charts/timeline/TimelineGrid";
import TimelineSeparator from "./charts/timeline/TimelineSeparator";
import TimelineHeader from "./charts/timeline/TimelineHeader";
import EventPeriod from "./charts/timeline/EventPeriod";
import PointSymbol from "./map/PointSymbol";
import Building, { ITClocations } from "./Building";
import PointLabel from "./map/PointLabel";
import NominalLegend from "./map/NominalLegend";
import Tooltip from "./Tooltip/Tooltip";
import { TooltipTrigger } from "./Tooltip/TooltipTrigger";
import TooltipContent from "./Tooltip/TooltipContent";
import { LabelPlacement } from "../types/LabelPlacement";
import TopicPatterns from "./TopicPatterns";
import { Vector2 } from "three";
import LeaderLine from "./LeaderLine";
import { ProjectIndonesia } from "../types/Project";
import { phdsByYearWithCount } from "../lib/data/queries/phd/getPhdsByYear";
import { ApplicationByYearWithCount } from "../lib/data/queries/application/getApplicationsByYear";
import { LongTermMission } from "../types/LongTermMission";
import { Minister } from "../types/Minister";
import { BtorsByCountry } from "../lib/data/queries/btors/getBTORsByCountry";

type Props = PropsWithChildren<{
  applications: ApplicationByYearWithCount;
  btors: BtorsByCountry;
  longTermMissions: LongTermMission[];
  ministers: Minister[];
  phdsByYear: phdsByYearWithCount;
  projects: ProjectIndonesia[];
}>;

const IndonesiaTimeline: FC<Props> = ({
  applications,
  btors,
  longTermMissions,
  ministers,
  phdsByYear,
  projects,
}) => {
  const [isSSR, setIsSSR] = useState(true);
  useEffect(() => {
    setIsSSR(false);
  }, []);
  const [timelineRef, { width }] = useMeasure();

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
        yOffset: project.nameShort ?? "",
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
      cursor: "pointer",
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
                  <g key={d}>
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
                        <tspan fontWeight={"bold"} fontFamily={"Fraunces"}>
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
              {ministerEvents.map((ce, idx) => {
                return (
                  <EventPeriod
                    key={`${ce.name}-${idx}`}
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
                        <h4>{ce.name}</h4>
                        {ce.data?.party} <br />
                        {ce.dateStart.getFullYear()}–{ce.dateEnd?.getFullYear()}
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
              {topics.map((topic, idx) => (
                <EventPeriod
                  key={`topic-${idx}`}
                  dateStart={new Date(topic.dateStart)}
                  dateEnd={new Date(topic.dateEnd)}
                  xScale={xScale}
                  yOffset={topicYScale(topic.name) ?? 0}
                  height={topicYScale.bandwidth()}
                  fill={`url(#${topicPatternScale(topic.name)})`}
                />
              ))}
              {firstTopicOccurences.map((topic, idx) => (
                <PointLabel
                  key={`topic-${idx}`}
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
          <TimelineHeader fill={indonesiaColor} fontSize={sectionHeaderHeight}>
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
              {projectEvents.map((e, idx) => (
                <Tooltip key={`${e.name}-${idx}`}>
                  <TooltipTrigger asChild>
                    <g>
                      <EventPeriod
                        dateStart={e.dateStart}
                        dateEnd={e.dateEnd ?? new Date()}
                        xScale={xScale}
                        yOffset={projectsYScale(e.yOffset) ?? 0}
                        height={2}
                        fill={indonesiaColor}
                        cursor="pointer"
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
                    </g>
                  </TooltipTrigger>
                  <TooltipContent>
                    <h4>{e.name}</h4>
                    {e.dateStart.toDateString()}–{e.dateEnd?.toDateString()}
                  </TooltipContent>
                </Tooltip>
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
              {btorEvents.map((e, idx) => (
                <EventPeriod
                  key={`${e.name}-${idx}`}
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
                {longTermMissionEvents.map((e, idx) => (
                  <EventPeriod
                    key={`${e.name}-${idx}`}
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
              {examEvents.map((e, idx) => {
                const barWidth = width / 100;
                const height = (e.size ?? 0) / 3;
                return (
                  <Tooltip key={`${e.name}-${idx}`}>
                    <TooltipTrigger asChild>
                      <rect
                        width={barWidth}
                        height={height}
                        x={xScale(e.dateStart) - barWidth / 2}
                        y={height / -2}
                        rx={1}
                        fill={indonesiaColor}
                        cursor="pointer"
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <TextTui variant="kpi">{e.size}</TextTui>
                      <div>alumni in</div>
                      <strong>{e.dateStart.getFullYear()}</strong>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
              {phdsByYear
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
                        key={`${d.promotionYear}-${idx}`}
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
                The travels were comparatively long in the beginning and got
                much shorter in the current century. Darker shades of red
                indicate overlapping travels.
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
  );
};

export default IndonesiaTimeline;
