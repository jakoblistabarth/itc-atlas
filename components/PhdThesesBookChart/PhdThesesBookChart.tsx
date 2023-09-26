import { FC } from "react";
import { PhdTheses } from "../../lib/data/queries/phd/getPhdTheses";
import { Canvas } from "@react-three/fiber";
import Book from "../Book";
import { ScaleOrdinal, extent, randomUniform } from "d3";
import { Box } from "theme-ui";
import {
  AccumulativeShadows,
  Environment,
  OrbitControls,
  RandomizedLight,
} from "@react-three/drei";

type Props = {
  thesesByYear: Map<number, PhdTheses>;
  colorScale: ScaleOrdinal<string, string, string>;
};

const PhdThesesBookChart: FC<Props> = ({ thesesByYear, colorScale }) => {
  const [min, max] = extent(Array.from(thesesByYear.keys()));
  const gap = 0.5;
  const width = 0.5 * ((max ?? 1) - (min ?? 0));

  return (
    <Box variant="layout.canvasStage">
      <Canvas
        shadows
        orthographic
        camera={{ zoom: 60, position: [10, 5, -10], near: 0, far: 50 }}
      >
        <group position-x={width / -2}>
          {Array.from(thesesByYear.keys()).map((year, idx) => (
            <BookStack
              position={[gap * idx + gap, 0, 0]}
              key={year}
              theses={thesesByYear.get(year) ?? []}
              colorScale={colorScale}
            />
          ))}
        </group>
        <Environment preset="apartment" />
        <AccumulativeShadows opacity={0.3} scale={30} resolution={1024 * 2 * 2}>
          <RandomizedLight
            ambient={0.65}
            near={0}
            position={[20, 10, 25]}
            mapSize={1024 * 2}
          />
        </AccumulativeShadows>
        <OrbitControls minZoom={40} maxPolarAngle={Math.PI / 2} makeDefault />
      </Canvas>
    </Box>
  );
};

type BookStackProps = {
  theses: PhdTheses;
  colorScale: ScaleOrdinal<string, string, string>;
} & JSX.IntrinsicElements["group"];

const BookStack: FC<BookStackProps> = ({ theses, colorScale, ...rest }) => {
  return (
    <group {...rest}>
      {theses.map((d, idx) => (
        <Book
          key={idx}
          color={colorScale(d.departmentMainId ?? "na")}
          rotation-y={Math.PI / 2 + randomUniform(-0.1, 0.1)()}
          position-x={randomUniform(-0.05, 0.05)()}
          position-y={0.04 * (idx + 1)}
          position-z={randomUniform(-0.05, 0.05)()}
        />
      ))}
    </group>
  );
};

export default PhdThesesBookChart;
