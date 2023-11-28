import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { max, scaleSqrt } from "d3";
import { geoCentroid } from "d3-geo";
import type { GeoJsonProperties } from "geojson";
import type { GetStaticProps, NextPage } from "next";
import { FC, memo, useCallback, useMemo, useState } from "react";
import * as topojson from "topojson-client";
import CanvasStage from "../../components/CanvasStage";
import Container from "../../components/Container";
import Globe from "../../components/Globe/";
import GlobeEnvironment from "../../components/Globe/GlobeEnvironment";
import KPI from "../../components/KPI";
import Mark3dSphere from "../../components/Mark3dSphere";
import PageBase from "../../components/PageBase";
import Tooltip from "../../components/Tooltip";
import getCountries from "../../lib/data/getCountries";
import getCountryCodes from "../../lib/data/queries/country/getCountryCodes";
import getCountryWithProjectCount, {
  CountryWithProjectCount,
} from "../../lib/data/queries/country/getCountryWithProjectCount";
import longitudeLatitudeToXYZ from "../../lib/helpers/longitudeLatitudeToXYZ";
import { NeCountriesTopoJson } from "../../types/NeTopoJson";
import { SharedPageProps } from "../../types/Props";

type Props = SharedPageProps & {
  countryWithProjectCount: CountryWithProjectCount;
};

const ProjectExplorer3D: NextPage<Props> = ({
  neCountriesTopoJson,
  countryWithProjectCount,
}) => {
  const [hoverInfo, setHoverInfo] = useState<GeoJsonProperties | undefined>(
    undefined,
  );
  const onPointerEnterHandler = useCallback((properties: GeoJsonProperties) => {
    setHoverInfo(properties);
  }, []);
  const onPointerLeaveHandler = useCallback(() => setHoverInfo(undefined), []);
  const earthRadius = 1;

  return (
    <PageBase title="Projects Explorer">
      <Container>
        <main>
          <CanvasStage className="h-[700px]">
            <Tooltip.Root open={!!hoverInfo} followCursor placement="top-start">
              <Tooltip.Trigger asChild>
                <Canvas camera={{ position: [0, 0, 5], fov: 30 }} shadows>
                  <Globe radius={earthRadius} texture={"explorer"}>
                    <MemoizedMarker3Ds
                      countryWithProjectCount={countryWithProjectCount}
                      neCountriesTopoJson={neCountriesTopoJson}
                      onPointerEnterHandler={onPointerEnterHandler}
                      onPointerLeaveHandler={onPointerLeaveHandler}
                      earthRadius={earthRadius}
                    />
                  </Globe>
                  <GlobeEnvironment />
                  <OrbitControls enableZoom={false} enablePan={false} />
                </Canvas>
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
          </CanvasStage>
        </main>
      </Container>
    </PageBase>
  );
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const neCountriesTopoJson = getCountries();
  const countries = await getCountryCodes();
  const countryWithProjectCount = await getCountryWithProjectCount();

  return {
    props: {
      countries,
      neCountriesTopoJson,
      countryWithProjectCount,
    },
  };
};

export default ProjectExplorer3D;

const Marker3Ds: FC<{
  countryWithProjectCount: CountryWithProjectCount;
  neCountriesTopoJson: NeCountriesTopoJson;
  onPointerEnterHandler?: (properties: GeoJsonProperties) => void;
  onPointerLeaveHandler?: () => void;
  earthRadius: number;
}> = ({
  countryWithProjectCount,
  neCountriesTopoJson,
  onPointerEnterHandler,
  onPointerLeaveHandler,
  earthRadius,
}) => {
  const world = topojson.feature(
    neCountriesTopoJson,
    neCountriesTopoJson.objects.ne_admin_0_countries,
  );
  const radiusScale = useMemo(() => {
    const maxCount = max(countryWithProjectCount.map((d) => d._count.projects));
    return scaleSqrt<number, number>()
      .domain([1, maxCount ?? 1])
      .range([0.0075, 0.03]);
  }, [countryWithProjectCount]);

  return (
    <>
      {countryWithProjectCount.map((countryWithProjects, i) => {
        const feature = world.features.find(
          (d) => d.properties.ADM0_A3 === countryWithProjects.isoAlpha3,
        );
        if (!feature) return <></>;
        const hoverInfo = {
          ...feature?.properties,
          projectCount: countryWithProjects._count.projects,
        };
        const centroid = geoCentroid(feature);
        const radius = radiusScale(countryWithProjects._count?.projects);
        const pos = longitudeLatitudeToXYZ(...centroid, earthRadius, radius);
        return (
          <Mark3dSphere
            key={i}
            pos={pos}
            radius={radius}
            onPointerEnterHandler={() =>
              hoverInfo &&
              onPointerEnterHandler &&
              onPointerEnterHandler(hoverInfo)
            }
            onPointerLeaveHandler={onPointerLeaveHandler}
          />
        );
      })}
    </>
  );
};

const MemoizedMarker3Ds = memo(Marker3Ds);
