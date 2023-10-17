import { FC, PropsWithChildren } from "react";

type Props = PropsWithChildren;

const SecondaryNavigation: FC<Props> = ({ children }) => (
  <div className="my-10 grid max-w-3xl grid-cols-3 gap-5">{children}</div>
);

export default SecondaryNavigation;
