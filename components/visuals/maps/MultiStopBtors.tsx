import { FC } from "react";
import { NeCountriesTopoJson } from "../../../types/NeTopoJson";
import MapLayerBase from "../../MapLayerBase";
import { geoBertin1953 } from "d3-geo-projection";
import getCentroidByIsoCode from "../../../lib/data/getCentroidByIsoCode";
import { max, scaleLinear, scalePow } from "d3";
import { BtorsGroupedByCountry } from "../../../lib/data/queries/btors/getBtorsGroupedByCountry";
import { Vector2 } from "three";
import MapLayoutFluid from "../../MapLayout/MapLayoutFluid";
import MarkCircle from "../../MarkCircle/MarkCircle";

type Props = {
  neCountries: NeCountriesTopoJson;
  btors: BtorsGroupedByCountry;
};

const MultiStopBtors: FC<Props> = ({ btors, neCountries }) => {
  const proj = geoBertin1953();

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
    <MapLayoutFluid projection={proj}>
      <MapLayerBase countries={neCountries} />
      {multipleStops.map((d) => {
        const centroids = d.centroids;
        return (
          <g key={d.id} opacity={0.5}>
            {d.centroids.map((c, i) => (
              <MarkCircle
                key={i}
                latitude={c.y}
                longitude={c.x}
                radius={scaleArea(d.count)}
              />
            ))}
            {d.centroids.slice(0, -1).map((c, i) => {
              const start = proj([c.x, c.y]);
              const end = proj([centroids[i + 1].x, centroids[i + 1].y]);
              // TODO: create MarkLine component or add noTip to MarkFlow
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
    </MapLayoutFluid>
  );
};

export default MultiStopBtors;
