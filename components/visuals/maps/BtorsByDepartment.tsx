import { Country } from "@prisma/client";
import { max, scalePow } from "d3";
import {
  ExtendedFeature,
  ExtendedFeatureCollection,
  GeoGeometryObjects,
  geoCentroid,
} from "d3-geo";
import { FC, useState } from "react";
import getUnRegions from "../../../lib/data/getUnRegions";
import { BtorsGroupedByRegionByDepartment } from "../../../lib/data/queries/btors/getBtorsGroupedByRegionByDepartment";
import { departmentColorScale } from "../../../lib/styles/departmentColorScale";
import { NeCountriesTopoJson } from "../../../types/NeTopoJson";
import LegendNominal from "../../LegendNominal";
import MapLayerBase from "../../MapLayerBase";
import MarkGeometry from "../../MarkGeometry";
import MarkScaledPieChart from "../../MarkScaledPieChart/";
import Tooltip from "../../Tooltip";
import { UnRegion } from "../../../lib/data/load/loadUnsdRegions";

type Props = {
  neCountries: NeCountriesTopoJson;
  countryCodes: Country[];
  btors: BtorsGroupedByRegionByDepartment;
  extent?: GeoGeometryObjects | ExtendedFeatureCollection | ExtendedFeature;
  regions: UnRegion[];
};

const BtorsByDepartment: FC<Props> = ({
  btors,
  countryCodes,
  neCountries,
  regions,
}) => {
  const subRegions = getUnRegions(
    countryCodes,
    neCountries,
    "unSubRegionCode",
    regions,
  );

  const regionsWithData = subRegions.map((d) => {
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

  type Region = (typeof regionsWithData)[number];
  const [tooltipContent, setTooltipContent] = useState<Region | undefined>(
    undefined,
  );

  const maxCount = max(regionsWithData.map((d) => d.properties.sum));
  const radiusScale = scalePow()
    .domain([0, maxCount ?? 1])
    .range([7, 35]);

  const legendEntries = departmentColorScale
    .domain()
    .map((d) => {
      return {
        label: d,
        color: departmentColorScale(d),
      };
    })
    .sort((a, b) => {
      const order = ["AES", "EOS", "GIP", "NRS", "PGM", "WRS", "Other", "NA"];
      return order.indexOf(a.label) - order.indexOf(b.label);
    });

  return (
    <>
      <MapLayerBase countries={neCountries} />
      <g>
        {subRegions.map((d) => (
          <MarkGeometry
            key={d.properties?.region}
            feature={d}
            stroke={"black"}
            strokeWidth={0.5}
            fill="transparent"
          />
        ))}
      </g>
      <Tooltip.Root followCursor open={!!tooltipContent}>
        <Tooltip.Trigger asChild>
          <g>
            {regionsWithData.map((d) => (
              <MarkScaledPieChart
                key={d.properties.region}
                longitude={d.properties.centroid[0]}
                latitude={d.properties.centroid[1]}
                radius={radiusScale(d.properties.sum)}
                innerRadius={radiusScale(d.properties.sum) / 4}
                data={d.properties.data ?? []}
                stroke={"white"}
                colorScale={departmentColorScale}
                onMouseEnter={() => setTooltipContent(d)}
                onMouseLeave={() => setTooltipContent(undefined)}
                className="cursor-pointer"
              />
            ))}
          </g>
        </Tooltip.Trigger>
        <Tooltip.Content>
          {tooltipContent?.properties.regionName}
        </Tooltip.Content>
      </Tooltip.Root>
      <LegendNominal
        title="Departments"
        transform="translate(0 0)"
        fontSize={12}
        entries={legendEntries.filter((d) => d.label != "NA")}
      />
    </>
  );
};

export default BtorsByDepartment;
