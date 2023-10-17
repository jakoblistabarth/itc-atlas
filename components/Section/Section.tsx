import { FC, PropsWithChildren } from "react";

type Props = PropsWithChildren;

const Section: FC<Props> = ({ children }) => (
  <div className="my-10">{children}</div>
);

export default Section;
