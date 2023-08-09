import { FC } from "react";
import { FaCarrot, FaMoneyBill } from "react-icons/fa";
import { GiHeartPlus, GiWaterDrop } from "react-icons/gi";
import { RiLeafFill } from "react-icons/ri";
import PatternShape from "../PatternShape";

type Props = {
  color: string;
};

const PatternTopics: FC<Props> = ({ color }) => {
  const s = 16;
  const patternProps = {
    spacing: 0,
    width: s / 2,
    height: s,
  };
  const shapeProps = {
    x: s / -4,
    y: s / -2,
    color: color,
  };
  return (
    <defs>
      <PatternShape name="A" {...patternProps}>
        <FaMoneyBill {...shapeProps} />
      </PatternShape>
      <PatternShape name="B" {...patternProps}>
        <GiWaterDrop {...shapeProps} />
      </PatternShape>
      <PatternShape name="C" {...patternProps}>
        <FaCarrot {...shapeProps} />
      </PatternShape>
      <PatternShape name="D" {...patternProps}>
        <GiHeartPlus {...shapeProps} />
      </PatternShape>
      <PatternShape name="E" {...patternProps}>
        <RiLeafFill {...shapeProps} />
      </PatternShape>
    </defs>
  );
};

export default PatternTopics;
