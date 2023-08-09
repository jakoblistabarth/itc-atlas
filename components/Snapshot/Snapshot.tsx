import { FC } from "react";
import SnapshotBar from "./SnapshotBar";
import SnapshotHistogram from "./SnapshotHistogram";
import { ColumnDataType } from "../SummaryTable/SummaryTable.helpers";
import * as aq from "arquero";
import {
  getSummaryTableColumn,
  SummaryTableColumn,
} from "../SummaryTable/SummaryTable.helpers";

type Props = {
  column: SummaryTableColumn;
  detailed?: boolean;
};

const Snapshot: FC<Props> = ({ column, detailed }) => {
  function renderSnapshot(type: ColumnDataType) {
    switch (type) {
      case ColumnDataType.Ordinal:
        return <SnapshotBar column={column} />;
      case ColumnDataType.Array:
        const flat = column.data
          .filter((d: []) => d && d.length > 0)
          .map((d: []) => ({
            [column.name]: Array.isArray(d) ? `[${d?.join(", ")}]` : "empty",
          }));
        const newColumn = getSummaryTableColumn(aq.from(flat), column.name);
        newColumn.type = type;
        return <SnapshotBar column={newColumn} />;
      case ColumnDataType.Continuous:
        return <SnapshotHistogram column={column} />;
      case ColumnDataType.Date:
        return <SnapshotHistogram column={column} />;
    }
  }
  return (
    <>
      {renderSnapshot(column.type)}
      {detailed && (
        <small>
          {column.name}, {column.data.length} Rows
        </small>
      )}
    </>
  );
};

export default Snapshot;
