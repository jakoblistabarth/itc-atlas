import { group, range } from "d3";
import isNumber from "../../lib/utilities/isNumber";
import { PhdTheses } from "../../lib/data/queries/phd/getPhdTheses";

export const getSpiralPoints = (
  n: number,
  radius: number,
  thetaMax: number = Math.PI * 2,
) => {
  const deltaTheta = thetaMax / (n - 1);
  return range(n).map((i) => {
    const r = Math.max(0.1, radius * Math.sqrt(i / (n - 1)));
    const theta = i * deltaTheta;
    const x = r * Math.cos(theta);
    const y = r * Math.sin(theta);
    return { x, y, theta };
  });
};

export const groupThesesByYear = (phdTheses: PhdTheses) =>
  group(
    phdTheses.filter((d) => isNumber(d.promotionYear)),
    (d) => d.promotionYear as number,
  );
