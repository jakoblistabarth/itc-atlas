import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Footer from "../../components/Footer";
import Heading, { Headings } from "../../components/Heading";
import getAlumniByCountry from "../../lib/data/getAlumniByCountry";
import getBTORsByCountry from "../../lib/data/getBTORsByCountry";
import getPhdCandidatesByCountry from "../../lib/data/getPhdCandidatesByCountry";
import getProjectsIn from "../../lib/data/getProjectsIn";
import styles from "../../styles/home.module.css";
import { Alumni } from "../../types/Alumni";
import { PhdCandidate } from "../../types/PhdCandidate";
import { Project } from "../../types/Project";
import { TimelineEvent } from "../../types/TimelineEvent";
import { BTOR } from "../../types/Travels";
import { rollups } from "d3-array";
import getDutchForeignAffairsMinisters from "../../lib/data/getDutchForeignAffairsMinisters";
import { Minister } from "../../types/Minister";
import {
  ascending,
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
import { BiCoin, BiFirstAid, BiRestaurant, BiWater } from "react-icons/bi";
import { WiThermometer } from "react-icons/Wi";
import Star from "../../components/shapes/Star";
import getLongTermMissions from "../../lib/data/getLongTermMissions";
import { LongTermMission } from "../../types/LongTermMission";
import LeaderLine from "../../components/LeaderLine";

type Props = {
  projects: Project[];
  phdCandidates: PhdCandidate[];
  alumni: Alumni[];
  btors: BTOR[];
  longTermMissions: LongTermMission[];
  ministers: Minister[];
  neCountries: NeCountriesTopoJson;
};

const IndonesiaTimeline: NextPage<Props> = ({
  projects,
  phdCandidates,
  alumni,
  btors,
  longTermMissions,
  ministers,
  neCountries,
}) => {
  const commonDomain = [new Date("1945"), new Date(2028, 0, 1)] as [Date, Date];

  const tlHeights = {
    itcContext: 120,
    policy: 120,
    itc: 165,
  };
  const width = 900;
  const margin = 40;
  const height = sum([...Object.values(tlHeights)]) + margin * 2;
  const itcGreen = "teal";
  const indonesiaColor = "red";
  const xScale = scaleTime().domain(commonDomain).range([0, width]);

  const projectEvents: TimelineEvent[] = projects
    .flatMap((project) => {
      if (!project.dateStart || !project.dateEnd) return [];
      return {
        name: project.projectName ?? "unnamed project",
        yOffset: project.projectID ?? "",
        dateStart: new Date(project.dateStart),
        dateEnd: new Date(project.dateEnd),
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
    const dateEnd = next ? new Date(next.year + "GMT") : new Date();
    return {
      name: d.name,
      dateStart: new Date(d.year + "GMT"),
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
  const topics = topicsRaw.map((d) => {
    const start = new Date(d.dateStart + "GMT");
    const end = new Date(d.dateEnd + "GMT");
    return {
      name: d.name,
      dateStart: start,
      dateEnd: end,
    };
  });

  const topicYScale = scaleBand()
    .domain(topics.map((d) => d.name))
    .range([0, 40])
    .paddingInner(0.15);
  const topicColorScale = scaleOrdinal<string, string>()
    .domain(topics.map((d) => d.name))
    .range([
      "orange",
      "cornflowerblue",
      "darkslateblue",
      "red",
      "darkred",
      "purple",
    ]);
  const btorEvents: TimelineEvent[] = btors.flatMap((btor) => {
    if (!btor.dateStart || !btor.dateEnd) return [];
    return {
      name: btor.destination,
      yOffset: "",
      dateStart: new Date(btor.dateStart),
      dateEnd: new Date(btor.dateEnd),
    };
  });
  const LongTermMissionEvents: TimelineEvent[] = longTermMissions.flatMap(
    (ltm) => {
      if (!ltm.dateStart || !ltm.dateEnd) return [];
      return {
        name: ltm.projectName,
        yOffset: "",
        dateStart: new Date(ltm.dateStart),
        dateEnd: new Date(ltm.dateEnd),
      };
    }
  );

  const travels = btorEvents.concat(LongTermMissionEvents);

  const phdGraduatesPerYear = rollups(
    phdCandidates.filter((d) => d.datePromotion),
    (v) => v.length,
    (d) => new Date(d.datePromotion).getFullYear()
  );

  const alumniPerYear = rollups(
    alumni,
    (v) => v.length,
    (d) => d.examYear
  );
  const examEvents: TimelineEvent[] = alumniPerYear
    .filter(([year]) => year)
    .map(([year, size]) => {
      return {
        name: year,
        yOffset: "",
        dateStart: new Date(parseInt(year), 0, 1),
        size: size,
      };
    });

  const ministerEvents: TimelineEvent[] = ministers.map((minister, idx) => {
    const next = ministers[idx + 1];
    const dateEnd = next ? new Date(next.dateStart + "GMT") : new Date();
    return {
      name: minister.name,
      yOffset: "",
      dateStart: new Date(minister.dateStart),
      dateEnd: new Date(dateEnd),
      fill: "black",
      data: { party: minister.party },
    };
  });
  const parties = Array.from(new Set(ministers.map((d) => d.party)));
  const renderPartySymbol = (party: string) => {
    const size = 6;
    const w = size * 0.75;
    const oR = size / 2;
    const iR = oR / 2;
    const style = {
      fill: "white",
      stroke: "black",
      strokeLinejoin: "round" as const, //QUESTION: good practice?
    };
    switch (party) {
      case parties[0]:
        return <Star {...style} innerRadius={iR} outerRadius={oR} />;
      case parties[1]:
        return (
          <Star
            {...style}
            transform="rotate(45)"
            innerRadius={iR}
            outerRadius={oR}
          />
        );
      case parties[2]:
        return (
          <rect
            {...style}
            width={w}
            height={w}
            transform={`translate(${-w / 2} ${-w / 2})`}
          />
        );
      default:
        return (
          <rect
            {...style}
            width={w}
            height={w}
            transform={`rotate(45) translate(${-w / 2} ${-w / 2})`}
          />
        );
    }
  };

  const TimelineHeader = ({ color = "black", children }) => {
    return (
      <text
        fill={color}
        dy={-5}
        fontFamily="Fraunces"
        fontWeight={"bold"}
        fontSize={9}
      >
        {children}
      </text>
    );
  };
  const TimelineSeparator = ({ y = 0 }) => {
    return (
      <line
        x1="0"
        x2={width}
        y1={y - 30}
        y2={y - 30}
        stroke="white"
        strokeWidth={10}
        fill="none"
      />
    );
  };

  const renderTopicIcon = (topic: string) => {
    const size = "1.5em";
    switch (topic) {
      case "poverty reduction":
        return <BiCoin size={size} color={topicColorScale(topic)} />;
      case "water":
        return <BiWater size={size} color={topicColorScale(topic)} />;
      case "food":
        return <BiRestaurant size={size} color={topicColorScale(topic)} />;
      case "health":
        return <BiFirstAid size={size} color={topicColorScale(topic)} />;
      case "climate":
        return <WiThermometer size={size} color={topicColorScale(topic)} />;
    }
  };

  return (
    <>
      <Head>
        <title>ITC's Impact in Indonesia</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Heading Tag={Headings.H1}>ITC's Activities in Indonesia</Heading>
        <svg width={width} height={height} fontSize="6" fontFamily="Inter">
          {/* <rect width="100%" height={margin} fill="blue" />
          <rect
            width="100%"
            height={tlHeights.itcContext}
            y={margin}
            fill="pink"
          />
          <rect
            width="100%"
            height={tlHeights.policy}
            y={margin + tlHeights.itcContext}
            fill="lightblue"
          />
          <rect
            width="100%"
            height={tlHeights.itc}
            y={margin + tlHeights.itcContext + tlHeights.policy}
            fill="pink"
          />
          <rect
            width="100%"
            height={margin}
            y={margin + tlHeights.itcContext + tlHeights.policy + tlHeights.itc}
            fill="blue"
          /> */}
          <TimelineGrid scale={xScale} height={height} margin={margin} />
          <g id="itcContextEvents" transform={`translate(0 ${margin})`}>
            <TimelineHeader>Name changes</TimelineHeader>
            <g id="nameChanges">
              {renamingEvents.map((ne, idx) => {
                const isEven = idx % 2 === 0;
                return (
                  <EventPeriod
                    key={nanoid()}
                    dateStart={ne.dateStart}
                    dateEnd={ne.dateEnd ?? new Date()}
                    xScale={xScale}
                    yOffset={0}
                    height={1}
                    fill={itcGreen}
                  >
                    <PointLabel
                      placement={
                        isEven
                          ? LabelPlacement.BOTTOMRIGHT
                          : LabelPlacement.TOPRIGHT
                      }
                      style={{ fill: itcGreen, fontSize: 6 }}
                    >
                      {ne.name}
                    </PointLabel>
                    <line
                      y2={10 * (isEven ? 1 : -1)}
                      stroke={itcGreen}
                      strokeWidth={0.5}
                    />
                    <PointSymbol
                      position={new Vector2()}
                      radius={2}
                      style={{
                        stroke: itcGreen,
                        fill: "white",
                        fillOpacity: 1,
                      }}
                    />
                  </EventPeriod>
                );
              })}
            </g>
            <g id="moves" transform="translate(0 25)">
              <TimelineHeader>Moves</TimelineHeader>
              {Array.from(ITClocations.keys()).map((d, idx) => {
                const currentLocation = ITClocations.get(d);
                if (!currentLocation) return <></>;
                const width = 70;
                const next = Array.from(ITClocations.entries())[idx + 1];
                const dateEnd = next
                  ? next[1].moveInDate
                  : new Date(2050, 0, 1);
                return (
                  <>
                    <rect
                      key={nanoid()}
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
                      key={nanoid()}
                      transform={`translate(${xScale(
                        new Date(currentLocation.moveInDate)
                      )} 0)`}
                    >
                      <line
                        y1={width / 2}
                        y2={width / 2 + 5}
                        stroke={itcGreen}
                      />
                      <Building color={itcGreen} width={width} location={d} />
                      <PointSymbol
                        position={new Vector2(0, width / 2)}
                        style={{
                          fillOpacity: 1,
                          fill: "white",
                          stroke: itcGreen,
                        }}
                      />
                      <PointLabel
                        position={new Vector2(0, width / 2)}
                        placement={LabelPlacement.BOTTOM}
                        style={{ fill: itcGreen, fontSize: 6 }}
                      >
                        <tspan fontWeight={"bold"} fontFamily={"Fraunces"}>
                          {d}
                        </tspan>
                        <tspan x="0" dy="7">
                          {currentLocation.city}
                        </tspan>
                      </PointLabel>
                    </g>
                  </>
                );
              })}
            </g>
            <TimelineSeparator y={tlHeights.itcContext} />
          </g>
          <g
            id="policyEvents"
            transform={`translate(0 ${margin + tlHeights.itcContext})`}
          >
            <g id="ministers">
              <TimelineHeader>Ministers in charge</TimelineHeader>
              {ministerEvents.map((ce) => (
                <EventPeriod
                  key={nanoid()}
                  dateStart={ce.dateStart}
                  dateEnd={ce.dateEnd ?? new Date()}
                  xScale={xScale}
                  yOffset={0}
                  fill={ce.fill}
                  height={1}
                >
                  <g transform="rotate(-45) translate(2 0)">
                    <PointLabel placement={LabelPlacement.RIGHT}>
                      {ce.name}
                    </PointLabel>
                  </g>
                  {ce.data?.party &&
                    renderPartySymbol(ce.data?.party as string)}
                  {/* TODO: fix typing? */}
                </EventPeriod>
              ))}
            </g>
            <g id="topics" transform="translate(0, 30)">
              <TimelineHeader>Development aid priorities</TimelineHeader>
              {topics.map((topic) => (
                <>
                  <EventPeriod
                    key={nanoid()}
                    dateStart={new Date(topic.dateStart)}
                    dateEnd={new Date(topic.dateEnd)}
                    xScale={xScale}
                    yOffset={topicYScale(topic.name) ?? 0}
                    height={topicYScale.bandwidth()}
                    stroke="black"
                    strokeWidth={0.5}
                    rx={1}
                    fill={`url(#${topicPatternScale(topic.name)})`}
                  />
                  <g transform={`translate(0 ${topicYScale(topic.name)})`}>
                    {renderTopicIcon(topic.name)}
                    <PointLabel
                      position={new Vector2(10, topicYScale.bandwidth() / 2)}
                      placement={LabelPlacement.RIGHT}
                      style={{ fill: topicColorScale(topic.name), fontSize: 6 }}
                    >
                      {topic.name}
                    </PointLabel>
                  </g>
                </>
              ))}
            </g>
            <TimelineSeparator y={tlHeights.policy} />
          </g>
          <g
            id="itcEvents"
            transform={`translate(0 ${
              margin + tlHeights.itcContext + tlHeights.policy
            })`}
          >
            <g>
              <TimelineHeader>Projects</TimelineHeader>
              {projectEvents.map((e) => (
                <EventPeriod
                  key={nanoid()}
                  dateStart={e.dateStart}
                  dateEnd={e.dateEnd ?? new Date()}
                  xScale={xScale}
                  yOffset={projectsYScale(e.yOffset) ?? 0}
                  height={2}
                  fill={indonesiaColor}
                />
              ))}
            </g>

            <g transform={`translate(0 130)`}>
              <TimelineHeader>Staff travels</TimelineHeader>
              {travels.map((e) => (
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
            </g>

            <g transform="translate(0 160)">
              <TimelineHeader>Graduates & PhDs</TimelineHeader>
              {examEvents.map((e) => {
                const width = 9;
                const height = (e.size ?? 0) / 2;
                return (
                  <rect
                    key={nanoid()}
                    width={width}
                    height={height}
                    x={xScale(e.dateStart) - width / 2}
                    y={height / -2}
                    rx={1}
                    fill={indonesiaColor}
                  />
                );
              })}
              {phdGraduatesPerYear.map(([year, count]) => {
                const r = 1;
                const gap = r * 3;
                const height = (count - 1) * gap + count * r * 2;
                return range(0, count).map((_, idx) => (
                  <g key={nanoid()} transform={`translate(0 ${-height / 4})`}>
                    <circle
                      cx={xScale(new Date(year + "GMT"))}
                      cy={idx * gap}
                      r={r}
                      fill={"white"}
                    />
                  </g>
                ));
              })}
            </g>
          </g>
          <g id="annotations">
            <g id="annotation-travels">
              <text
                textAnchor="center"
                transform={`translate(${width / 2}, 350)`}
              >
                <tspan fontFamily="Fraunces" fontWeight={"bold"}>
                  Travels over time
                </tspan>
                <tspan x={0} dy={7}>
                  The travels where comparatively long in the beginning
                </tspan>
                <tspan x={0} dy={7}>
                  and got much shorter in the 90s.
                </tspan>
              </text>
              <LeaderLine
                sourcePos={new Vector2(width / 2 + 30, 370)}
                targetPos={new Vector2(width / 2, 405)}
                stroke="black"
                strokeWidth={0.5}
              />
              <LeaderLine
                sourcePos={new Vector2(width / 2 + 100, 370)}
                targetPos={new Vector2(width / 2 + 200, 405)}
                stroke="black"
                strokeWidth={0.5}
              />
            </g>
          </g>
        </svg>
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
    phdCandidates,
    btors,
    longTermMissions,
    alumni,
    ministers,
    neCountries,
  ] = await Promise.all([
    getProjectsIn("IDN"),
    getPhdCandidatesByCountry("IDN"),
    getBTORsByCountry("Indonesia"),
    getLongTermMissions(),
    getAlumniByCountry("IDN"),
    getDutchForeignAffairsMinisters(),
    getCountries(),
  ]);

  return {
    props: {
      projects,
      phdCandidates,
      btors,
      longTermMissions,
      alumni,
      ministers,
      neCountries,
    },
  };
};

export default IndonesiaTimeline;
