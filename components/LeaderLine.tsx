import type { FC, SVGProps } from "react";
import { linkHorizontal, linkVertical, ScaleTime } from "d3";
import { Vector2 } from "three";

type Props = React.PropsWithChildren<{
  sourcePos: Vector2;
  targetPos: Vector2;
}> &
  SVGProps<SVGPathElement>;

const LeaderLine: FC<Props> = ({ sourcePos, targetPos, ...rest }) => {
  const linkGenerator = linkVertical(); //TODO: use linkradial instead with dyanmic angle?
  const d = linkGenerator({
    source: [sourcePos.x, sourcePos.y],
    target: [targetPos.x, targetPos.y],
  });
  return <path d={d ?? ""} fill={`${rest.fill ?? "none"}`} {...rest} />;
};

export default LeaderLine;
