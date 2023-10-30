import { FC, PropsWithChildren } from "react";

const Footer: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="border-t border-gray-100 p-3 text-xs dark:border-itc-green-800">
      {children}
    </div>
  );
};

export default Footer;
