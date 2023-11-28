import { BBox } from "geojson";
import { createContext, useContext } from "react";

type Context = {
  yScale: number;
  zOffset: number;
  side: number;
  ratio: number;
  bBox: BBox;
};

export const BlockDiagramContext = createContext<Context | null>(null);

export const useBlockDiagramContext = () => {
  const context = useContext(BlockDiagramContext);

  if (context == null) {
    throw new Error(
      "BlockDiagram components must be wrapped in <BlockDiagram />",
    );
  }

  return context;
};
