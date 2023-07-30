/** @jsxImportSource theme-ui */

import { FC, useMemo } from "react";
import useMeasure from "react-use-measure";
import { ScaleOrdinal, format, max, min, range, scaleLinear, union } from "d3";
import { BtorsGroupedByYear } from "../../../lib/data/queries/btors/getBtorsGroupedByYear";
import AxisX from "../../charts/Axis/AxisX";
import AxisY from "../../charts/Axis/AxisY";
import RuleY from "../../charts/RuleY";
import { MdArrowUpward, MdInfoOutline } from "react-icons/md";
import { DutchCabinet } from "../../../types/DutchCabinet";
import { BhosCountryWithCategories } from "../BtorsAndCabinets";
import LinePath from "../../LinePath";
import { Group } from "@visx/group";
import { NeCountriesTopoJson } from "../../../types/NeTopoJson";
import getCountryName from "../../../lib/getCountryName";

type Props = {
  btors: BtorsGroupedByYear;
  activeCabinet?: DutchCabinet;
  activeCountry?: string;
  colorScale: ScaleOrdinal<string, string>;
  bhosCountries: BhosCountryWithCategories[];
  mouseEnterLeaveHandler: (isoAlpha3?: string) => void;
  neCountries: NeCountriesTopoJson;
};

const BtorsByYear: FC<Props> = ({
  btors,
  activeCabinet,
  activeCountry,
  mouseEnterLeaveHandler,
  colorScale,
  bhosCountries,
  neCountries,
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
    []
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
      data: range(minTime, maxTime + 1).map((x) => {
        const match = btors.find(
          (d) => d.isoAlpha3 === isoAlpha3 && d.year === x
        );
        return { x, y: match?.count ?? 0 };
      }),
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
    () => getCountryName(activeCountry ?? "", neCountries),
    [activeCountry, neCountries]
  );

  const hasNoTravelData = useMemo(
    () =>
      activeCountry &&
      !btorsByCountryFilled.map((d) => d.isoAlpha3).includes(activeCountry),
    [activeCountry, btorsByCountryFilled]
  );

  return (
    <svg
      ref={chartRef}
      width={"100%"}
      height={"100%"}
      viewBox={`0 0 ${width} ${height}`}
    >
      <g opacity={hasNoTravelData ? 0.5 : 1} sx={{ transition: "opacity .5s" }}>
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
            sx={{ fill: "muted" }}
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
      <g>
        {btorsByCountryFilled.map((d) => {
          const bhosCountry = bhosCountries.find(
            (bhos) =>
              bhos.cabinet === activeCabinet?.name &&
              bhos.isoAlpha3 === d.isoAlpha3
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
              No Travel for{" "}
              <tspan fontWeight={"bold"}>{activeCountryName}</tspan>
            </text>
          </Group>
        )}
      </g>
    </svg>
  );
};

export default BtorsByYear;
