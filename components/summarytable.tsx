import getColumns from "../lib/summarytable";
import styles from "./summarytable.module.css";

export default function SummaryTable({ data }) {
  //QUESTION: needs to be called data? how to come up with more clever variable names
  const mydata = eval(data);
  const columns = getColumns(mydata);
  return (
    <div className={styles.summaryTable}>
      <table>
        <thead>
          <tr>
            <th>Column</th>
            <th>Snapshot</th>
            <th>Missing</th>
            <th>Mean</th>
            <th>Median</th>
            <th>SD</th>
          </tr>
        </thead>
        <tbody>
          {columns.col_data.map((d) => (
            <tr>
              <td>{d.label}</td>
              <td>{d.type}</td>
              <td>{d.stats?.missing}</td>
              <td>{d.stats?.mean}</td>
              <td>{d.stats?.median}</td>
              <td>{d.stats?.sd}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
