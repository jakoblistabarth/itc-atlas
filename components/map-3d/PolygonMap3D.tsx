import React from "react";
import { FC, useMemo } from "react";
import Polygon3D from "../map-3d/Polygon3D";
import { SVGLoader } from "three-stdlib";
import { Color } from "three";

const PolygonMap3D: FC<{
  svg: string;
  color: string;
}> = ({ svg, color }) => {
  const loader = new SVGLoader();
  const svgData = loader.parse(svg);
  const { paths } = svgData;
  const shapes = useMemo(
    () =>
      paths.flatMap((p) =>
        p.toShapes(true).map((shape) => ({
          shape,
          color: new Color(color),
          fillOpacity: p.userData?.style.fillOpacity,
        }))
      ),
    [paths]
  );

  return (
    <group rotation={[Math.PI / 2, 0, 0]}>
      {/* <group rotation={[Math.PI, 0, 0]} ref={ref}> */}
      {shapes.map((props) => (
        <Polygon3D key={props.shape.uuid} {...props} />
      ))}
    </group>
  );
};

export default PolygonMap3D;
