import getColumnStats from "./getColumnStats";
import getColumnType from "./getColumnType";

const getSummaryTableColumnDescription = (array: []) => {
  const type = getColumnType(array);
  return {
    type,
    stats: getColumnStats(array, type),
  };
};

export default getSummaryTableColumnDescription;
