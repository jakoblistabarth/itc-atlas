import { scaleLinear } from "d3";
import useSWRImmutable from "swr/immutable";
import getElevation from "../../lib/data/getElevation";
import { useBlockDiagramContext } from "./BlockDiagramContext";

const usePosition = (longitude: number, latitude: number) => {
  const { side, yScale, zOffset, ratio, bBox } = useBlockDiagramContext();

  const widthRange = [-side / 2, side / 2];
  const heightRange = [(-side * (1 / ratio)) / 2, (side * (1 / ratio)) / 2];
  const scaleLng = scaleLinear().domain([bBox[1], bBox[3]]).range(widthRange);
  const scaleLat = scaleLinear().domain([bBox[2], bBox[0]]).range(heightRange);

  //TODO: add error handling (use error from useSWR)
  const { data: elevation } = useSWRImmutable<
    Awaited<ReturnType<typeof getElevation>>
  >(`/api/data/elevation?latitude=${latitude}&longitude=${longitude}`);
  const z =
    elevation && typeof elevation === "number"
      ? elevation * yScale + zOffset
      : Infinity; // TODO: animate in when ready?

  return { x: scaleLng(longitude), y: z, z: scaleLat(latitude) };
};

export default usePosition;
