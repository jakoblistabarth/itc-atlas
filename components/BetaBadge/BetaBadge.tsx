/** @jsxImportSource theme-ui */

import Link from "next/link";
import { FC } from "react";
import { AiOutlineExperiment } from "react-icons/ai";

const BetaBadge: FC = () => (
  <div sx={{ borderRadius: 2, background: "secondary", p: 2 }}>
    <Link sx={{ color: "white", textDecoration: "none" }} href={"/beta"}>
      <AiOutlineExperiment sx={{ verticalAlign: "middle" }} /> Beta
    </Link>
  </div>
);

export default BetaBadge;
