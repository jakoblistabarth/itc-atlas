import { FC, PropsWithChildren, SVGProps } from "react";
import { useMapLayoutContext } from "../MapLayout/MapLayoutContext";

type Props = {
  /** Longitude where the marker should be placed, in decimal degrees. */
  longitude: number;
  /** Latitude where the marker should be placed, in decimal degrees. */
  latitude: number;
} & SVGProps<SVGGElement>;

/**
 * A wrapper component for positioning arbitrary `svg` nodes on a map.
 * @returns An svg group element, containing the marker's content.
 */
const Mark: FC<PropsWithChildren<Props>> = ({
  longitude,
  latitude,
  children,
  ...rest
}) => {
  const { projection } = useMapLayoutContext();
  const [x, y] = projection([longitude, latitude]) ?? [undefined];
  return (
    <g {...rest} transform={`translate(${x} ${y})`}>
      {children}
    </g>
  );
};

export default Mark;
