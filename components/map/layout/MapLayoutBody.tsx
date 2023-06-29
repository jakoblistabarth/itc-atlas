import { FC, SVGProps, useId } from "react";
import { Bounds } from "../../../types/MapOptions";

type Props = React.PropsWithChildren<
  {
    bounds: Bounds;
  } & SVGProps<SVGGElement>
>;

const MapLayoutBody: FC<Props> = ({ bounds, children, ...rest }) => {
  const id = useId();
  return (
    <g
      id={`map-body-${id}`}
      className="map-body"
      transform={`translate(${bounds.frame?.left ?? 0}, ${
        bounds.frame?.top ?? 0
      })`}
      {...rest}
    >
      {children}
    </g>
  );
};

export default MapLayoutBody;
