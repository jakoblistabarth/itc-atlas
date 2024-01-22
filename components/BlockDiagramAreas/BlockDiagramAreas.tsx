import { geoNaturalEarth2 } from "d3-geo-projection";
import { FC, useState } from "react";
import { BlockDiagramArea } from "../../types/BlockdiagramArea";
import { NeCountriesTopoJson } from "../../types/NeTopoJson";
import MapLayoutFluid from "../MapLayout/MapLayoutFluid";
import MapLayerBase from "../MapLayerBase";
import MarkBbox from "../MarkBbox";
import Tooltip from "../Tooltip";

type Props = {
  neCountriesTopoJson: NeCountriesTopoJson;
  blockDiagramAreas: BlockDiagramArea[];
};

const BlockDiagramAreas: FC<Props> = ({
  neCountriesTopoJson,
  blockDiagramAreas,
}) => {
  const [hovered, setHovered] = useState<string | undefined>(undefined);
  const proj = geoNaturalEarth2();
  console.log(hovered, !!hovered);
  return (
    <Tooltip.Root followCursor open={!!hovered}>
      <Tooltip.Trigger asChild>
        <div>
          <MapLayoutFluid projection={proj}>
            <MapLayerBase countries={neCountriesTopoJson} />
            {blockDiagramAreas.map((d) => {
              return (
                <MarkBbox
                  key={d.name}
                  bounds={d.bbox}
                  fill="red"
                  fillOpacity={0.01}
                  onMouseEnter={() => {
                    setHovered(d.name), console.log("hovered");
                  }}
                  onMouseLeave={() => setHovered(undefined)}
                />
              );
            })}
          </MapLayoutFluid>
        </div>
      </Tooltip.Trigger>
      <Tooltip.Content>{hovered}</Tooltip.Content>
    </Tooltip.Root>
  );
};

export default BlockDiagramAreas;
