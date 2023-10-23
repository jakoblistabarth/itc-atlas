import { FC, PropsWithChildren } from "react";

const canvasStage: FC<PropsWithChildren> = ({ children }) => (
  <div className="my-5 h-[500px] rounded-md bg-white shadow-md dark:bg-itc-green-950">
    {children}
  </div>
);

export default canvasStage;
