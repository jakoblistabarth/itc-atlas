import { ComponentType, FC, HTMLAttributes, PropsWithChildren } from "react";
import { MdOutlineLightbulb } from "react-icons/md";
import { twMerge } from "tailwind-merge";

type Props = HTMLAttributes<HTMLDivElement> &
  PropsWithChildren<{
    title?: string;
    Icon?: ComponentType;
  }>;

const Callout: FC<Props> = ({
  Icon = MdOutlineLightbulb,
  title,
  children,
  className,
  ...props
}) => (
  <div
    className={twMerge(
      "my-2 max-w-2xl rounded-md bg-itc-green-50 p-3 dark:bg-itc-green-900 dark:text-itc-green-500 [&_details]:text-xs",
      className,
    )}
    {...props}
  >
    <div className="grid grid-cols-[min-content_auto] gap-x-2">
      <Icon className="mt-1" />
      <div>
        {title && <h4>{title}</h4>}
        {children}
      </div>
    </div>
  </div>
);

export default Callout;
