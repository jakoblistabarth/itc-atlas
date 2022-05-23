import type { FC } from "react";
import { Bounds } from "../../../types/MapOptions";

type Props = {
  bounds: Bounds;
};

const LayoutDebug: FC<Props> = ({ bounds }) => (
  <g opacity={0.2}>
    {bounds.frame?.top && (
      <rect
        x={0}
        y={0}
        width={bounds.width}
        height={bounds.frame?.top}
        fill={"red"}
      />
    )}
    {bounds.frame?.bottom && (
      <rect
        x={0}
        y={(bounds.frame?.top ?? 0) + (bounds.mapBody?.height ?? 0)}
        width={bounds.width}
        height={bounds.frame.bottom}
        fill={"blue"}
      />
    )}
    {bounds.frame?.left && (
      <rect
        x={0}
        y={bounds.frame?.top ?? 0}
        width={bounds.frame.left}
        height={
          bounds.height -
          ((bounds.frame?.top ?? 0) + (bounds.frame?.bottom ?? 0))
        }
        fill={"green"}
      />
    )}
    {bounds.frame?.right && (
      <rect
        x={(bounds.frame?.left ?? 0) + (bounds.mapBody?.width ?? 0)}
        y={bounds.frame?.top ?? 0}
        width={bounds.frame.right}
        height={
          bounds.height -
          ((bounds.frame?.top ?? 0) + (bounds.frame?.bottom ?? 0))
        }
        fill={"yellow"}
      />
    )}
    <rect
      x={bounds.frame?.left}
      y={bounds.frame?.top}
      width={bounds.mapBody?.width}
      height={bounds.mapBody?.height}
      fill={"pink"}
    />
  </g>
);

export default LayoutDebug;
