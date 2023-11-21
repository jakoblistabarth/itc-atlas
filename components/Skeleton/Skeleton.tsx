import { FC } from "react";

const Skeleton: FC = () => {
  return (
    <div className="h-full w-full animate-pulse bg-itc-green-50 dark:bg-itc-green-900" />
  );
};

export default Skeleton;
