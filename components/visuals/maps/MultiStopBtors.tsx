import { FC } from "react";
import { NeCountriesTopoJson } from "../../../types/NeTopoJson";
import BaseLayer from "../../map/BaseLayer";
import { geoBertin1953 } from "d3-geo-projection";
import useMeasure from "react-use-measure";
import getMapHeight from "../../../lib/cartographic/getMapHeight";
import getCentroidByIsoCode from "../../../lib/data/getCentroidByIsoCode";
import { max, scaleLinear, scalePow } from "d3";
import { BtorsGroupedByCountry } from "../../../lib/data/queries/btors/getBtorsGroupedByCountry";
import { Vector2 } from "three";

type Props = {
  neCountries: NeCountriesTopoJson;
  btors: BtorsGroupedByCountry;
};

const MultiStopBtors: FC<Props> = ({ btors, neCountries }) => {
  const proj = geoBertin1953();
  const [mapRef, { width }] = useMeasure();
  //TODO: fix NaNs for centroids rendered before useMeasure()
  const height = getMapHeight(width, proj);

  type BtorWithCentroids = (typeof btors)[number] & {
    centroids: (Vector2 | undefined)[];
  };
  type BtorWithValidCentroids = (typeof btors)[number] & {
    centroids: Vector2[];
  };

  const hasCentroids = (
    btor: BtorWithValidCentroids | BtorWithCentroids
  ): btor is BtorWithValidCentroids => {
    return btor.centroids.every((d) => d);
  };

  const multipleStops = btors
    .filter((d) => d.count > 1)
    .map((d) => ({
      ...d,
      centroids: d.countries.map((d) => getCentroidByIsoCode(d)),
    }))
    .filter(hasCentroids);

  const maxCount = max(multipleStops, (d) => d.count) ?? 1;
  const scaleArea = scalePow().domain([1, maxCount]).range([1, 20]);
  const scaleWidth = scaleLinear().domain([1, maxCount]).range([1, 20]);

  return (
    <svg
      ref={mapRef}
      width={"100%"}
      height={"100%"}
      viewBox={`0 0 ${width} ${height}`}
    >
      <BaseLayer countries={neCountries} projection={proj} />
      {multipleStops.map((d) => {
        const centroids = d.centroids;
        return (
          <g key={d.id} opacity={0.5}>
            {d.centroids.map((c, i) => {
              const coord = proj([c.x, c.y]);
              return (
                <circle
                  key={i}
                  cx={coord[0]}
                  cy={coord[1]}
                  r={scaleArea(d.count)}
                />
              );
            })}
            {d.centroids.slice(0, -1).map((c, i) => {
              const start = proj([c.x, c.y]);
              const end = proj([centroids[i + 1].x, centroids[i + 1].y]);
              return (
                <line
                  key={i}
                  x1={start[0]}
                  y1={start[1]}
                  x2={end[0]}
                  y2={end[1]}
                  strokeWidth={scaleWidth(d.count)}
                  stroke="black"
                />
              );
            })}
          </g>
        );
      })}
    </svg>
  );
};

export default MultiStopBtors;
