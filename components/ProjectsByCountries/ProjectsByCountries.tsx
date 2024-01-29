import { scaleSqrt } from "d3";
import { geoBertin1953 } from "d3-geo-projection";
import { FeatureCollection, Point } from "geojson";
import { FC } from "react";
import LegendProportionalCircle from "../../components/LegendProportionalCircle";
import MapLayerBase from "../../components/MapLayerBase";
import MapLayoutFluid from "../../components/MapLayout/MapLayoutFluid";
import MarkCircle from "../../components/MarkCircle";
import MarkGeometry from "../../components/MarkGeometry/MarkGeometry";
import PatternLine from "../../components/PatternLine";
import { NeCountriesGeoJson } from "../../types/NeCountriesGeoJson";
import { NeCountriesTopoJson } from "../../types/NeTopoJson";

type Props = {
  data: FeatureCollection<Point>;
  domain: [number, number];
  highlightCountries: NeCountriesGeoJson;
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
        {highlightCountries.features.map((feature) => (
          <MarkGeometry
            key={feature.properties.ADM0_A3}
            feature={feature}
            fill={`url(#line-pattern)`}
          />
        ))}
      </g>
      <g className="symbolLayer">
        {data.features.map((feature, idx) => {
          return (
            <MarkCircle
              key={idx}
              longitude={feature.geometry.coordinates[0]}
              latitude={feature.geometry.coordinates[1]}
              radius={scale(feature.properties?.projectCount)}
              interactive
            />
          );
        })}
      </g>
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
