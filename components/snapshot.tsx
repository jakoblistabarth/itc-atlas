import { colorMap, ColumnType } from "../lib/summarytable";

const Snapshot: propTypes = ({
  column,
  columnName,
  type,
  detailed = false,
}) => {
  return (
    <div>
      <div style={{ color: colorMap.get(type).color }}>{type}</div>
      {detailed && (
        <small>
          {columnName}, {column.length} Elements
        </small>
      )}
    </div>
  );
};

// TODO: fix typing
type propTypes = {
  column: [];
  columnName: string;
  type: ColumnType;
  detailed: boolean;
};

export default Snapshot;
