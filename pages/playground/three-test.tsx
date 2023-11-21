import { Box, Environment, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { range } from "d3";
import type { NextPage } from "next";
import { useState } from "react";
import CanvasStage from "../../components/CanvasStage";
import Container from "../../components/Container";
import PageBase from "../../components/PageBase";
import Tooltip from "../../components/Tooltip";
import TooltipContent from "../../components/Tooltip/TooltipContent";
import { TooltipTrigger } from "../../components/Tooltip/TooltipTrigger";

const ThreeTest: NextPage = () => {
  return (
    <PageBase title="Three line rendering test">
      <Container>
        <CanvasWithTooltip />
      </Container>
    </PageBase>
  );
};

export default ThreeTest;

const CanvasWithTooltip = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoverInfo, setHoverInfo] = useState<undefined | string>(undefined);
  return (
    <>
      <Tooltip open={isOpen} followCursor placement="bottom-start">
        <TooltipTrigger asChild>
          <CanvasStage>
            <Canvas
              orthographic
              camera={{ position: [100, 100, 100], zoom: 100, near: 0 }}
            >
              <axesHelper />
              <Environment preset="apartment" />
              {range(1000).map((d) => (
                <Box
                  key={d}
                  onPointerEnter={(e) => {
                    e.stopPropagation();
                    setIsOpen(true);
                    setHoverInfo(`id: ${d}`);
                  }}
                  onPointerOut={() => {
                    setIsOpen(false);
                    setHoverInfo(undefined);
                  }}
                  args={[1, 3, 1]}
                  position={[(d % 50) * 2, 1.5, (d / 50) * 2]}
                >
                  <meshStandardMaterial color={"red"} />
                </Box>
              ))}
              <OrbitControls target={[0, 5, 0]} />
              <Environment preset="apartment" />
            </Canvas>
          </CanvasStage>
        </TooltipTrigger>
        {isOpen && hoverInfo && (
          <TooltipContent>Element: {hoverInfo}</TooltipContent>
        )}
      </Tooltip>
    </>
  );
};
