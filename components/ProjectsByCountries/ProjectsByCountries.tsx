import { scaleSqrt } from "d3";
import { geoBertin1953 } from "d3-geo-projection";
import { FeatureCollection, Point } from "geojson";
import { FC, useCallback, useState } from "react";
import LegendProportionalCircle from "../../components/LegendProportionalCircle";
import MapLayerBase from "../../components/MapLayerBase";
import MapLayoutFluid from "../../components/MapLayout/MapLayoutFluid";
import MarkCircle from "../../components/MarkCircle";
import MarkGeometry from "../../components/MarkGeometry/MarkGeometry";
import PatternLine from "../../components/PatternLine";
import { NeCountriesGeoJson } from "../../types/NeCountriesGeoJson";
import { NeCountriesTopoJson } from "../../types/NeTopoJson";
import Tooltip from "../../components/Tooltip";
import type { GeoJsonProperties } from "geojson";
import KPI from "../../components/KPI";

type Props = {
  data: FeatureCollection<Point>;
  domain: [number, number];
  highlightCountries?: NeCountriesGeoJson;
  neCountriesTopoJson: NeCountriesTopoJson;
};

const ProjectsByCountries: FC<Props> = ({
  data,
  domain,
  highlightCountries,
  neCountriesTopoJson,
}) => {
  const projection = geoBertin1953();
  const scale = scaleSqrt().domain(domain).range([0.5, 40]);
  const [hoverInfo, setHoverInfo] = useState<GeoJsonProperties | undefined>(
    undefined,
  );
  const onPointerEnterHandler = useCallback((properties: GeoJsonProperties) => {
    setHoverInfo(properties);
  }, []);
  const onPointerLeaveHandler = useCallback(() => setHoverInfo(undefined), []);

  return (
    <MapLayoutFluid projection={projection}>
      <defs>
        <PatternLine
          angle={45}
          spacing={10}
          strokeWidth={0.5}
          className="stroke-itc-green"
          name={"line-pattern"}
        ></PatternLine>
      </defs>
      <MapLayerBase countries={neCountriesTopoJson} />
      <g className="choroplethLayer">
        {highlightCountries?.features.map((feature) => (
          <MarkGeometry
            key={feature.properties.ADM0_A3}
            feature={feature}
            fill={`url(#line-pattern)`}
          />
        ))}
      </g>

      <Tooltip.Root open={!!hoverInfo} followCursor placement="top-start">
        <Tooltip.Trigger asChild>
          <g className="symbolLayer">
            {data.features.map((feature, idx) => {
              return (
                <MarkCircle
                  key={idx}
                  longitude={feature.geometry.coordinates[0]}
                  latitude={feature.geometry.coordinates[1]}
                  radius={scale(feature.properties?.projectCount)}
                  interactive
                  properties={feature.properties}
                  onPointerEnterHandler={onPointerEnterHandler}
                  onPointerLeaveHandler={onPointerLeaveHandler}
                />
              );
            })}
          </g>
        </Tooltip.Trigger>
        <Tooltip.Content>
          {hoverInfo && (
            <div>
              <KPI number={hoverInfo.projectCount} unit={"projects"} />
              {hoverInfo.NAME_EN}
            </div>
          )}
        </Tooltip.Content>
      </Tooltip.Root>

      <LegendProportionalCircle
        data={data.features.map(
          (feature) => feature.properties?.projectCount ?? 0,
        )}
        scaleRadius={scale}
        title={"Projects per Country"}
        unitLabel={"project"}
      />
    </MapLayoutFluid>
  );
};

export default ProjectsByCountries;
