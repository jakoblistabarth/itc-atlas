import { Project } from "@prisma/client";
import { ascending, max, min, scalePoint, scaleTime } from "d3";
import type { NextPage } from "next";
import Container from "../../components/Container";
import LabelPoint from "../../components/LabelPoint";
import PageBase from "../../components/PageBase";
import Timeline from "../../components/Timeline";
import EventPeriod from "../../components/Timeline/EventPeriod";
import TimelineGrid from "../../components/Timeline/TimelineGrid";
import getProjects from "../../lib/data/queries/project/getProjects";
import { LabelPlacement } from "../../types/LabelPlacement";
import { TimelineEvent } from "../../types/TimelineEvent";

type projectsTimelineProps = {
  projects: Project[];
};

// QUESTION: better to always use page for all pages?
const projectsTimeline: NextPage<projectsTimelineProps> = ({ projects }) => {
  // QUESTION: such filtering in static props or here?
  const projectsSelection = projects.filter((d) => d.start && d.end);

  const events: TimelineEvent[] = projectsSelection
    .flatMap((project) => {
      if (!project.start || !project.end) return [];
      return [
        {
          name: project.nameShort ?? "Unnamed Project",
          yOffset: project.id.toString(),
          dateStart: new Date(project.start),
          dateEnd: new Date(project.end),
          data: project,
        },
      ];
    })
    .sort((a, b) => ascending(a.dateStart, b.dateStart));

  const wrapper = {
      width: 1280,
      height: 3500,
    },
    margin = {
      top: 30,
      right: 30,
      bottom: 30,
      left: 30,
    },
    bounds = {
      width: wrapper.width - margin.left - margin.right,
      height: wrapper.height - margin.top - margin.bottom,
    };
  const xScale = scaleTime()
    .domain([
      min(events, (d) => d.dateStart) ?? new Date("1950"),
      max(events, (d) => d.dateEnd) ?? new Date(),
    ])
    .range([0, bounds.width]);

  const yScale = scalePoint()
    .domain(events.map((d) => d.yOffset))
    .range([margin.top, bounds.height - margin.bottom]);

  return (
    <PageBase title="Projects">
      <Container>
        <main>
          <p>{projectsSelection.length} projects</p>
          <div style={{ overflowX: "scroll", maxHeight: "500px" }}>
            <svg width={wrapper.width} height={wrapper.height}>
              <Timeline left={margin.left} xScale={xScale}>
                <TimelineGrid height={bounds.height} margin={margin.top} />
                <g id="project-events">
                  {events.map((e, idx) => {
                    const labelText =
                      e.name.length > 20 ? e.name.slice(0, 20) + "…" : e.name;

                    return (
                      <EventPeriod
                        key={`${labelText}-${e.dateStart.getMilliseconds()}-${e.dateEnd?.getMilliseconds()}-${idx}`}
                        dateStart={e.dateStart}
                        dateEnd={e.dateEnd ?? new Date()}
                        yOffset={yScale(e.yOffset) ?? 0}
                        height={2}
                        fill={"blue"}
                      >
                        <LabelPoint placement={LabelPlacement.BOTTOMLEFT}>
                          {labelText}
                        </LabelPoint>
                      </EventPeriod>
                    );
                  })}
                </g>
              </Timeline>
            </svg>
          </div>
        </main>
      </Container>
    </PageBase>
  );
};

export const getStaticProps = async () => {
  const projects = await getProjects();

  return {
    props: {
      projects,
    },
  };
};

export default projectsTimeline;
