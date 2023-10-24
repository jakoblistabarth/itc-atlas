import { FC, useState } from "react";
import { PhdTheses } from "../../lib/data/queries/phd/getPhdTheses";
import { Canvas } from "@react-three/fiber";
import { ScaleOrdinal, extent, range } from "d3";
import {
  AccumulativeShadows,
  Environment,
  OrbitControls,
  RandomizedLight,
} from "@react-three/drei";
import { getSpiralPoints } from "./PhdThesesBookChart.helpers";
import { Euler, Vector3 } from "three";
import CanvasStage from "../CanvasStage";
import { MemoizedBookStack } from "./BookStack";
import Empty from "./Empty";

type Props = {
  thesesByYear: Map<number, PhdTheses>;
  colorScale: ScaleOrdinal<string, string, string>;
};

const PhdThesesBookChart: FC<Props> = ({ thesesByYear, colorScale }) => {
  const [min, max] = extent(Array.from(thesesByYear.keys()));
  const [start, end] = [min ?? 0, max ? max + 1 : 1];
  const spiralPoints = getSpiralPoints(end + 1 - start, 3, Math.PI * 2 * 2);
  const [activeThesis, setActiveThesis] = useState<string | undefined>(
    undefined,
  );
  console.log(activeThesis);
  return (
    <CanvasStage>
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
              spiralPoints[idx].y,
            );
            const roatation = new Euler(
              0,
              -spiralPoints[idx].theta + Math.PI,
              0,
            );
            return thesesByYear.get(year) ? (
              <MemoizedBookStack
                key={idx}
                position={position}
                rotation={roatation}
                theses={thesesByYear.get(year) ?? []}
                colorScale={colorScale}
                activeThesis={activeThesis}
                setActiveThesis={setActiveThesis}
              />
            ) : (
              <Empty key={idx} position={position} rotation={roatation} />
            );
          })}
        </group>
        <Environment preset="apartment" />
        <AccumulativeShadows opacity={0.3} scale={30} resolution={1024 * 2 * 2}>
          <RandomizedLight
            ambient={0.65}
            size={10}
            position={[10, 10, 15]}
            mapSize={1024 * 2}
          />
        </AccumulativeShadows>
        <OrbitControls minZoom={40} maxPolarAngle={Math.PI / 2} makeDefault />
      </Canvas>
    </CanvasStage>
  );
};

export default PhdThesesBookChart;
