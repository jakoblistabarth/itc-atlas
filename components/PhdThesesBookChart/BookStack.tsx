import { FC, memo } from "react";
import { PhdTheses } from "../../lib/data/queries/phd/getPhdTheses";
import { ScaleOrdinal } from "d3";
import { MemoizedBook } from "../Book";
import { Euler, Vector3 } from "three";

type Props = {
  theses: PhdTheses;
  colorScale: ScaleOrdinal<string, string, string>;
  activeThesis?: string;
  setActiveThesis: (id?: string) => void;
  position: Vector3;
  rotation: Euler;
} & JSX.IntrinsicElements["group"];

const BookStack: FC<Props> = ({
  theses,
  colorScale,
  activeThesis,
  setActiveThesis,
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
    </group>
  );
};

export default BookStack;

export const MemoizedBookStack = memo(BookStack);
