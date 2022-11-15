import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Footer from "../../components/Footer";
import Heading, { Headings } from "../../components/Heading";
import SummaryTable from "../../components/SummaryTable";
import getAlumniByCountry from "../../lib/data/getAlumniByCountry";
import getBTORsByCountry from "../../lib/data/getBTORsByCountry";
import getPhdCandidatesByCountry from "../../lib/data/getPhdCandidatesByCountry";
import getProjectsIn from "../../lib/data/getProjectsIn";
import DataFrame from "../../lib/DataFrame/DataFrame";
import styles from "../../styles/home.module.css";
import { Alumni } from "../../types/Alumni";
import { PhdCandidate } from "../../types/PhdCandidate";
import { Project } from "../../types/Project";
import { TimelineEvent } from "../../types/TimelineEvent";
import { BTOR, Travel } from "../../types/Travels";
import { rollups } from "d3-array";
import getDutchCabinets from "../../lib/data/getDutchCabinets";
import { DutchCabinet } from "../../types/DutchCabinet";
import getDutchForeignAffairsMinisters from "../../lib/data/getDutchForeignAffairsMinisters";
import { Minister } from "../../types/Minister";
import {
  ascending,
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
import EventPoint from "../../components/charts/timeline/EventPoint";
import EventPeriod from "../../components/charts/timeline/EventPeriod";
import PointLabel from "../../components/map/PointLabel";
import { LabelPlacement } from "../../types/LabelPlacement";
import { nanoid } from "nanoid";
import Building, { ITClocations } from "../../components/Building";
import PointSymbol from "../../components/map/PointSymbol";

type Props = {
  projects: Project[];
  phdCandidates: PhdCandidate[];
  alumni: Alumni[];
  btors: BTOR[];
  cabinets: DutchCabinet[];
  ministers: Minister[];
  neCountries: NeCountriesTopoJson;
};

const IndonesiaTimeline: NextPage<Props> = ({
  projects,
  phdCandidates,
  alumni,
  btors,
  cabinets,
  ministers,
  neCountries,
}) => {
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
  const renamingEvents: TimelineEvent[] = namesITC.map((d) => {
    return { name: d.name, dateStart: new Date(d.year + "GMT"), yOffset: "" };
  });

  const btorEvents: TimelineEvent[] = btors.flatMap((btor) => {
    if (!btor.dateStart || !btor.dateEnd) return [];
    return {
      name: btor.destination,
      yOffset: btor.department,
      dateStart: new Date(btor.dateStart),
      dateEnd: new Date(btor.dateEnd),
    };
  });

  const phdCandidateEvents: TimelineEvent[] = phdCandidates
    .flatMap((phd) => {
      if (!phd.dateStart || !phd.dateEnd) return [];
      return {
        name: phd.thesisTitle ?? "unnamed project",
        yOffset: phd.thesisTitle ?? "",
        dateStart: new Date(phd.dateStart),
        dateEnd: new Date(phd.dateEnd),
      };
    })
    .sort((a, b) => ascending(a.dateStart, b.dateStart));

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

  const cabinetEvents: TimelineEvent[] = cabinets.map((cabinet) => ({
    name: cabinet.name,
    yOffset: "",
    dateStart: new Date(cabinet.dateStart),
    dateEnd: cabinet.dateEnd ? new Date(cabinet.dateEnd) : new Date(),
    fill: cabinet.name,
  }));
  const cabinesWithTopics = cabinets.filter((d) => d.topics);
  const topics = Array.from(
    new Set(cabinesWithTopics.map((cabinet) => cabinet.topics).flat())
  );
  const topicYScale = scaleBand().domain(topics).range([0, 10]);
  const topicColorScale = scaleOrdinal<string, string>()
    .domain(topics)
    .range(["CornflowerBlue", "Coral", "lightgreen", "Crimson"]);

  const partyColorScale = scaleOrdinal<string, string>()
    .domain(["CDA", "PvdA", "VVD", "D66"])
    .range(["lightgreen", "darkred", "orange", "darkgreen"]);

  const ministerEvents: TimelineEvent[] = ministers.map((minister) => ({
    name: minister.name,
    yOffset: "",
    dateStart: new Date(minister.dateStart),
    fill: partyColorScale(minister.party),
  }));

  const commonDomain = [new Date("1945"), new Date(2025, 0, 1)] as [Date, Date];

  const tlHeights = {
    itcContext: 100,
    policy: 80,
    itc: 230,
  };
  const width = 860;
  const margin = 40;
  const height = sum([...Object.values(tlHeights)]) + margin * 2;

  const xScale = scaleTime().domain(commonDomain).range([0, width]);

  const projectsYScale = scalePoint()
    .domain(projectEvents.map((d) => d.yOffset))
    .range([0, 120]);
  const phDsYScale = scalePoint()
    .domain(phdCandidateEvents.map((d) => d.yOffset))
    .range([0, 50]);

  const TimelineHeader = ({ children }) => {
    return (
      <text fontFamily="Fraunces" fontSize={12}>
        {children}
      </text>
    );
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
          <TimelineGrid scale={xScale} height={height} margin={margin} />
          <g id="itcContextEvents" transform={`translate(0 ${margin})`}>
            <g id="nameChanges">
              <TimelineHeader>Name changes</TimelineHeader>
              {renamingEvents.map((ne, idx) => (
                <EventPoint
                  key={nanoid()}
                  position={
                    new Vector2(xScale(ne.dateStart), 5 + (idx % 2) * 10)
                  }
                >
                  <PointLabel placement={LabelPlacement.RIGHT}>
                    {ne.name}
                  </PointLabel>
                </EventPoint>
              ))}
            </g>
            <g id="moves" transform="translate(0 25)">
              <TimelineHeader>Moves</TimelineHeader>
              {Array.from(ITClocations.keys()).map((d, idx) => {
                const currentLocation = ITClocations.get(d);
                const width = 80;
                if (!currentLocation) return <></>;
                return (
                  <g
                    transform={`translate(${xScale(
                      new Date(currentLocation.moveInDate)
                    )} 0)`}
                  >
                    <Building width={width} location={d} />
                    <PointSymbol position={new Vector2(0, width / 2)} />
                    <PointLabel
                      position={new Vector2(0, width / 2)}
                      placement={LabelPlacement.BOTTOM}
                    >
                      <tspan fontWeight={"bold"}>{d}</tspan>
                      <tspan x="0" dy="7">
                        {currentLocation.city}
                      </tspan>
                    </PointLabel>
                  </g>
                );
              })}
            </g>
          </g>
          <g
            id="policyEvents"
            transform={`translate(0 ${margin + tlHeights.itcContext})`}
          >
            <g id="cabinets">
              <TimelineHeader>Cabinets</TimelineHeader>
              {cabinetEvents.map((ce) => (
                <EventPeriod
                  key={nanoid()}
                  dateStart={ce.dateStart}
                  dateEnd={ce.dateEnd ?? new Date()}
                  xScale={xScale}
                  yOffset={10}
                  height={2}
                  fill={partyColorScale(ce.fill ?? "")}
                >
                  <PointLabel placement={LabelPlacement.TOPRIGHT}>
                    {ce.name}
                  </PointLabel>
                </EventPeriod>
              ))}
            </g>
            <g id="ministers" transform="translate(0 30)">
              <TimelineHeader>Ministers in charge</TimelineHeader>
              {ministerEvents.map((ce) => (
                <EventPoint
                  key={nanoid()}
                  position={new Vector2(xScale(ce.dateStart), 0)}
                >
                  <PointLabel placement={LabelPlacement.BOTTOM}>
                    {ce.name}
                  </PointLabel>
                </EventPoint>
              ))}
            </g>
            <g id="topics" transform="translate(0, 60)">
              <TimelineHeader>Development aid priorities</TimelineHeader>
              {cabinesWithTopics.map((cabinet) =>
                cabinet.topics.map((topic) => (
                  <EventPeriod
                    key={nanoid()}
                    dateStart={new Date(cabinet.dateStart)}
                    dateEnd={new Date(cabinet.dateEnd)}
                    xScale={xScale}
                    yOffset={topicYScale(topic) ?? 0}
                    height={topicYScale.bandwidth()}
                    fill={topicColorScale(topic)}
                  />
                ))
              )}
            </g>
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
                  fill={"black"}
                >
                  {/* <PointLabel
                    placement={LabelPlacement.LEFT}
                    style={{ fill: "lightgrey", fontSize: 6 }}
                  >
                    {e.name.slice(0, 30)}
                  </PointLabel> */}
                </EventPeriod>
              ))}
            </g>

            <g transform={`translate(0 130)`}>
              <TimelineHeader>PhDs</TimelineHeader>
              {phdCandidateEvents.map((e) => (
                <EventPeriod
                  key={nanoid()}
                  dateStart={e.dateStart}
                  dateEnd={e.dateEnd ?? new Date()}
                  xScale={xScale}
                  yOffset={phDsYScale(e.yOffset) ?? 0}
                  height={2}
                  fill={"black"}
                >
                  {/* <PointLabel
                    placement={LabelPlacement.LEFT}
                    style={{ fill: "lightgrey", fontSize: 6 }}
                  >
                    {e.name}
                  </PointLabel> */}
                </EventPeriod>
              ))}
            </g>
            <g transform={`translate(0 200)`}>
              <TimelineHeader>Staff travels</TimelineHeader>
              {btorEvents.map((e) => (
                <EventPeriod
                  key={nanoid()}
                  dateStart={e.dateStart}
                  dateEnd={e.dateEnd ?? new Date()}
                  xScale={xScale}
                  yOffset={0}
                  height={2}
                  fill={"black"}
                  roundedCorners={false}
                />
              ))}
            </g>
            <g transform="translate(0 230)">
              <TimelineHeader>Graduates</TimelineHeader>

              {examEvents.map((e) => (
                <EventPoint
                  key={nanoid()}
                  position={new Vector2(xScale(e.dateStart), 0)}
                  radius={(e.size ?? 0) / 4}
                  fill={"grey"}
                  fillOpacity={0.5}
                ></EventPoint>
              ))}
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
    alumni,
    cabinets,
    ministers,
    neCountries,
  ] = await Promise.all([
    getProjectsIn("IDN"),
    getPhdCandidatesByCountry("IDN"),
    getBTORsByCountry("Indonesia"),
    getAlumniByCountry("IDN"),
    getDutchCabinets(),
    getDutchForeignAffairsMinisters(),
    getCountries(),
  ]);

  return {
    props: {
      projects,
      phdCandidates,
      btors,
      alumni,
      cabinets,
      ministers,
      neCountries,
    },
  };
};

export default IndonesiaTimeline;
