import styles from "../styles/summarytable.module.scss";
import {
  MdCalendarToday,
  MdFormatListBulleted,
  MdOutlineCalculate,
  MdClose,
} from "react-icons/md";
import { BiBracket } from "react-icons/bi";
import getColumns, {
  DataType,
  colorMap,
  pctFormat,
  floatFormat,
} from "../lib/summarytable";
import { nanoid } from "nanoid";
import SummaryTableCard from "./summaryTableCard";
import Snapshot from "./snapshot";

function getIcon(type: DataType) {
  switch (type) {
    case "ordinal":
      return <MdFormatListBulleted />;

    case "date":
      return <MdCalendarToday />;
    case "array":
      return <BiBracket />;
    default:
      return <MdOutlineCalculate />;
  }
}

export default function SummaryTable({ data }) {
  const columns = getColumns(data);

  return (
    <div className={styles.summaryTableContainer}>
      <SummaryTableCard data={columns} />
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
            {columns.columnsData.map((d) => (
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
                <td>
                  <Snapshot data={data.map((x) => x[d.label])} />
                </td>
                <td className={d.stats?.missing > 0.5 ? styles.alert : null}>
                  {pctFormat(d.stats?.missing)}
                </td>
                <td>
                  {floatFormat(d.stats?.mean) || <MdClose color="lightgrey" />}
                </td>
                <td>
                  {floatFormat(d.stats?.median) || (
                    <MdClose color="lightgrey" />
                  )}
                </td>
                <td>
                  {floatFormat(d.stats?.sd) || <MdClose color="lightgrey" />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
