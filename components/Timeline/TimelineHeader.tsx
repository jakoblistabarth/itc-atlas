import { FC, PropsWithChildren, SVGProps } from "react";

const TimelineHeader: FC<PropsWithChildren<SVGProps<SVGTextElement>>> = ({
  children,
  ...rest
}) => {
  return (
    <text fontFamily={rest.fontFamily ?? "Fraunces Variable"} {...rest}>
      {children}
    </text>
  );
};

export default TimelineHeader;
