import { FC, memo, useState } from "react";
import { PhdTheses } from "../../lib/data/queries/phd/getPhdTheses";
import { Canvas } from "@react-three/fiber";
import Book from "../Book";
import { ScaleOrdinal, extent, randomUniform, range } from "d3";
import { Box } from "theme-ui";
import {
  AccumulativeShadows,
  Environment,
  OrbitControls,
  RandomizedLight,
} from "@react-three/drei";
import { getSpiralPoints } from "./PhdThesesBookChart.helpers";
import { Euler, Vector3 } from "three";

type Props = {
  thesesByYear: Map<number, PhdTheses>;
  colorScale: ScaleOrdinal<string, string, string>;
};

const PhdThesesBookChart: FC<Props> = ({ thesesByYear, colorScale }) => {
  const [hoverInfo, setHoverInfo] = useState<PhdTheses[number] | undefined>(
    undefined
  );
  console.log({ hoverInfo });
  const [min, max] = extent(Array.from(thesesByYear.keys()));
  const [start, end] = [min ?? 0, max ? max + 1 : 1];
  const spiralPoints = getSpiralPoints(end + 1 - start, 3, Math.PI * 2 * 2);
  return (
    <Box variant="layout.canvasStage">
      <Canvas
        shadows
        orthographic
        camera={{ zoom: 100, position: [10, 5, -10], near: 0 }}
      >
        <group>
          {range(start, end + 1).map((year, idx) => {
            const position = new Vector3(
              spiralPoints[idx].x,
              0,
              spiralPoints[idx].y
            );
            const roatation = new Euler(
              0,
              -spiralPoints[idx].theta + Math.PI,
              0
            );
            return thesesByYear.get(year) ? (
              <MemoizedBookStack
                key={year}
                position={position}
                rotation={roatation}
                theses={thesesByYear.get(year) ?? []}
                colorScale={colorScale}
                handleBookClick={(thesis) => setHoverInfo(thesis)}
              />
            ) : (
              <Empty position={position} rotation={roatation} />
            );
          })}
        </group>
        <Environment preset="apartment" />
        <AccumulativeShadows opacity={0.3} resolution={1024 * 2 * 2}>
          <RandomizedLight
            ambient={0.65}
            size={10}
            position={[10, 10, 15]}
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
  handleBookClick: (thesis: PhdTheses[number]) => void;
} & JSX.IntrinsicElements["group"];

const BookStack: FC<BookStackProps> = ({
  theses,
  colorScale,
  handleBookClick,
  ...rest
}) => {
  return (
    <group {...rest}>
      {theses.map((d, idx) => (
        <Book
          key={idx}
          color={colorScale(d.departmentMainId ?? "na")}
          rotation-y={Math.PI / 2 + randomUniform(-0.1, 0.1)()}
          position-x={randomUniform(-0.05, 0.05)()}
          position-y={-0.01 + 0.02 * (idx + 1)}
          position-z={randomUniform(-0.05, 0.05)()}
          handleClick={() => handleBookClick(d)}
        />
      ))}
    </group>
  );
};

const Empty: FC<JSX.IntrinsicElements["group"]> = ({ ...rest }) => (
  <group {...rest}>
    <mesh rotation-x={Math.PI / -2}>
      <planeGeometry args={[0.21, 0.297]} />
      <meshStandardMaterial color={"lightgrey"} opacity={0.2} transparent />
    </mesh>
  </group>
);
const MemoizedBookStack = memo(BookStack);

export default PhdThesesBookChart;
