import { FC, useContext, useEffect, useState } from "react";
import { Group } from "@visx/group";
import { TimelineContext } from "../Timeline/TimelineContext";

const Annotations: FC = () => {
  const { xScale } = useContext(TimelineContext);

  const [isSSR, setIsSSR] = useState(true);
  useEffect(() => setIsSSR(false), []);

  return (
    <g id="annotations">
      {!isSSR && (
        <Group id="annotation-travels" top={450}>
          <rect
            id="target1"
            x={xScale(new Date("1995"))}
            y={25}
            width={xScale(new Date("2000")) - xScale(new Date("1995")) - 10}
            height={20}
            fill="none"
          />
          <rect
            id="target2"
            x={xScale(new Date("1975"))}
            y={25}
            width={xScale(new Date("1993")) - xScale(new Date("1975"))}
            height={20}
            fill="none"
          />
          <rect
            id="target3"
            x={xScale(new Date("2000"))}
            y={25}
            width={xScale(new Date("2020")) - xScale(new Date("2000")) - 10}
            height={20}
            fill="none"
          />
        </Group>
      )}
    </g>
  );
};

export default Annotations;
