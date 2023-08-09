/** @jsxImportSource theme-ui */

import Link from "next/link";
import { FC } from "react";
import { MdArrowBack } from "react-icons/md";

const BackToHome: FC = () => {
  return (
    <Link href="/" sx={{ variant: "styles.a" }}>
      <MdArrowBack /> Back to home
    </Link>
  );
};

export default BackToHome;
