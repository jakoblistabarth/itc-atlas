import Link from "next/link";
import { FC } from "react";
import { fDateMonthYear } from "../../lib/utilities/formaters";
import BackToHome from "../BackToHome";
import ItcLogo from "/public/images/itc-logo.svg";
import * as Separator from "@radix-ui/react-separator";
import { RxExternalLink } from "react-icons/rx";

const Footer: FC = () => {
  return (
    <footer className="my-10 mb-20 mt-36 flex flex-col flex-wrap items-center justify-center gap-y-2 text-center">
      <div className="flex h-full items-stretch gap-5">
        <Link href={"/privacy"}>Privacy</Link>
        <Separator.Root
          orientation="vertical"
          decorative={true}
          className="w-px bg-black"
        />
        <a
          className="flex items-center gap-2"
          href={"https://www.utwente.nl/en/about-our-website/disclaimer/"}
        >
          Legal notice
          <RxExternalLink />
        </a>
        <Separator.Root
          orientation="vertical"
          decorative={true}
          className="w-px bg-black"
        />
        <BackToHome />
      </div>
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
