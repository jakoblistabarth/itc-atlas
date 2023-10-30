import { FC, memo } from "react";
import { PhdTheses } from "../../lib/data/queries/phd/getPhdTheses";
import { ScaleOrdinal } from "d3";
import { MemoizedBook } from "../Book";
import { Euler, Vector3 } from "three";
import { Text3D } from "@react-three/drei";

type Props = {
  theses: PhdTheses;
  colorScale: ScaleOrdinal<string, string, string>;
  activeThesis?: string;
  label?: string;
  setActiveThesis: (id?: string) => void;
  position: Vector3;
  rotation: Euler;
} & JSX.IntrinsicElements["group"];

const BookStack: FC<Props> = ({
  theses,
  colorScale,
  activeThesis,
  setActiveThesis,
  label,
  ...rest
}) => {
  return (
    <group {...rest}>
      {theses.map((d, idx) => (
        <MemoizedBook
          key={idx}
          thesisId={d.id}
          active={d.id === activeThesis}
          color={colorScale(d.departmentMainId ?? "na")}
          wiggle={true}
          position-y={-0.01 + 0.02 * (idx + 1)}
          setActiveThesis={setActiveThesis}
        />
      ))}

      {label && (
        <Text3D
          castShadow
          receiveShadow
          size={0.05}
          font={"/fonts/Inter_Regular.json"}
          height={0.005}
          rotation-x={-Math.PI / 2}
          rotation-z={Math.PI / 2}
          position-x={0.25}
          position-z={0.075}
        >
          {label}
          <meshStandardMaterial color="grey" />
        </Text3D>
      )}
    </group>
  );
};

export default BookStack;

export const MemoizedBookStack = memo(BookStack);
