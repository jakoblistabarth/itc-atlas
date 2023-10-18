import Link from "next/link";
import { FC } from "react";
import { AiOutlineExperiment } from "react-icons/ai";

const BetaBadge: FC = () => (
  <div className="rounded-lg bg-itc-blue p-2 transition-colors duration-300 hover:bg-itc-blue-800 dark:bg-itc-blue-200 dark:hover:bg-itc-blue-300">
    <Link
      className="flex items-center text-white no-underline dark:text-itc-blue"
      href={"/beta"}
    >
      <AiOutlineExperiment className="mr-2" />{" "}
      <span className="text-xs">Beta</span>
    </Link>
  </div>
);

export default BetaBadge;
