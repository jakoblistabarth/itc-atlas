import clsx from "clsx";
import { FC, PropsWithChildren } from "react";

type Props = PropsWithChildren<{ height?: number }>;

const canvasStage: FC<Props> = ({ children, height }) => (
  <div
    style={{ height: height }}
    className={clsx(
      "my-5 rounded-md bg-white shadow-md",
      !height && "h-[500px]",
    )}
  >
    {children}
  </div>
);

export default canvasStage;
