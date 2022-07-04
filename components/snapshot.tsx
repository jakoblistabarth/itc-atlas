import { colorMap } from "../lib/summarytable/colorMap";
import { ColumnType } from "../types/Column";
import { FC } from "react";
import SnapshotBar from "./SnapshotBar";
import SnapshotHistogram from "./SnapshotHistogram";
import type { Column, Datum } from "../types/DataFrame";

type Props = {
  column: Column;
  columnName?: string;
  type: ColumnType;
  detailed?: boolean;
};

const Snapshot: FC<Props> = ({ column, columnName, type, detailed }) => {
  const color = colorMap.get(type);
  function renderSnapshot(type: ColumnType) {
    switch (type) {
      case ColumnType.Ordinal:
        return <SnapshotBar type={type} column={column} />;
      case ColumnType.Array:
        const flattenedArray = column
          .filter((d) => d)
          .map((d) => (Array.isArray(d) ? d?.join(", ") : []));
        // TODO: implement Column as class and add function to update only data array? (keep or updated label, type, stats)
        return <SnapshotBar type={type} column={flattenedArray} />;
      case ColumnType.Continuous:
        return <SnapshotHistogram type={type} column={column} />;
      case ColumnType.Date:
        return <SnapshotHistogram type={type} column={column} />;
    }
  }
  return !type || !color ? (
    <div>Snapshot creation failed!</div>
  ) : (
    <>
      {renderSnapshot(type)}
      {detailed && (
        <small>
          {columnName}, {column.length} Rows
        </small>
      )}
    </>
  );
};

export default Snapshot;
