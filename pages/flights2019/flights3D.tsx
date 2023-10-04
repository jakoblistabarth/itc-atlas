import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import * as d3 from "d3";
import type { NextPage } from "next";
import { Suspense, useState } from "react";
import { Container } from "theme-ui";
import Globe, { FallBackGlobe } from "../../components/Globe/";
import GlobeEnvironment from "../../components/Globe/GlobeEnvironment";
import Mark3dFlow from "../../components/Mark3dFlow";
import PageBase from "../../components/PageBase";
import getOdMatrix from "../../lib/data/getOdMatrix";
import type { OdMatrix } from "../../types/OdMatrix";

type Props = {
  odMatrix: OdMatrix;
};

const earthRadius = 1;

const Flights: NextPage<Props> = ({ odMatrix }) => {
  const flightsPerRoute = odMatrix.flows.features.map(
    (flow) => flow.properties?.value
  );
  const min = d3.min(flightsPerRoute);
  const max = d3.max(flightsPerRoute);
  const scaleWidth = d3
    .scaleLinear()
    .domain([min ?? 0, max ?? 100])
    .range([0, 100]);

  const [ready, setReady] = useState(false);

  return (
    <PageBase title="ITC's travel activity">
      <Container>
        <main>
          <div style={{ width: "100%", height: "700px" }}>
            <Canvas
              camera={{ position: [0, 0, 5], fov: 30 }}
              shadows
              onCreated={() => setReady(true)}
              data-ready={ready}
            >
              <Suspense fallback={<FallBackGlobe radius={earthRadius} />}>
                <Globe radius={earthRadius} texture={"explorer"} />
              </Suspense>
              <GlobeEnvironment />
              {odMatrix.flows.features.map((flow) => {
                const origin = flow.geometry.coordinates[0];
                const destination = flow.geometry.coordinates[1];
                return (
                  <Mark3dFlow
                    key={flow.properties.od}
                    origin={origin}
                    destination={destination}
                    value={scaleWidth(flow.properties?.value)}
                    data={flow.properties}
                  />
                );
              })}
              <OrbitControls enableZoom={false} enablePan={false} />
            </Canvas>
          </div>
        </main>
      </Container>
    </PageBase>
  );
};

export async function getStaticProps() {
  const odMatrix = await getOdMatrix();
  return {
    props: {
      odMatrix,
    },
  };
}

export default Flights;
