import type { NextPage } from "next";
import { Canvas } from "@react-three/fiber";
import { Box, Environment, OrbitControls } from "@react-three/drei";
import PageBase from "../../components/PageBase";
import CanvasStage from "../../components/CanvasStage";
import Container from "../../components/Container";
import { useState } from "react";
import {
  flip,
  offset,
  useClientPoint,
  useFloating,
  useInteractions,
} from "@floating-ui/react";
import { range } from "d3";

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

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: "bottom-start",
    middleware: [offset(10), flip()],
  });

  const clientPoint = useClientPoint(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([
    clientPoint,
  ]);
  return (
    <>
      <div ref={refs.setReference} {...getReferenceProps()}>
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
          </Canvas>
        </CanvasStage>
      </div>
      {isOpen && hoverInfo && (
        <div
          ref={refs.setFloating}
          style={floatingStyles}
          className="pointer-events-none rounded-md bg-white p-3 shadow-lg"
          {...getFloatingProps()}
        >
          Element: {hoverInfo}
        </div>
      )}
    </>
  );
};
