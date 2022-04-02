import { colorMap } from "../lib/summarytable";
import { ColumnType } from "../types/Column";
import PropTypes from "prop-types";
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

Snapshot.propTypes = {
  column: PropTypes.array.isRequired,
  columnName: PropTypes.string,
  type: PropTypes.oneOf<ColumnType>([
    ColumnType.Array,
    ColumnType.Contiuous,
    ColumnType.Date,
    ColumnType.Object,
    ColumnType.Ordinal,
  ]).isRequired, //TODO: use type ColumnType
  detailed: PropTypes.bool,
};

Snapshot.defaultProps = {
  detailed: false,
};

export default Snapshot;
