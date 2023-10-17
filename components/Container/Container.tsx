import { FC, PropsWithChildren } from "react";

type Props = PropsWithChildren;

const Container: FC<Props> = ({ children }) => (
  <div className="container max-w-7xl">{children}</div>
);

export default Container;
