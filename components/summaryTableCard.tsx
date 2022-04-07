import styles from "../styles/summarytable.module.scss";
import { FC, useEffect, useRef } from "react";
import * as d3 from "d3";
import { colorMap } from "../lib/summarytable";
import Heading, { Headings } from "./heading";
import { TableDescription } from "../types/Table";
import { floatFormat } from "../lib/formaters";

type SummaryTableCardProps = {
  tableDescription: TableDescription;
};

const SummaryTableCard: FC<SummaryTableCardProps> = ({ tableDescription }) => {
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
      .text(floatFormat(tableDescription.nRows) + " ⭢");

    svgElement
      .append("text")
      .attr("x", dimension.margin.left)
      .attr("y", fontsize)
      .attr("font-size", fontsize)
      .text(floatFormat(tableDescription.nColumns) + " ⭢");

    const theader = miniTable
      .append("g")
      .attr("id", "header")
      .selectAll("rect")
      .data(tableDescription.columns);

    const tbody = miniTable
      .append("g")
      .attr("id", "body")
      .selectAll("rect")
      .data(tableDescription.columns);

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
