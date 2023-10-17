import { FC, PropsWithChildren } from "react";

const canvasStage: FC<PropsWithChildren> = ({ children }) => (
  <div className="my-5 h-[500px] rounded-md bg-white shadow-md">{children}</div>
);

export default canvasStage;
