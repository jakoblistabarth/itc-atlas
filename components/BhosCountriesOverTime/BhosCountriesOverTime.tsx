import { extent, group, min, scaleLinear, scaleTime } from "d3";
import { FC, useState } from "react";
import { BhosCountry } from "../../types/BhosCountry";
import { DutchCabinet } from "../../types/DutchCabinet";
import Timeline from "../Timeline";
import EventPeriod from "../Timeline/EventPeriod";
import TimelineGrid from "../Timeline/TimelineGrid";
import Tooltip from "../Tooltip";
import KPI from "../KPI";

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

  const sizeExtent = extent(
    Array.from(perCabinet.values()).map((d) => d.length),
  );

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

  const [heightMin, heightMax] = [sizeExtent[0] ?? 0, sizeExtent[1] ?? 1];
  const yScale = scaleLinear()
    .domain([heightMin, heightMax])
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
              {tooltipContent.cabinet.dateStart}–
              {tooltipContent.cabinet.dateEnd}
            </p>
            {tooltipContent.bhosCountries && (
              <KPI
                number={tooltipContent.bhosCountries}
                unit={"BHOS countries"}
              />
            )}
          </Tooltip.Content>
        )}
      </Tooltip.Root>
    </svg>
  );
};

export default BhosCountriesOverTime;
