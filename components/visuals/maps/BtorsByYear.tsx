import { FC } from "react";
import { NeCountriesTopoJson } from "../../../types/NeTopoJson";
import BaseLayer from "../../map/BaseLayer";
import useMeasure from "react-use-measure";
import getMapHeight from "../../../lib/cartographic/getMapHeight";
import getCentroidByIsoCode from "../../../lib/data/getCentroidByIsoCode";
import {
  ExtendedFeature,
  ExtendedFeatureCollection,
  GeoGeometryObjects,
  GeoProjection,
  groups,
  max,
  min,
  range,
  scaleLinear,
} from "d3";
import { Vector2 } from "three";
import { BtorsGroupedByYear } from "../../../lib/data/queries/btors/getBtorsGroupedByYear";
import { LinePath } from "@visx/shape";
import { Group } from "@visx/group";
import { geoBertin1953 } from "d3-geo-projection";

type Props = {
  neCountries: NeCountriesTopoJson;
  btors: BtorsGroupedByYear;
  projection?: GeoProjection;
  extent?: GeoGeometryObjects | ExtendedFeatureCollection | ExtendedFeature;
};

const BtorsByYear: FC<Props> = ({
  btors,
  neCountries,
  extent,
  projection = geoBertin1953(),
}) => {
  const [mapRef, { width }] = useMeasure();
  //TODO: fix NaNs for centroids rendered before useMeasure()
  const options = extent ? { extent } : undefined;
  const height = getMapHeight(width, projection, options);

  const chartWidth = 50;
  const chartHeight = 50;

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

  return (
    <svg
      ref={mapRef}
      width={"100%"}
      height={"100%"}
      viewBox={`0 0 ${width} ${height}`}
    >
      <BaseLayer countries={neCountries} projection={projection} />
      {btorsByCountry.map((d) => {
        const [x, y] = projection([d.centroid.x, d.centroid.y]);
        const data = range(minTime, maxTime).map((year) => ({
          year,
          count: d.data.find((d) => d.year === year)?.count ?? 0,
        }));
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
                data={data}
                x={(d) => xScale(d.year)}
                y={(d) => yScale(d.count)}
                strokeLinejoin="round"
                strokeWidth="1"
                stroke="black"
              />
            </Group>
          </g>
        );
      })}
    </svg>
  );
};

export default BtorsByYear;
