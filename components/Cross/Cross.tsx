import { FC, SVGProps } from "react";
import { Appearance } from "../../types/Appearance";
import defaultTheme from "../../lib/styles/themes/defaultTheme";

type Props = {
  style?: Appearance;
  length?: number;
  halos?: { size: number; color: string }[];
} & SVGProps<SVGGElement>;

const Cross: FC<Props> = ({ style, length = 5, halos = [], ...rest }) => {
  return (
    <g
      strokeOpacity={style?.strokeOpacity ?? defaultTheme.symbol?.strokeOpacity}
      strokeLinejoin={style?.strokeLineJoin ?? "round"}
      strokeLinecap={"square"}
      {...rest}
    >
      {[
        { size: 1, color: style?.stroke ?? defaultTheme.symbol?.stroke },
        ...halos,
      ]
        .sort((a, b) => b.size - a.size)
        .map((halo) =>
          Array.from({ length: 2 })
            .fill(0)
            .map((_, idx) => (
              <line
                key={idx}
                x1={-length}
                x2={length}
                stroke={halo.color}
                strokeWidth={
                  (style?.strokeWidth ??
                    defaultTheme.symbol?.strokeWidth ??
                    1) * halo.size
                }
                transform={`rotate(${45 + 90 * idx})`}
              />
            ))
        )}
      <line />
    </g>
  );
};

export default Cross;
