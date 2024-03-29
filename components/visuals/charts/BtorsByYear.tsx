import { Country } from "@prisma/client";
import { Group } from "@visx/group";
import { ScaleOrdinal, format, max, min, scaleLinear, union } from "d3";
import { FC, useMemo } from "react";
import { MdArrowUpward, MdInfoOutline } from "react-icons/md";
import useMeasure from "react-use-measure";
import { BtorsGroupedByYear } from "../../../lib/data/queries/btors/getBtorsGroupedByYear";
import getCountryName from "../../../lib/getCountryName";
import { DutchCabinet } from "../../../types/DutchCabinet";
import AxisX from "../../AxisX";
import AxisY from "../../AxisY";
import LinePath from "../../LinePath/LinePath";
import { getFilledSeries } from "../../LinePath/LinePath.helpers";
import RuleY from "../../RuleY";
import { BhosCountryWithCategories } from "../BtorsAndCabinets";

type Props = {
  btors: BtorsGroupedByYear;
  activeCabinet?: DutchCabinet;
  activeCountry?: string;
  colorScale: ScaleOrdinal<string, string>;
  bhosCountries: BhosCountryWithCategories[];
  mouseEnterLeaveHandler: (isoAlpha3?: string) => void;
  countries: Country[];
};

const BtorsByYear: FC<Props> = ({
  btors,
  activeCabinet,
  activeCountry,
  mouseEnterLeaveHandler,
  colorScale,
  bhosCountries,
  countries,
}) => {
  const [chartRef, { width }] = useMeasure();

  const height = 300;
  const margin = useMemo(
    () => ({
      top: 30,
      right: 20,
      bottom: 20,
      left: 20,
    }),
    [],
  );

  const [cabinetStart, cabinetEnd] = [
    activeCabinet?.dateStart,
    activeCabinet?.dateEnd,
  ].map((d) => (d && d?.length > 0 ? new Date(d) : new Date()));

  const { btorsByCountryFilled, xScale, yScale, maxCount } = useMemo(() => {
    const maxCount = max(btors, (d) => d.count) ?? 1;
    const minTime = min(btors, (d) => d.year) ?? 2000;
    const maxTime = max(btors, (d) => d.year) ?? new Date().getFullYear();
    const xScale = scaleLinear()
      .domain([minTime, maxTime])
      .range([margin.left, width - margin.right]);
    const yScale = scaleLinear()
      .domain([0, maxCount])
      .range([height - margin.bottom, margin.top]);
    const countriesWithBtors = Array.from(union(btors.map((d) => d.isoAlpha3)));
    const btorsByCountryFilled = countriesWithBtors.map((isoAlpha3) => ({
      isoAlpha3,
      data: getFilledSeries<(typeof btors)[number]>(
        btors.filter((d) => d.isoAlpha3 === isoAlpha3),
        (d) => d.year,
        (d) => d.count,
        minTime,
        maxTime,
      ),
    }));

    return {
      btorsByCountryFilled,
      minTime,
      maxTime,
      xScale,
      yScale,
      maxCount,
    };
  }, [btors, margin, width]);

  const activeCountryName = useMemo(
    () => getCountryName(activeCountry ?? "", countries),
    [activeCountry, countries],
  );

  const hasNoTravelData = useMemo(
    () =>
      activeCountry &&
      !btorsByCountryFilled.map((d) => d.isoAlpha3).includes(activeCountry),
    [activeCountry, btorsByCountryFilled],
  );

  return (
    <svg
      ref={chartRef}
      width={"100%"}
      height={"100%"}
      viewBox={`0 0 ${width} ${height}`}
    >
      <g
        opacity={hasNoTravelData ? 0.5 : 1}
        className="transition-opacity duration-500"
      >
        <g>
          <MdArrowUpward size={"10"} />
          <text x={"1.5em"} fontSize={10} dominantBaseline={"hanging"}>
            No. of Travels per year
          </text>
        </g>
        {cabinetStart && cabinetEnd && (
          <rect
            x={xScale(cabinetStart.getFullYear())}
            y={yScale(maxCount)}
            height={yScale(0) - yScale(maxCount)}
            className={"fill-itc-green-50"}
            width={
              xScale(cabinetEnd.getFullYear()) -
              xScale(cabinetStart.getFullYear())
            }
          />
        )}
        <RuleY xScale={xScale} yScale={yScale} />
        <AxisX
          top={height - margin.bottom + 5}
          tickFormat={format("4")}
          xScale={xScale}
        />
        <AxisY left={margin.left} yScale={yScale} />
      </g>
      {btorsByCountryFilled.map((d) => {
        const bhosCountry = bhosCountries.find(
          (bhos) =>
            bhos.cabinet === activeCabinet?.name &&
            bhos.isoAlpha3 === d.isoAlpha3,
        );
        const hasCategory = !!bhosCountry?.categories.length;
        return (
          <LinePath
            key={d.isoAlpha3}
            mouseEnterLeaveHandler={mouseEnterLeaveHandler}
            xScale={xScale}
            yScale={yScale}
            yLabel={"travels"}
            isSelection={!!activeCountry}
            isSelected={activeCountry === d.isoAlpha3}
            isFocus={hasCategory}
            data={d.data}
            color={bhosCountry?.categories.map((d) => colorScale(d))}
            identifier={d.isoAlpha3}
            label={activeCountryName}
          />
        );
      })}
      {hasNoTravelData && (
        <Group top={height / 2} left={width / 2}>
          <MdInfoOutline y={-40} />
          <text textAnchor="middle">
            No Travel for <tspan fontWeight={"bold"}>{activeCountryName}</tspan>
          </text>
        </Group>
      )}
    </svg>
  );
};

export default BtorsByYear;
