import styles from "../styles/summarytable.module.scss";
import { FC, useEffect, useRef } from "react";
import * as d3 from "d3";
import { colorMap } from "../lib/summarytable/colorMap";
import Heading, { Headings } from "./heading";
import type { Description } from "../types/DataFrame";
import { fFloat } from "../lib/utilities/formaters";

type SummaryTableCardProps = {
  description: Description;
};

const SummaryTableCard: FC<SummaryTableCardProps> = ({ description }) => {
  const ref = useRef<SVGSVGElement>(null);

  const dimension = {
    margin: {
      top: 15,
      left: 15,
    },
  };

  useEffect(() => {
    const svgElement = d3.select(ref.current);

    const miniTable = svgElement
      .append("g")
      .attr(
        "transform",
        `translate(${dimension.margin.left},${dimension.margin.top})`
      );

    const fontsize = 9;

    svgElement
      .append("text")
      .attr("x", 0)
      .attr("y", dimension.margin.top + fontsize / 2)
      .attr(
        "transform",
        `rotate(90,${fontsize / 2},${dimension.margin.top + fontsize / 2})`
      )
      .attr("font-size", fontsize)
      .text(fFloat(description.nRows) + " ⭢");

    svgElement
      .append("text")
      .attr("x", dimension.margin.left)
      .attr("y", fontsize)
      .attr("font-size", fontsize)
      .text(fFloat(description.nColumns) + " ⭢");

    const theader = miniTable
      .append("g")
      .attr("id", "header")
      .selectAll("rect")
      .data(description.columns);

    const tbody = miniTable
      .append("g")
      .attr("id", "body")
      .selectAll("rect")
      .data(description.columns);

    theader
      .enter()
      .append("rect")
      .attr("x", (d, i) => i * 2 + i * 1)
      .attr("fill", (d) => colorMap.get(d.type)?.baseColor ?? "grey")
      .attr("width", 2)
      .attr("height", 50);
  });

  return (
    <div className={styles.summaryTableCard}>
      <Heading Tag={Headings.H3} className={Headings.H4}>
        Overview
      </Heading>
      <svg ref={ref} />
    </div>
  );
};

export default SummaryTableCard;
