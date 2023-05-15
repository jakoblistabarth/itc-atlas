import { Country } from "@prisma/client";
import { max, scalePow } from "d3";
import {
  ExtendedFeature,
  ExtendedFeatureCollection,
  GeoGeometryObjects,
  GeoProjection,
  geoCentroid,
} from "d3-geo";
import { geoBertin1953 } from "d3-geo-projection";
import { FC } from "react";
import useMeasure from "react-use-measure";
import { Vector2 } from "three";
import getMapHeight from "../../../lib/cartographic/getMapHeight";
import getUnRegions from "../../../lib/data/getUnRegions";
import { BtorsGroupedByRegionByDepartment } from "../../../lib/data/queries/btors/getBtorsGroupedByRegionByDepartment";
import { departmentColorScale } from "../../../lib/styles/departmentColorScale";
import { NeCountriesTopoJson } from "../../../types/NeTopoJson";
import BaseLayer from "../../map/BaseLayer";
import NominalLegend from "../../map/NominalLegend";
import PolygonSymbol from "../../map/PolygonSymbol";
import ScaledPie from "../../map/ScaledPie";

type Props = {
  neCountries: NeCountriesTopoJson;
  countryCodes: Country[];
  btors: BtorsGroupedByRegionByDepartment;
  projection?: GeoProjection;
  extent?: GeoGeometryObjects | ExtendedFeatureCollection | ExtendedFeature;
};

const BtorsByDepartment: FC<Props> = ({
  btors,
  countryCodes,
  neCountries,
  extent,
  projection = geoBertin1953(),
}) => {
  const [mapRef, { width }] = useMeasure();
  const options = extent ? { extent } : undefined;
  const height = getMapHeight(width, projection, options);

  const regions = getUnRegions(countryCodes, neCountries, "unSubRegionCode");

  const regionsWithData = regions.map((d) => {
    const data = btors.get(d.properties.region);
    return {
      ...d,
      properties: {
        ...d.properties,
        centroid: geoCentroid(d),
        data: data?.map((d) => ({ label: d.departmentId, value: d.count })),
        sum: data?.reduce((acc, d) => acc + d.count, 0) ?? 0,
      },
    };
  });

  const maxCount = max(regionsWithData.map((d) => d.properties.sum));
  const radiusScale = scalePow()
    .domain([0, maxCount ?? 1])
    .range([5, 20]);

  const legendEntries = departmentColorScale.domain().map((d) => {
    return {
      label: d,
      color: departmentColorScale(d),
    };
  });

  return (
    <svg
      ref={mapRef}
      width={"100%"}
      height={"100%"}
      viewBox={`0 0 ${width} ${height}`}
    >
      <BaseLayer countries={neCountries} projection={projection} />
      {height && (
        <g>
          {regions.map((d) => (
            <PolygonSymbol
              key={d.properties?.region}
              feature={d}
              projection={projection}
              stroke={"black"}
              strokeWidth={0.5}
              fill="transparent"
            />
          ))}
          {regionsWithData.map((d) => {
            const position = new Vector2(...projection(d.properties.centroid));
            if (!position.x || !position.y)
              return <g key={d.properties.region}></g>;
            return (
              <ScaledPie
                key={d.properties.region}
                position={position}
                radius={radiusScale(d.properties.sum)}
                innerRadius={radiusScale(d.properties.sum) / 4}
                data={d.properties.data ?? []}
                stroke={"white"}
                colorScale={departmentColorScale}
              />
            );
          })}
        </g>
      )}
      <NominalLegend
        title="Departments"
        transform="translate(0 0)"
        fontSize={10}
        entries={legendEntries}
      />
    </svg>
  );
};

export default BtorsByDepartment;
