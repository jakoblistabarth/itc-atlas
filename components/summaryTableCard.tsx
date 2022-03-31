import styles from "../styles/summarytable.module.scss";
import { nanoid } from "nanoid";

export default function SummaryTableCard({ data }) {
  //QUESTION: how to use h6 style for h3 from globals scss
  return (
    <div className={styles.summaryTableCard}>
      <h3>Overview</h3>
      <ul style={{ fontSize: "x-small" }}>
        {data.columnsData.map((d) => (
          <li key={nanoid()}>{d.label}</li>
        ))}
      </ul>
    </div>
  );
}
