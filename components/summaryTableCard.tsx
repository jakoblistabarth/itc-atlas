import styles from "../styles/summarytable.module.scss";
import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { colorMap } from "../lib/summarytable";
import Heading from "./heading";

export default function SummaryTableCard({ data }) {
  const ref = useRef();

  useEffect(() => {
    const svgElement = d3.select(ref.current);

    const theader = svgElement
      .append("g")
      .attr("id", "header")
      .selectAll("rect")
      .data(data.columnsData);

    const tbody = svgElement
      .append("g")
      .attr("id", "body")
      .selectAll("rect")
      .data(data.columnsData);

    theader
      .enter()
      .append("rect")
      .attr("x", (d, i) => i * 2 + i * 1)
      .attr("fill", (d) => colorMap.get(d.type)?.color)
      .attr("width", 2)
      .attr("height", 100);
  });

  //QUESTION: how to use h6 style for h3 from globals scss
  return (
    <div className={styles.summaryTableCard}>
      {/* <Heading>Overview</Heading> */}
      <h3>Overview</h3>
      <svg ref={ref} />
    </div>
  );
}
