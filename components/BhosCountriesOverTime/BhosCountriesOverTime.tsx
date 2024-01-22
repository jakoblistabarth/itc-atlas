import { group, max, min, scaleLinear, scaleTime } from "d3";
import { FC, useState } from "react";
import { fDateLong } from "../../lib/utilities/formaters";
import { BhosCountry } from "../../types/BhosCountry";
import { DutchCabinet } from "../../types/DutchCabinet";
import KPI from "../KPI";
import Timeline from "../Timeline";
import EventPeriod from "../Timeline/EventPeriod";
import TimelineGrid from "../Timeline/TimelineGrid";
import Tooltip from "../Tooltip";

type Props = {
  bhosCountries: BhosCountry[];
  dutchCabinets: DutchCabinet[];
};

type TooltipContent = {
  cabinet: DutchCabinet;
  bhosCountries?: number;
};

const BhosCountriesOverTime: FC<Props> = ({ bhosCountries, dutchCabinets }) => {
  const width = 900;
  const height = 150;
  const margin = 20;

  const [tooltipContent, setTooltipContent] = useState<
    TooltipContent | undefined
  >(undefined);

  const perCabinet = group(bhosCountries, (d) => d.cabinet);

  const sizes = Array.from(perCabinet.values()).map((d) => d.length);

  const timeMin =
    min(
      dutchCabinets.flatMap((d) => [
        new Date(d.dateEnd) ?? new Date(),
        new Date(d.dateStart) ?? new Date(),
      ]),
    ) ?? new Date(1950);
  const xScale = scaleTime()
    .domain([timeMin, new Date()])
    .range([0, width - margin * 2]);

  const heightMax = max(sizes) ?? 1;
  const yScale = scaleLinear()
    .domain([0, heightMax])
    .range([10, height - margin]);

  return (
    <svg width={width} height={height}>
      <Tooltip.Root followCursor open={!!tooltipContent}>
        <Tooltip.Trigger asChild>
          <Timeline xScale={xScale}>
            <TimelineGrid height={height} />
            {dutchCabinets.map((cabinet) => {
              const start = new Date(cabinet.dateStart);
              const end = cabinet.dateEnd
                ? new Date(cabinet.dateEnd)
                : new Date();
              const numberOfCountries = perCabinet.get(cabinet.name)?.length;
              const barHeight = yScale(numberOfCountries ?? 0);
              return (
                <EventPeriod
                  key={cabinet.name}
                  dateStart={start}
                  dateEnd={end}
                  height={numberOfCountries === undefined ? 2 : barHeight}
                  className="cursor-pointer fill-itc-blue"
                  stroke={"white"}
                  yOffset={height / 2}
                  onMouseEnter={() =>
                    setTooltipContent({
                      cabinet,
                      bhosCountries: numberOfCountries,
                    })
                  }
                  onMouseLeave={() => setTooltipContent(undefined)}
                ></EventPeriod>
              );
            })}
          </Timeline>
        </Tooltip.Trigger>
        {tooltipContent && (
          <Tooltip.Content>
            <strong>{tooltipContent.cabinet.name}</strong>
            <p>
              {fDateLong(new Date(tooltipContent.cabinet.dateStart))}
              <br />
              {fDateLong(new Date(tooltipContent.cabinet.dateEnd))}
            </p>
            <div className="mt-3">
              {tooltipContent.bhosCountries ? (
                <KPI
                  number={tooltipContent.bhosCountries}
                  unit={"BHOS countries"}
                />
              ) : (
                <div className="text-gray-400">No Data.</div>
              )}
            </div>
          </Tooltip.Content>
        )}
      </Tooltip.Root>
    </svg>
  );
};

export default BhosCountriesOverTime;
