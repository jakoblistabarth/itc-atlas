import { FC, useEffect, useState } from "react";
import { Group } from "@visx/group";
import { Text } from "@visx/text";
import LeaderLine from "../LeaderLine";
import { Vector2 } from "three";
import { useTimelineContext } from "../Timeline/TimelineContext";

const IndonesiaAnnotationsPrint: FC = () => {
  const { xScale } = useTimelineContext();

  const [isSSR, setIsSSR] = useState(true);
  useEffect(() => setIsSSR(false), []);

  return (
    <g id="annotations">
      {!isSSR && (
        <Group id="annotation-travels" top={400}>
          <Group fontSize={9} left={xScale(new Date("1985"))}>
            <Text
              fontFamily="Fraunces Variable"
              fontWeight={"bold"}
              textAnchor="end"
            >
              Travels over time
            </Text>
            <Text
              textAnchor="end"
              verticalAnchor={"start"}
              width={320}
              y={4}
              lineHeight={11}
            >
              In the early years staff was send for long stay activities (to set
              up and run education programs) and later only for short
              collaboration missions (to advise and lecture).
            </Text>
          </Group>
          <Group>
            <LeaderLine
              sourcePos={new Vector2(xScale(new Date("1985")) + 10, 30)}
              targetPos={new Vector2(xScale(new Date("1990")), 70)}
              orientation="vertical"
              stroke="black"
              strokeWidth={0.5}
            />
            <LeaderLine
              sourcePos={new Vector2(xScale(new Date("1985")) + 10, 30)}
              targetPos={new Vector2(xScale(new Date("2002")), 80)}
              orientation="vertical"
              stroke="black"
              strokeWidth={0.5}
            />
          </Group>
          <Group>
            <rect
              x={xScale(new Date("1995"))}
              y={75}
              width={xScale(new Date("2000")) - xScale(new Date("1995")) - 10}
              height={20}
              fill="none"
              stroke="black"
            />
            <Text
              x={xScale(new Date("1998"))}
              y={20}
              fontSize={9}
              width={240}
              verticalAnchor="start"
            >
              Due to a conflict between both governments the development
              relations were frozen.
            </Text>
            <LeaderLine
              sourcePos={new Vector2(xScale(new Date("1999")), 50)}
              targetPos={new Vector2(xScale(new Date("1998")), 75)}
              stroke="black"
              strokeWidth={0.5}
            />
          </Group>
        </Group>
      )}
    </g>
  );
};

export default IndonesiaAnnotationsPrint;
