import Link from "next/link";
import { FC } from "react";
import { AiOutlineExperiment } from "react-icons/ai";

const BetaBadge: FC = () => (
  <div className="rounded-lg bg-itc-blue p-2">
    <Link
      className="flex items-center gap-x-1 text-white no-underline"
      href={"/beta"}
    >
      <AiOutlineExperiment /> Beta
    </Link>
  </div>
);

export default BetaBadge;
