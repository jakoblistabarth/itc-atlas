import { Country } from "@prisma/client";
import { Group } from "@visx/group";
import { groups, max, min, scaleLinear } from "d3";
import { FC } from "react";
import { Vector2 } from "three";
import getCentroidByIsoCode from "../../lib/data/getCentroidByIsoCode";
import { BtorsGroupedByYear } from "../../lib/data/queries/btors/getBtorsGroupedByYear";
import getCountryName from "../../lib/getCountryName";
import { NeCountriesTopoJson } from "../../types/NeTopoJson";
import LinePath from "../LinePath/";
import { getFilledSeries } from "../LinePath/LinePath.helpers";
import MapLayerBase from "../MapLayerBase";
import { useMapLayoutContext } from "../MapLayout/MapLayoutContext";

type Props = {
  countryCodes: Country[];
  neCountriesTopoJson: NeCountriesTopoJson;
  btors: BtorsGroupedByYear;
};

const BtorsByCountryByYear: FC<Props> = ({
  btors,
  countryCodes,
  neCountriesTopoJson,
}) => {
  const chartWidth = 25;
  const chartHeight = 25;

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
    btor: BtorCountryWithValidCentroid | BtorCountry,
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

  const { projection } = useMapLayoutContext();

  return (
    <>
      <MapLayerBase countries={neCountriesTopoJson} />
      {btorsByCountry.map((d) => {
        const centroid = projection([d.centroid.x, d.centroid.y]);
        if (!centroid) return <></>;
        const [x, y] = centroid;
        const data = getFilledSeries<(typeof d.data)[number]>(
          d.data,
          (d) => d.year,
          (d) => d.count,
          minTime,
          maxTime,
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
                isSelected={false}
                data={data}
                xScale={xScale}
                yScale={yScale}
                identifier={d.isoAlpha3}
                label={getCountryName(d.isoAlpha3, countryCodes)}
                mouseEnterLeaveHandler={() => undefined}
              />
            </Group>
          </g>
        );
      })}
    </>
  );
};

export default BtorsByCountryByYear;
