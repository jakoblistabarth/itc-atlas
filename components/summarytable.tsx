import styles from "./summarytable.module.scss";
import {
  MdCalendarToday,
  MdListAlt,
  MdOutlineCalculate,
  MdClose,
} from "react-icons/md";
import { BiBracket } from "react-icons/bi";
import getColumns, { DataType, colorMap } from "../lib/summarytable";
import { nanoid } from "nanoid";

function getIcon(type: DataType) {
  switch (type) {
    case "ordinal":
      return <MdListAlt />;

    case "date":
      return <MdCalendarToday />;
    case "array":
      return <BiBracket />;
    default:
      return <MdOutlineCalculate />;
  }
}

const dateTimeReviver = function (key, value) {
  if (typeof value === "string") {
    const a = Date.parse(value);
    if (a) {
      return new Date(a);
    }
  }
  return value;
};

export default function SummaryTable({ data }) {
  //QUESTION: needs to be called data? how to come up with more clever variable names
  const mydata = JSON.parse(data, dateTimeReviver);
  const columns = getColumns(mydata);

  return (
    <div className={styles.summaryTable}>
      <table>
        <thead>
          <tr>
            <th></th>
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
            <tr key={nanoid()}>
              <td
                className={styles.icon}
                style={{ borderColor: colorMap.get(d.type).color }}
              >
                {getIcon(d.type)}
              </td>
              <td className={styles.label}>
                <div className={styles.scrollable}>{d.label}</div>
              </td>
              <td>{d.type}</td>
              <td>{d.stats?.missing}</td>
              <td>{d.stats?.mean || <MdClose color="lightgrey" />}</td>
              <td>{d.stats?.median || <MdClose color="lightgrey" />}</td>
              <td>{d.stats?.sd || <MdClose color="lightgrey" />}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
