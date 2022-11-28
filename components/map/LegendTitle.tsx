import { FC } from "react";

type Props = React.PropsWithChildren<{}>;

const LegendTitle: FC<Props> = ({ children }) => {
  return (
    <text dominantBaseline={"hanging"} fontWeight={"bold"}>
      {children}
    </text>
  );
};

export default LegendTitle;
