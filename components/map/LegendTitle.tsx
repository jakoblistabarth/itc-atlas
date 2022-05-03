import { FC } from "react";

type Props = React.PropsWithChildren<{}>;

const LegendTitle: FC<Props> = ({ children }) => {
  return (
    <text y={20} fontFamily="Fraunces" fontWeight={"bold"}>
      {children}
    </text>
  );
};

export default LegendTitle;
