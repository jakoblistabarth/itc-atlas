import { ComponentType, FC, PropsWithChildren } from "react";
import { MdOutlineLightbulb } from "react-icons/md";

type Props = PropsWithChildren<{
  title?: string;
  Icon?: ComponentType;
}>;

const Callout: FC<Props> = ({ Icon = MdOutlineLightbulb, title, children }) => (
  <div className="my-2 max-w-2xl rounded-md bg-itc-green-50 p-3 dark:bg-itc-green-900 dark:text-itc-green-500">
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
