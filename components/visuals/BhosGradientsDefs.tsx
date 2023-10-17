import { ScaleOrdinal } from "d3";
import { FC, Fragment } from "react";

type Props = {
  categoryCombinations: string[][];
  getCategoryKey: (categories: string[]) => string;
  colorScale: ScaleOrdinal<string, string>;
};

const BhosGradientDefs: FC<Props> = ({
  categoryCombinations,
  getCategoryKey,
  colorScale,
}) => (
  <defs>
    {categoryCombinations.map((d) => {
      const key = getCategoryKey(d);
      return (
        <linearGradient
          id={key}
          key={key}
          gradientUnits="userSpaceOnUse"
          x2={d.length * 2}
          spreadMethod="repeat"
          gradientTransform="rotate(-45)"
        >
          {d.map((category, i) => (
            <Fragment key={`${key}-${category}`}>
              <stop
                offset={(1 / d.length) * i}
                stopColor={colorScale(category)}
              />
              <stop
                offset={(1 / d.length) * (i + 1)}
                stopColor={colorScale(category)}
              />
            </Fragment>
          ))}
        </linearGradient>
      );
    })}
  </defs>
);

export default BhosGradientDefs;
