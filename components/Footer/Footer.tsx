import { FC, PropsWithChildren } from "react";
import { fDateMonthYear } from "../../lib/utilities/formaters";
import BackToHome from "../BackToHome";
import ItcLogo from "/public/images/itc-logo.svg";

type Props = PropsWithChildren;

const Footer: FC<Props> = ({ children }) => {
  return (
    <footer className="my-10 mb-20 mt-36 flex flex-col flex-wrap items-center justify-center gap-y-2 text-center">
      {children}
      <BackToHome />
      <ItcLogo className="mb-4 mt-7 w-40 data-[color=primary]:[&_g]:fill-itc-green data-[color=secondary]:[&_g]:fill-itc-blue dark:[&_g]:fill-current" />
      <div className="max-w-xs text-xs">
        University of Twente&apos;s Faculty of Geo-Information Science and Earth
        Observation
      </div>
      <div className="mt-10">{fDateMonthYear(new Date())}</div>
    </footer>
  );
};

export default Footer;
