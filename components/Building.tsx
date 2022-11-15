import type { FC } from "react";
import { Vector2 } from "three";
import Delft1 from "/public/images/building-kanaalweg.svg";
import Delft2 from "/public/images/building-kanaalweg4.svg";
import Enschede1 from "/public/images/building-boulevard1945.svg";
import Enschede2 from "/public/images/building-hengelosestraat.svg";
import Enschede3 from "/public/images/building-langezijds.svg";
import { number } from "prop-types";

export enum ITCLocationName {
  DELFT1 = "Kanaalweg",
  DELFT2 = "Kanaalweg 14",
  ENSCHEDE1 = "Boulevard 1945",
  ENSCHEDE2 = "Hengelosestraat 99",
  ENSCHEDE3 = "Langezidjs",
}

type Location = {
  name: ITCLocationName;
  moveInDate: string;
  city: string;
};

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
};

const Building: FC<Props> = ({
  location,
  width,
  position = new Vector2(0, 0),
  color = "black",
  shadow = true,
}) => {
  return (
    <g transform={`translate(${position.x - width / 2} ${position.y})`}>
      <svg width={width} height={width / 2}>
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
