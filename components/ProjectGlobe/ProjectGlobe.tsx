import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import type { GeoJsonProperties } from "geojson";
import { useTheme } from "next-themes";
import { FC, useCallback, useEffect, useState } from "react";
import CanvasStage from "../../components/CanvasStage";
import Globe from "../../components/Globe";
import GlobeEnvironment from "../../components/Globe/GlobeEnvironment";
import KPI from "../../components/KPI";
import Tooltip from "../../components/Tooltip";
import { CountryWithProjectCount } from "../../lib/data/queries/country/getCountryWithProjectCount";
import { NeCountriesTopoJson } from "../../types/NeTopoJson";
import { MemoizedProjectMarkers } from "./ProjectMarker";

type Props = {
  countryWithProjectCount: CountryWithProjectCount;
  neCountriesTopoJson: NeCountriesTopoJson;
};

const ProjectGlobe: FC<Props> = ({
  countryWithProjectCount,
  neCountriesTopoJson,
}) => {
  const [isSSR, setIsSSR] = useState(true);
  const [hoverInfo, setHoverInfo] = useState<GeoJsonProperties | undefined>(
    undefined,
  );
  const onPointerEnterHandler = useCallback((properties: GeoJsonProperties) => {
    setHoverInfo(properties);
  }, []);
  const onPointerLeaveHandler = useCallback(() => setHoverInfo(undefined), []);
  const earthRadius = 1.2;

  useEffect(() => {
    setIsSSR(false);
  }, []);

  const { theme } = useTheme();

  return (
    <CanvasStage className="h-[800px]">
      <Tooltip.Root open={!!hoverInfo} followCursor placement="top-start">
        <Tooltip.Trigger asChild>
          <Canvas camera={{ position: [0, 0, 5], fov: 30 }} shadows>
            {isSSR ? (
              <></>
            ) : (
              <Globe
                radius={earthRadius}
                texture={theme === "dark" ? "night" : "explorer"}
              >
                <MemoizedProjectMarkers
                  countryWithProjectCount={countryWithProjectCount}
                  neCountriesTopoJson={neCountriesTopoJson}
                  onPointerEnterHandler={onPointerEnterHandler}
                  onPointerLeaveHandler={onPointerLeaveHandler}
                  earthRadius={earthRadius}
                />
              </Globe>
            )}
            <GlobeEnvironment />
            <OrbitControls enableZoom={false} enablePan={false} />
          </Canvas>
        </Tooltip.Trigger>
        <Tooltip.Content>
          {hoverInfo && (
            <div>
              <KPI number={hoverInfo.projectCount} unit={"projects"} />
              {hoverInfo.NAME_EN}
            </div>
          )}
        </Tooltip.Content>
      </Tooltip.Root>
    </CanvasStage>
  );
};

export default ProjectGlobe;
