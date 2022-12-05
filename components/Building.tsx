import type { FC, SVGProps } from "react";
import { Vector2 } from "three";
import Delft1 from "/public/images/building-kanaalweg.svg";
import Delft2 from "/public/images/building-kanaalweg4.svg";
import Enschede1 from "/public/images/building-boulevard1945.svg";
import Enschede2 from "/public/images/building-hengelosestraat.svg";
import Enschede3 from "/public/images/building-langezijds.svg";

export enum ITCLocationName {
  DELFT1 = "Kanaalweg",
  DELFT2 = "Kanaalweg 14",
  ENSCHEDE1 = "Boulevard 1945",
  ENSCHEDE2 = "Hengelosestraat 99",
  ENSCHEDE3 = "Langezidjs",
}

export const ITClocations = new Map([
  [
    ITCLocationName.DELFT1,
    { city: "Delft", moveInDate: new Date(1950, 0, 1).toISOString() },
  ],
  [
    ITCLocationName.DELFT2,
    {
      city: "Delft",
      moveInDate: new Date(1956, 0, 1).toISOString(),
    },
  ],
  [
    ITCLocationName.ENSCHEDE1,
    {
      city: "Enschede",
      moveInDate: new Date(1971, 0, 1).toISOString(),
    },
  ],
  [
    ITCLocationName.ENSCHEDE2,
    {
      city: "Enschede",
      moveInDate: new Date(1996, 0, 1).toISOString(),
    },
  ],
  [
    ITCLocationName.ENSCHEDE3,
    {
      city: "Enschede",
      moveInDate: new Date(2023, 6, 1).toISOString(),
    },
  ],
]);

type Props = {
  location: ITCLocationName;
  width: number;
  position?: Vector2;
  color?: string;
  shadow?: boolean;
} & Omit<SVGProps<SVGGElement>, "fill" | "stroke">;

const Building: FC<Props> = ({
  position = new Vector2(0, 0),
  location,
  width,
  color = "black",
  shadow = true,
  ...rest
}) => {
  const height = width / 2;
  return (
    <g
      transform={`translate(${position.x - width / 2} ${
        position.y - height / 2
      })`}
      {...rest}
    >
      <svg className="building" width={width} height={height}>
        <style>
          {`
          svg.building g,
          svg.building path[stroke="#000"]  {
                stroke: ${color};
            }
            svg.building svg path[opacity="0.1"],
            svg.building g[opacity="0.1"] {
                fill: ${color};
                display: ${shadow ? "block" : "none"}
            }
            `}
        </style>
        {location == ITCLocationName.DELFT1 && <Delft1 />}
        {location == ITCLocationName.DELFT2 && <Delft2 />}
        {location == ITCLocationName.ENSCHEDE1 && <Enschede1 />}
        {location == ITCLocationName.ENSCHEDE2 && <Enschede2 />}
        {location == ITCLocationName.ENSCHEDE3 && <Enschede3 />}
      </svg>
    </g>
  );
};

export default Building;
