import { FC, HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

type Props = HTMLAttributes<HTMLDivElement>;

const Skeleton: FC<Props> = ({ className, ...props }) => {
  return (
    <div
      className={twMerge(
        "h-full w-full animate-pulse bg-itc-green-50 dark:bg-itc-green-900",
        className,
      )}
      {...props}
    />
  );
};

export default Skeleton;
