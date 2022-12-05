import { FC, SVGProps } from "react";

type Props = React.PropsWithChildren<
  { fontSize?: number } & Omit<SVGProps<SVGTextElement>, "dy" | "fontSize">
>;

const LegendTitle: FC<Props> = ({ fontSize = 9, children, ...rest }) => {
  return (
    <text
      fontFamily="Fraunces"
      fontWeight={"bold"}
      fontSize={fontSize}
      dy={fontSize}
    >
      {children}
    </text>
  );
};

export default LegendTitle;
