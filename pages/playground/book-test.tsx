/** @jsxImportSource theme-ui */

import {
  AccumulativeShadows,
  Environment,
  OrbitControls,
  RandomizedLight,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { randomInt, randomUniform, range } from "d3";
import type { NextPage } from "next";
import { Box } from "theme-ui";
import Book from "../../components/Book";
import PageBase from "../../components/PageBase";

const Page: NextPage = () => {
  return (
    <PageBase title="Book test">
      <Box variant="layout.canvasStage" sx={{ height: "500px" }}>
        <Canvas
          orthographic
          shadows
          camera={{ zoom: 160, position: [0, 2, 5] }}
        >
          <OrbitControls makeDefault />
          <Environment preset="apartment" />
          <AccumulativeShadows opacity={0.3}>
            <RandomizedLight
              castShadow
              position={[2, 5, 5]}
              mapSize={64 * 2 ** 6}
            />
          </AccumulativeShadows>

          <group position-x={-2.25}>
            {range(10).map((year) =>
              range(randomInt(2, 20)()).map((d) => (
                <Book
                  key={`${year}-${d}`}
                  color={["red", "yellow", "orange", "blue"][randomInt(4)()]}
                  rotation-y={Math.PI / 2 + randomUniform(-0.1, 0.1)()}
                  position={[
                    0.5 * year,
                    0.04 * (d + 1),
                    randomUniform(-0.05, 0.05)(),
                  ]}
                />
              ))
            )}
          </group>
        </Canvas>
      </Box>
    </PageBase>
  );
};
export default Page;
