import { presimplify, quantile, simplify } from "topojson-simplify";
import type { Topology, Objects } from "topojson-specification";

/**
 *
 * @param topology Topology (topoJSON) input
 * @param weight min weight for the weighted simplification – see https://github.com/topojson/topojson-simplify#presimplify
 * @returns A simplified topojson as {@link Topology}
 */
const simplifyTopology = (
  topology: Topology<Objects>,
  weight: number
): Topology => {
  const pre = presimplify(topology);
  const minWeight = quantile(pre, weight);
  return simplify(pre, minWeight);
};

export default simplifyTopology;
