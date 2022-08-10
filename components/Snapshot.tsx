import { colorMap } from "../lib/summarytable/colorMap";
import { FC } from "react";
import SnapshotBar from "./SnapshotBar";
import SnapshotHistogram from "./SnapshotHistogram";
import Column, { ColumnType } from "../lib/DataFrame/Column";

type Props = {
  column: Column;
  columnName?: string;
  detailed?: boolean;
};

const Snapshot: FC<Props> = ({ column, columnName, detailed }) => {
  const color = colorMap.get(column.type);
  function renderSnapshot(type: ColumnType) {
    switch (type) {
      case ColumnType.Ordinal:
        return <SnapshotBar column={column} />;
      case ColumnType.Array:
        const flat = column.data
          .filter((d) => d)
          .map((d) => (Array.isArray(d) ? `[${d?.join(", ")}]` : "empty"));
        const newColumn = new Column(flat, column.label);
        newColumn.type = ColumnType.Array;
        return <SnapshotBar column={newColumn} />;
      case ColumnType.Continuous:
        return <SnapshotHistogram column={column} />;
      case ColumnType.Date:
        return <SnapshotHistogram column={column} />;
    }
  }
  return !column.type || !color ? (
    <div>Snapshot creation failed!</div>
  ) : (
    <>
      {renderSnapshot(column.type)}
      {detailed && (
        <small>
          {columnName}, {column.data.length} Rows
        </small>
      )}
    </>
  );
};

export default Snapshot;
