import { colorMap } from "../lib/summarytable/colorMap";
import { ColumnType } from "../types/Column";
import { FC } from "react";
import SnapshotBar from "./snapshotBar";
import SnapshotHistogram from "./snapshotHistogram";
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
          .map((d) => d?.join(", "));
        return <SnapshotBar type={type} column={flattenedArray} />;
      case ColumnType.Contiuous:
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
