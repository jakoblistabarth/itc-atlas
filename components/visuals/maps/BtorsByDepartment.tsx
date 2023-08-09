import { Country } from "@prisma/client";
import { max, scalePow } from "d3";
import {
  ExtendedFeature,
  ExtendedFeatureCollection,
  GeoGeometryObjects,
  geoCentroid,
} from "d3-geo";
import { FC, useContext } from "react";
import { Vector2 } from "three";
import getUnRegions from "../../../lib/data/getUnRegions";
import { BtorsGroupedByRegionByDepartment } from "../../../lib/data/queries/btors/getBtorsGroupedByRegionByDepartment";
import { departmentColorScale } from "../../../lib/styles/departmentColorScale";
import { NeCountriesTopoJson } from "../../../types/NeTopoJson";
import MapLayerBase from "../../MapLayerBase";
import LegendNominal from "../../LegendNominal";
import MarkGeometry from "../../MarkGeometry/MarkGeometry";
import ScaledPie from "../../ScaledPieChart/ScaledPieChart";
import { MapLayoutContext } from "../../MapLayout/MapLayoutContext";

type Props = {
  neCountries: NeCountriesTopoJson;
  countryCodes: Country[];
  btors: BtorsGroupedByRegionByDepartment;
  extent?: GeoGeometryObjects | ExtendedFeatureCollection | ExtendedFeature;
};

const BtorsByDepartment: FC<Props> = ({ btors, countryCodes, neCountries }) => {
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

  const { projection } = useContext(MapLayoutContext);

  return (
    <>
      <MapLayerBase countries={neCountries} projection={projection} />
      <g>
        {regions.map((d) => (
          <MarkGeometry
            key={d.properties?.region}
            feature={d}
            projection={projection}
            stroke={"black"}
            strokeWidth={0.5}
            fill="transparent"
          />
        ))}
        {regionsWithData.map((d) => {
          const coords = projection(d.properties.centroid);
          const position = coords ? new Vector2(...coords) : undefined;
          if (!position?.x || !position.y)
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
      <LegendNominal
        title="Departments"
        transform="translate(0 0)"
        fontSize={10}
        entries={legendEntries}
      />
    </>
  );
};

export default BtorsByDepartment;
