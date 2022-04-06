import { colorMap } from "../lib/summarytable";
import { ColumnType } from "../types/Column";
import { FC } from "react";
import SnapshotOrdinal from "./snapshotOrdinal";
import SnapshotContinuous from "./snapshotContinuous";

type Props = {
  column: any[];
  columnName?: string;
  type: ColumnType;
  detailed?: boolean;
};

const SnapshotWrapper: FC<Props> = ({ column, columnName, type, detailed }) => {
  const color = colorMap.get(type);
  function renderSnapshot(type: ColumnType) {
    switch (type) {
      case ColumnType.Ordinal:
        return <SnapshotOrdinal column={column} />;
      case ColumnType.Contiuous:
        return <SnapshotContinuous column={column} />;
    }
  }
  return !type || !color ? (
    <div>Snapshot creation failed!</div>
  ) : (
    <>
      {renderSnapshot(type)}
      {detailed && (
        <small>
          {columnName}, {column.length} Elements
        </small>
      )}
    </>
  );
};

export default SnapshotWrapper;
