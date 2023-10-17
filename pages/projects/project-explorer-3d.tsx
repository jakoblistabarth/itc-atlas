import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import type { GetStaticProps, NextPage } from "next";
import Mark3dSphere from "../../components/Mark3dSphere";
import getCountries from "../../lib/data/getCountries";
import { SharedPageProps } from "../../types/Props";
import * as topojson from "topojson-client";
import { geoCentroid } from "d3-geo";
import React, { useRef } from "react";
import { scaleLinear } from "d3";
import Globe from "../../components/Globe/";
import longitudeLatitudeToXYZ from "../../lib/helpers/longitudeLatitudeToXYZ";
import GlobeTexture from "../../components/Globe/GlobeTexture";
import getCountryCodes from "../../lib/data/queries/country/getCountryCodes";
import GlobeEnvironment from "../../components/Globe/GlobeEnvironment";
import PageBase from "../../components/PageBase";
import CanvasStage from "../../components/CanvasStage";
import Container from "../../components/Container";

type Props = SharedPageProps;

const ProjectExplorer3D: NextPage<Props> = ({ neCountriesTopoJson }) => {
  const earthRadius = 1;
  const world = topojson.feature(
    neCountriesTopoJson,
    neCountriesTopoJson.objects.ne_admin_0_countries,
  );

  const canvasRef = useRef<HTMLCanvasElement>(null);

  return (
    <PageBase title="Projects Explorer">
      <Container>
        <main>
          <CanvasStage>
            <Canvas camera={{ position: [0, 0, 5], fov: 30 }} shadows>
              <Globe radius={earthRadius} texture={"explorer"}>
                {world.features.map((country, i) => {
                  const centroid = geoCentroid(country);
                  const radius = scaleLinear()
                    .domain([0, 1])
                    .range([0.005, 0.03])(Math.random());
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
                      data={country.properties}
                    />
                  );
                })}
              </Globe>
              <GlobeEnvironment />
              <OrbitControls enableZoom={false} enablePan={false} />
            </Canvas>
            <GlobeTexture
              neCountriesTopoJson={neCountriesTopoJson}
              ref={canvasRef}
            />
          </CanvasStage>
        </main>
      </Container>
    </PageBase>
  );
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const neCountriesTopoJson = getCountries();
  const countries = await getCountryCodes();

  return {
    props: {
      countries,
      neCountriesTopoJson,
    },
  };
};

export default ProjectExplorer3D;
