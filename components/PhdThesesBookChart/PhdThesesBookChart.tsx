import { FC, useState } from "react";
import { PhdTheses } from "../../lib/data/queries/phd/getPhdTheses";
import { Canvas } from "@react-three/fiber";
import { ScaleOrdinal, extent, range } from "d3";
import {
  AccumulativeShadows,
  Environment,
  OrbitControls,
} from "@react-three/drei";
import { getSpiralPoints } from "./PhdThesesBookChart.helpers";
import { Euler, Vector3 } from "three";
import CanvasStage from "../CanvasStage";
import { MemoizedBookStack } from "./BookStack";
import Empty from "./Empty";
import ThesisInfo from "./ThesisInfo";
import Callout from "../Callout";
import { HiCursorClick } from "react-icons/hi";

type Props = {
  thesesByYear: Map<number, PhdTheses>;
  colorScale: ScaleOrdinal<string, string, string>;
  startYear?: number;
};

const PhdThesesBookChart: FC<Props> = ({
  thesesByYear,
  colorScale,
  startYear,
}) => {
  const [min, max] = extent(Array.from(thesesByYear.keys()));
  const [start, end] = [startYear ?? min ?? 0, max ? max + 1 : 1];
  const spiralPoints = getSpiralPoints(end + 1 - start, 3, Math.PI * 2 * 2);
  const [activeThesis, setActiveThesis] = useState<string | undefined>(
    undefined,
  );
  const thesisInfo = new Map(
    Array.from(thesesByYear.values())
      .flat()
      .map((d) => [d.id, d]),
  ).get(activeThesis ?? "");
  return (
    <div>
      <CanvasStage>
        <div className="relative h-full">
          <ThesisInfo
            info={thesisInfo}
            colorScale={colorScale}
            onCloseHandler={() => setActiveThesis(undefined)}
          />
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
                const theses = thesesByYear.get(year) ?? [];
                const hasActiveTheses =
                  activeThesis &&
                  theses.map((d) => d.id).includes(activeThesis);
                return theses.length > 0 ? (
                  <MemoizedBookStack
                    key={idx}
                    position={position}
                    rotation={roatation}
                    theses={theses}
                    label={year.toString()}
                    colorScale={colorScale}
                    activeThesis={hasActiveTheses ? activeThesis : undefined}
                    setActiveThesis={setActiveThesis}
                    onPointerMissed={() => setActiveThesis(undefined)}
                  />
                ) : (
                  <Empty key={idx} position={position} rotation={roatation} />
                );
              })}
            </group>
            <Environment preset="apartment" />
            <AccumulativeShadows
              opacity={0.3}
              scale={30}
              limit={10}
              resolution={2 ** 12}
            >
              <directionalLight castShadow position={[9, 11, 14]} />
              <directionalLight castShadow position={[10, 9, 16]} />
              <directionalLight castShadow position={[11, 10, 15]} />
            </AccumulativeShadows>
            <OrbitControls
              minZoom={40}
              maxPolarAngle={Math.PI / 2}
              makeDefault
            />
          </Canvas>
        </div>
      </CanvasStage>
      <Callout Icon={HiCursorClick}>
        Click on a thesis to get further information!
        <details className="mt-2 text-sm">
          <summary className="font-bold">Interaction details</summary>
          Click or touch (on mobile devices) on one of the books to retrieve
          further information about the selected thesis.
        </details>
        <details className="mt-2 text-sm [&_p:not(:last-of-type)]:mb-1">
          <summary className="font-bold">Methodology</summary>
          <p>
            Only finished theses are considered – theses without a valid year of
            publication are excluded.
          </p>
          <p>
            Most of the theses are allocated to one department, each book is
            colored according to this allocation. However, not all theses have a
            specific department indicated. Additionally, one ore several
            secondary departements can be assigned to a thesis.
          </p>
        </details>
      </Callout>
    </div>
  );
};

export default PhdThesesBookChart;
