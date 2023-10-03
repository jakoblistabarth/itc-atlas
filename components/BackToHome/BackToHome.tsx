/** @jsxImportSource theme-ui */

import Link from "next/link";
import { FC } from "react";
import { HiOutlineHome } from "react-icons/hi";

const BackToHome: FC = () => {
  return (
    <Link href="/" sx={{ variant: "styles.a" }}>
      <HiOutlineHome /> back home
    </Link>
  );
};

export default BackToHome;
