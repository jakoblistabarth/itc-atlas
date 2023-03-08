import { FC } from "react";
import { FaCarrot, FaMoneyBill } from "react-icons/fa";
import { GiHeartPlus, GiWaterDrop } from "react-icons/gi";
import { RiLeafFill } from "react-icons/ri";
import PatternShapes from "./defs/patterns/PatternShapes";

type Props = {
  color: string;
};

const TopicPatterns: FC<Props> = ({ color }) => {
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
      <PatternShapes name="A" {...patternProps}>
        <FaMoneyBill {...shapeProps} />
      </PatternShapes>
      <PatternShapes name="B" {...patternProps}>
        /react-icons/search
        <GiWaterDrop {...shapeProps} />
      </PatternShapes>
      <PatternShapes name="C" {...patternProps}>
        <FaCarrot {...shapeProps} />
      </PatternShapes>
      <PatternShapes name="D" {...patternProps}>
        <GiHeartPlus {...shapeProps} />
      </PatternShapes>
      <PatternShapes name="E" {...patternProps}>
        <RiLeafFill {...shapeProps} />
      </PatternShapes>
    </defs>
  );
};

export default TopicPatterns;
