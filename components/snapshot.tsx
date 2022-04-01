import { colorMap, getType } from "../lib/summarytable";

//TODO: use columns again, to get name as well?
// TODO: dont determine type inside component
const Snapshot = ({ data }) => {
  const type = getType(data);

  return (
    <div>
      <span style={{ color: colorMap.get(type).color }}>{type}</span>
    </div>
  );
};

export default Snapshot;
