import { geoNaturalEarth2 } from "d3-geo-projection";
import { FC, useState } from "react";
import { BlockDiagramArea } from "../../types/BlockdiagramArea";
import { NeCountriesTopoJson } from "../../types/NeTopoJson";
import MapLayoutFluid from "../MapLayout/MapLayoutFluid";
import MapLayerBase from "../MapLayerBase";
import MarkBbox from "../MarkBbox";
import Tooltip from "../Tooltip";
import { HiCheck } from "react-icons/hi2";
import { useRouter } from "next/router";
import { twMerge } from "tailwind-merge";

type Props = {
  neCountriesTopoJson: NeCountriesTopoJson;
  blockDiagramAreas: BlockDiagramArea[];
};

const BlockDiagramAreas: FC<Props> = ({
  neCountriesTopoJson,
  blockDiagramAreas,
}) => {
  const [hovered, setHovered] = useState<BlockDiagramArea | undefined>(
    undefined,
  );
  const proj = geoNaturalEarth2();
  const router = useRouter();
  return (
    <Tooltip.Root followCursor open={!!hovered}>
      <Tooltip.Trigger asChild>
        <div>
          <MapLayoutFluid projection={proj}>
            <MapLayerBase countries={neCountriesTopoJson} />
            {blockDiagramAreas
              .sort((a, b) => {
                const extentA =
                  Math.abs(a.bbox[2] - a.bbox[0]) *
                  Math.abs(a.bbox[3] - a.bbox[1]);
                const extentB =
                  Math.abs(b.bbox[2] - b.bbox[0]) *
                  Math.abs(b.bbox[3] - b.bbox[1]);
                return extentB - extentA;
              })
              .map((d) => {
                const downloaded = d.download === true;
                return (
                  <MarkBbox
                    key={d.name}
                    bounds={d.bbox}
                    stroke={downloaded ? "black" : "grey"}
                    fill={downloaded ? "black" : "lightgrey"}
                    fillOpacity={0.2}
                    strokeDasharray={downloaded ? "" : "1 2"}
                    onMouseEnter={() => setHovered(d)}
                    onMouseLeave={() => setHovered(undefined)}
                    className={twMerge(downloaded && "cursor-pointer")}
                    onClick={() =>
                      downloaded &&
                      router.push(router.pathname.replace(/\[name\]/, d.name))
                    }
                  />
                );
              })}
          </MapLayoutFluid>
        </div>
      </Tooltip.Trigger>
      <Tooltip.Content>
        <h3 className="text-lg">{hovered?.name}</h3>
        Bounding Box: <pre>{hovered?.bbox.join(", ")}</pre>
        {hovered?.download && (
          <span className="mt-3 flex items-center gap-1">
            <HiCheck /> Downloaded
          </span>
        )}
      </Tooltip.Content>
    </Tooltip.Root>
  );
};

export default BlockDiagramAreas;
