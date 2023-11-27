import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import type { GetStaticProps, NextPage } from "next";
import Mark3dSphere from "../../components/Mark3dSphere";
import getCountries from "../../lib/data/getCountries";
import { SharedPageProps } from "../../types/Props";
import * as topojson from "topojson-client";
import { geoCentroid } from "d3-geo";
import React from "react";
import { scaleLinear, min, max } from "d3";
import { useState, useCallback, FC, useMemo, memo } from "react";
import Globe from "../../components/Globe/";
import longitudeLatitudeToXYZ from "../../lib/helpers/longitudeLatitudeToXYZ";
import getCountryCodes from "../../lib/data/queries/country/getCountryCodes";
import getCountryWithProjectCount from "../../lib/data/queries/country/getCountryWithProjectCount";
import GlobeEnvironment from "../../components/Globe/GlobeEnvironment";
import PageBase from "../../components/PageBase";
import Container from "../../components/Container";
import { CountryWithProjectCount } from "../../lib/data/queries/country/getCountryWithProjectCount";
import type { GeoJsonProperties } from "geojson";
import Tooltip from "../../components/Tooltip";
import KPI from "../../components/KPI";
import { NeCountriesTopoJson } from "../../types/NeTopoJson";

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
          <div style={{ width: "100%", height: "700px" }}>
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
                {hoverInfo &&
                  (hoverInfo._count?.projects ? (
                    <div>
                      <KPI
                        number={hoverInfo._count.projects}
                        unit={hoverInfo.isoAlpha3}
                      />
                    </div>
                  ) : (
                    <div>
                      <KPI number={0} unit="No projects" />
                    </div>
                  ))}
              </Tooltip.Content>
            </Tooltip.Root>
          </div>
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
    const minCount = min(countryWithProjectCount.map((d) => d._count.projects));
    const maxCount = max(countryWithProjectCount.map((d) => d._count.projects));
    return scaleLinear<number, number>()
      .domain([minCount ?? 0, maxCount ?? 1])
      .range([0.005, 0.03]);
  }, [countryWithProjectCount]);

  return (
    <>
      {world.features.map((country, i) => {
        const centroid = geoCentroid(country);
        const countryInfo = countryWithProjectCount.find(
          (d) => d.isoAlpha3 == country.properties.ADM0_A3,
        );
        const radius = radiusScale(countryInfo?._count.projects ?? 0.01);
        const pos = longitudeLatitudeToXYZ(
          centroid[0],
          centroid[1],
          earthRadius,
          radius,
        );
        return (
          <Mark3dSphere
            key={i}
            pos={pos}
            radius={radius}
            data={countryInfo ?? {}}
            onPointerEnterHandler={onPointerEnterHandler}
            onPointerLeaveHandler={onPointerLeaveHandler}
          />
        );
      })}
    </>
  );
};

const MemoizedMarker3Ds = memo(Marker3Ds);
