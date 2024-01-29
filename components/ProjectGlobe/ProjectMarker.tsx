import { max, scaleSqrt } from "d3";
import { geoCentroid } from "d3-geo";
import type { GeoJsonProperties } from "geojson";
import { useTheme } from "next-themes";
import { FC, Fragment, memo, useMemo } from "react";
import * as topojson from "topojson-client";
import Mark3dSphere from "../../components/Mark3dSphere";
import { CountryWithProjectCount } from "../../lib/data/queries/country/getCountryWithProjectCount";
import longitudeLatitudeToXYZ from "../../lib/helpers/longitudeLatitudeToXYZ";
import { NeCountriesTopoJson } from "../../types/NeTopoJson";

type Props = {
  countryWithProjectCount: CountryWithProjectCount;
  neCountriesTopoJson: NeCountriesTopoJson;
  onPointerEnterHandler?: (properties: GeoJsonProperties) => void;
  onPointerLeaveHandler?: () => void;
  earthRadius: number;
};

const ProjectMarkers: FC<Props> = ({
  countryWithProjectCount,
  neCountriesTopoJson,
  onPointerEnterHandler,
  onPointerLeaveHandler,
  earthRadius,
}) => {
  const world = useMemo(
    () =>
      topojson.feature(
        neCountriesTopoJson,
        neCountriesTopoJson.objects.ne_admin_0_countries,
      ),
    [neCountriesTopoJson],
  );

  const radiusScale = useMemo(() => {
    const maxCount = max(countryWithProjectCount.map((d) => d._count.projects));
    return scaleSqrt<number, number>()
      .domain([1, maxCount ?? 1])
      .range([0.015, 0.06]);
  }, [countryWithProjectCount]);

  const { theme } = useTheme();

  return (
    <>
      {countryWithProjectCount.map((countryWithProjects) => {
        const feature = world.features.find(
          (d) => d.properties.ADM0_A3 === countryWithProjects.isoAlpha3,
        );
        if (!feature)
          return <Fragment key={countryWithProjects.isoAlpha3}></Fragment>;
        const hoverInfo = {
          ...feature?.properties,
          projectCount: countryWithProjects._count.projects,
        };
        const centroid = geoCentroid(feature);
        const radius = radiusScale(countryWithProjects._count?.projects);
        const pos = longitudeLatitudeToXYZ(...centroid, earthRadius, radius);
        return (
          <Mark3dSphere
            key={countryWithProjects.isoAlpha3}
            pos={pos}
            radius={radius}
            onPointerEnterHandler={() =>
              hoverInfo &&
              onPointerEnterHandler &&
              onPointerEnterHandler(hoverInfo)
            }
            onPointerLeaveHandler={onPointerLeaveHandler}
          >
            {theme === "dark" ? (
              <meshStandardMaterial transparent color="white" roughness={0.1} />
            ) : (
              <meshStandardMaterial
                color={"teal"}
                roughness={0.3}
                metalness={0.5}
              />
            )}
          </Mark3dSphere>
        );
      })}
    </>
  );
};

export default ProjectMarkers;

export const MemoizedProjectMarkers = memo(ProjectMarkers);
