import { FC, useContext, useState } from "react";
import { NeCountriesTopoJson } from "../../../types/NeTopoJson";
import MapLayerBase from "../../MapLayerBase";
import getCentroidByIsoCode from "../../../lib/data/getCentroidByIsoCode";
import { groups, max, min, scaleLinear } from "d3";
import { Vector2 } from "three";
import { BtorsGroupedByYear } from "../../../lib/data/queries/btors/getBtorsGroupedByYear";
import LinePath from "../../LinePath/";
import { Group } from "@visx/group";
import { MapLayoutContext } from "../../MapLayout/MapLayoutContext";
import getCountryName from "../../../lib/getCountryName";
import { getFilledSeries } from "../../LinePath/LinePath.helpers";

type Props = {
  neCountries: NeCountriesTopoJson;
  btors: BtorsGroupedByYear;
};

const BtorsByYear: FC<Props> = ({ btors, neCountries }) => {
  const [selectedCountry, setSelectedCountry] = useState<string | undefined>(
    undefined
  );

  const chartWidth = 40;
  const chartHeight = 40;

  const maxCount = max(btors, (d) => d.count) ?? 1;
  const minTime = min(btors, (d) => d.year) ?? 2000;
  const maxTime = max(btors, (d) => d.year) ?? new Date().getFullYear();
  const xScale = scaleLinear()
    .domain([minTime, maxTime])
    .range([0, chartWidth]);
  const yScale = scaleLinear().domain([0, maxCount]).range([chartHeight, 0]);

  type BtorCountry = {
    isoAlpha3: string;
    data: typeof btors;
    centroid: Vector2 | undefined;
  };
  type BtorCountryWithValidCentroid = BtorCountry & {
    centroid: Vector2;
  };

  const hasCentroid = (
    btor: BtorCountryWithValidCentroid | BtorCountry
  ): btor is BtorCountryWithValidCentroid => {
    return btor.centroid?.x !== undefined && btor.centroid?.y !== undefined;
  };

  const btorsByCountry = groups(btors, (d) => d.isoAlpha3)
    .map((d) => ({
      isoAlpha3: d[0],
      data: d[1],
      centroid: getCentroidByIsoCode(d[0]),
    }))
    .filter(hasCentroid);

  const { projection } = useContext(MapLayoutContext);

  return (
    <>
      <MapLayerBase countries={neCountries} projection={projection} />
      {btorsByCountry.map((d) => {
        const centroid = projection([d.centroid.x, d.centroid.y]);
        if (!centroid) return <></>;
        const isSelectedCountry = selectedCountry == d.isoAlpha3;
        const [x, y] = centroid;
        const data = getFilledSeries<(typeof d.data)[number]>(
          d.data,
          (d) => d.year,
          (d) => d.count,
          minTime,
          maxTime
        );
        return (
          <g key={d.isoAlpha3} transform={`translate(${x} ${y})`}>
            <Group top={-chartHeight} left={chartWidth / -2}>
              <line
                x1={xScale(minTime)}
                y1={yScale(0)}
                x2={xScale(maxTime)}
                y2={yScale(0)}
                stroke="grey"
                strokeWidth={0.5}
              />
              <LinePath
                isSelection={false}
                isFocus={true}
                isSelected={isSelectedCountry}
                data={data}
                xScale={xScale}
                yScale={yScale}
                identifier={d.isoAlpha3}
                label={getCountryName(d.isoAlpha3, neCountries)}
                mouseEnterLeaveHandler={(isoAlpha3?: string) => {
                  setSelectedCountry(isoAlpha3);
                }}
              />
            </Group>
          </g>
        );
      })}
    </>
  );
};

export default BtorsByYear;
