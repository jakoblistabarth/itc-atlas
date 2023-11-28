import { Canvas } from "@react-three/fiber";
import type { NextPage } from "next";
import BlockDiagram from "../../components/BlockDiagram";
import BlockDiagramMarker from "../../components/BlockDiagram/BlockDiagramMarker";
import useSWRImmutable from "swr/immutable";
import PageBase from "../../components/PageBase";
import BlockDiagramEnvironment from "../../components/BlockDiagram/BlockDiagramEnvironment";
import Container from "../../components/Container";
import CanvasStage from "../../components/CanvasStage";
import Section from "../../components/Section";
import { Sphere } from "@react-three/drei";

const Page: NextPage = () => {
  const side = 1;
  const aut = useSWRImmutable("/api/data/elevationModel/Grossglockner");

  return (
    <PageBase title="Block diagram test">
      <Container>
        <Section>
          <h2>Großglockner</h2>
          <p>Austria</p>
          <CanvasStage className="h-[500px]">
            <Canvas shadows>
              {aut.data && (
                <BlockDiagram
                  side={side}
                  ratio={aut.data.dimensions.ratio}
                  yScale={0.00005}
                  zOffset={0.1}
                  // textureFileName="grossglockner.png"
                  data={Float32Array.from(aut.data.elevation)}
                  bBox={aut.data.bBox}
                >
                  {[
                    [46.99, 13.01],
                    [47.09, 12.8],
                    [47.0736888633103, 12.6946860503528],
                  ].map(([lat, lng]) => (
                    <BlockDiagramMarker
                      key={`${lng}-${lat}`}
                      textureFileName="aus.jpg"
                      longitude={lng}
                      latitude={lat}
                    />
                  ))}
                </BlockDiagram>
              )}
              <Sphere
                args={[0.25]}
                scale={0.3}
                position-y={0.4}
                castShadow
                receiveShadow
              >
                <meshStandardMaterial color={"red"} />
              </Sphere>
              <BlockDiagramEnvironment />
            </Canvas>
          </CanvasStage>
        </Section>
      </Container>
    </PageBase>
  );
};
export default Page;
