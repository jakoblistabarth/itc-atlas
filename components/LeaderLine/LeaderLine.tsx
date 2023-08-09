import type { FC, SVGProps } from "react";
import { linkHorizontal, linkVertical } from "d3";
import { Vector2 } from "three";

type Props = React.PropsWithChildren<{
  sourcePos: Vector2;
  targetPos: Vector2;
  orientation?: "horizontal" | "vertical";
}> &
  SVGProps<SVGPathElement>;

const LeaderLine: FC<Props> = ({
  sourcePos,
  targetPos,
  orientation,
  ...rest
}) => {
  const dx = Math.abs(sourcePos.x - targetPos.x);
  const dy = Math.abs(sourcePos.y - targetPos.y);
  const link =
    orientation === "vertical"
      ? linkVertical
      : orientation === "horizontal"
      ? linkHorizontal
      : dx > dy
      ? linkHorizontal
      : linkVertical;
  const d = link()({
    source: [sourcePos.x, sourcePos.y],
    target: [targetPos.x, targetPos.y],
  });
  return <path d={d ?? ""} fill={`${rest.fill ?? "none"}`} {...rest} />;
};

export default LeaderLine;
