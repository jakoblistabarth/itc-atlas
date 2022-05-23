import { FC } from "react";

type Props = React.PropsWithChildren<{}>;

const LegendTitle: FC<Props> = ({ children }) => {
  return (
    <text dy={"1em"} fontWeight={"bold"}>
      {children}
    </text>
  );
};

export default LegendTitle;
