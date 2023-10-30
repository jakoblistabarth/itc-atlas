import { FC, PropsWithChildren } from "react";

const Body: FC<PropsWithChildren> = ({ children }) => {
  return <div className="p-3">{children}</div>;
};

export default Body;
