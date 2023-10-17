import { FC, PropsWithChildren } from "react";
import { fDateMonthYear } from "../../lib/utilities/formaters";
import BackToHome from "../BackToHome";

type Props = PropsWithChildren;

const Footer: FC<Props> = ({ children }) => {
  return (
    <footer className="flex flex-col flex-wrap items-center justify-center gap-y-2 py-5">
      {children}
      <div>
        <BackToHome />
        <div>{fDateMonthYear(new Date())}</div>
      </div>
    </footer>
  );
};

export default Footer;
