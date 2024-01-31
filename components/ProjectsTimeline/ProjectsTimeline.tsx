import { Project } from "@prisma/client";
import { FC } from "react";
import { TimelineEvent } from "../../types/TimelineEvent";
import { ascending, max, min, scalePoint, scaleTime } from "d3";
import Timeline from "../Timeline";
import TimelineGrid from "../Timeline/TimelineGrid";
import EventPeriod from "../Timeline/EventPeriod";
import LabelPoint from "../LabelPoint";
import { LabelPlacement } from "../../types/LabelPlacement";
import { fInt } from "../../lib/utilities/formaters";
import * as ScrollArea from "@radix-ui/react-scroll-area";

type Props = {
  projects: Project[];
};

const ProjectsTimeline: FC<Props> = ({ projects }) => {
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
    <div>
      <p>{fInt(projectsSelection.length)} projects</p>
      <ScrollArea.Root type="always" className="h-[500px] overflow-hidden">
        <ScrollArea.Viewport className="h-full w-full">
          <div>
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
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar
          orientation="vertical"
          className="flex touch-none select-none rounded-br rounded-tr bg-blackA1 p-0.5 transition-colors duration-[160ms] ease-out hover:bg-blackA2 data-[orientation=horizontal]:h-2.5 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col"
        >
          <ScrollArea.Thumb
            className="relative flex-1 cursor-pointer rounded-[10px] bg-itc-green before:absolute before:left-1/2 before:top-1/2 before:h-full before:min-h-[44px] before:w-full before:min-w-[44px]
 before:-translate-x-1/2 before:-translate-y-1/2"
          />
        </ScrollArea.Scrollbar>
        <ScrollArea.Corner />
      </ScrollArea.Root>
    </div>
  );
};

export default ProjectsTimeline;
