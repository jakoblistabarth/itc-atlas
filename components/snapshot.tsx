import { colorMap } from "../lib/summarytable";
import { ColumnType } from "../types/Column";
import { FC } from "react";

type SnapshotProps = {
  column: any[];
  columnName?: string;
  type: ColumnType;
  detailed?: boolean;
};

const Snapshot: FC<SnapshotProps> = ({
  column,
  columnName,
  type,
  detailed,
}) => {
  const color = colorMap.get(type);
  return !type || !color ? (
    <div>Snapshot creation failed!</div>
  ) : (
    <>
      <div style={{ color: color.baseColor }}>{type}</div>
      {detailed && (
        <small>
          {columnName}, {column.length} Elements
        </small>
      )}
    </>
  );
};

export default Snapshot;
