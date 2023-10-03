import { ScaleOrdinal, randomUniform } from "d3";
import { PhdTheses } from "../../lib/data/queries/phd/getPhdTheses";
import { FC } from "react";
import Book from "../Book";

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
          position-y={0.04 * (idx + 1)}
          position-z={randomUniform(-0.05, 0.05)()}
          handleClick={() => (handleBookClick(d), console.log({ d }))}
        />
      ))}
    </group>
  );
};

export default BookStack;
