import { FC, PropsWithChildren } from "react";

const Body: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="border-b border-gray-100 p-3 text-xs dark:border-itc-green-800">
      {children}
    </div>
  );
};

export default Body;
