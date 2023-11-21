import { Text3D } from "@react-three/drei";
import { ScaleTime, max, scaleSqrt } from "d3";
import { geoBertin1953 } from "d3-geo-projection";
import React, { FC, memo, useMemo } from "react";
import { MeshStandardMaterial } from "three";
import type { Topology } from "topojson-specification";
import longitudeLatitudeTimeToXYZ from "../../lib/helpers/longitudeLatitudeTimeToXYZ";
import { fDateYear } from "../../lib/utilities/formaters";
import { SpaceTimeCubeEvent } from "../../types/SpaceTimeCubeEvent";
import PlaneOutline from "../PlaneOutline";
import PrismMap from "../PrismMap";
import { MemoizedSpaceTimeCubeEvents } from "./SpaceTimeCubeEvents";

type Props = React.PropsWithChildren<{
  events: SpaceTimeCubeEvent[];
  topology: Topology;
  topologyObject: string;
  side?: number;
  height?: number;
  timeScale: ScaleTime<number, number>;
  onPointerDownHandler?: (featureId: { id: string; label: string }) => void;
  onPointerEnterHandler?: (featureId: { id: string; label: string }) => void;
  onPointerLeaveHandler?: () => void;
  selectedFeatures: { id: string; label: string }[];
  selectedYear?: Date;
}>;

const materials = Object.fromEntries(
  ["teal", "white", "grey"].map((d) => [
    d,
    new MeshStandardMaterial({ color: d }),
  ]),
);

const SpaceTimeCube: FC<Props> = ({
  events,
  topology,
  topologyObject,
  timeScale,
  selectedYear,
  selectedFeatures,
  onPointerEnterHandler,
  onPointerLeaveHandler,
  onPointerDownHandler,
  side = 10,
  height = 10,
}) => {
  const { eventSide, fontSize, projection } = useMemo(() => {
    const eventSide = height / timeScale.ticks().length - 0.5;
    const fontSize = eventSide / 2;
    const projection = geoBertin1953().fitExtent(
      [
        [-side / 2, -side / 2],
        [side / 2, side / 2],
      ],
      {
        type: "Sphere",
      },
    );
    return { eventSide, fontSize, projection };
  }, [height, side, timeScale]);

  const eventsWithPosition = useMemo(
    () =>
      events.map((e) => ({
        ...e,
        pos: longitudeLatitudeTimeToXYZ(
          e.coordinates,
          e.dateStart,
          timeScale,
          projection,
        ),
      })),
    [events, projection, timeScale],
  );

  const selectedEvents = useMemo(
    () =>
      selectedFeatures.length != 0 || selectedYear
        ? eventsWithPosition.filter(
            (event) =>
              selectedFeatures.map((d) => d.id).includes(event.name) ||
              (selectedYear &&
                event.dateStart.getFullYear() === selectedYear.getFullYear()),
          )
        : eventsWithPosition,
    [eventsWithPosition, selectedFeatures, selectedYear],
  );

  const sizeScale = useMemo(
    () =>
      scaleSqrt()
        .domain([0, max(selectedEvents, (d) => d.size) ?? 1])
        .range([0, eventSide]),
    [selectedEvents, eventSide],
  );

  return (
    <>
      <group position-y={eventSide / 2}>
        <group
          onPointerEnter={() => (document.body.style.cursor = "pointer")}
          onPointerLeave={() => (document.body.style.cursor = "auto")}
        >
          {timeScale.ticks(10).map((t, idx) => {
            const isActiveYear = selectedYear && t === selectedYear;
            return (
              <group
                key={`${t.getDate()}-${idx}`}
                position={[0, timeScale(t), 0]}
              >
                <PlaneOutline
                  side={side}
                  color="grey"
                  lineWidth={isActiveYear ? 2 : 0.5}
                />
                <mesh>
                  <Text3D
                    font={"/fonts/Inter_Regular.json"}
                    position={[side / 2 + 0.25, 0, side * 0.5]}
                    size={fontSize}
                    height={fontSize / 50}
                    bevelEnabled
                    bevelThickness={0.02}
                    bevelSize={0.005}
                    curveSegments={4}
                    material={materials.grey}
                  >
                    {fDateYear(t)}
                  </Text3D>
                </mesh>
              </group>
            );
          })}
        </group>

        <MemoizedSpaceTimeCubeEvents
          events={selectedEvents}
          scale={sizeScale}
        />

        {selectedYear && (
          <group position={[0, timeScale(selectedYear), 0]}>
            <PlaneOutline side={side} color="teal" lineWidth={2} />
            <mesh>
              <Text3D
                font={"/fonts/Inter_Regular.json"}
                position={[side / 2 + 0.25, 0, side * 0.5]}
                size={fontSize}
                height={fontSize / 50}
                bevelEnabled
                bevelThickness={0.02}
                bevelSize={0.005}
                curveSegments={4}
                material={materials.teal}
              >
                {selectedYear.getFullYear()}
              </Text3D>
            </mesh>
          </group>
        )}
      </group>

      <group position-y={selectedYear ? timeScale(selectedYear) : 0}>
        <MemoizedPrismMap
          topology={topology}
          topologyObject={topologyObject}
          projection={geoBertin1953()}
          width={side}
          length={side}
          defaultColor="white"
          defaultExtrusion={0.05}
          extrudeGeometryOptions={{
            bevelSize: 0.005,
            bevelThickness: 0.005,
          }}
          selectedFeatures={selectedFeatures}
          onFeaturePointerEnterHandler={({ id, label }) =>
            onPointerEnterHandler && onPointerEnterHandler({ id, label })
          }
          onFeaturePointerLeaveHandler={() =>
            onPointerLeaveHandler && onPointerLeaveHandler()
          }
          onFeaturePointerDownHandler={({ id, label }) =>
            onPointerDownHandler && onPointerDownHandler({ id, label })
          }
        />
      </group>
    </>
  );
};

export default SpaceTimeCube;

const MemoizedPrismMap = memo(PrismMap);
