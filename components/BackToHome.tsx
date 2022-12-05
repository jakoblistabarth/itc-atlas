import Link from "next/link";
import React, { FC } from "react";
import { MdArrowBack } from "react-icons/md";

const BackToHome: FC = () => {
  return (
    <Link href="/">
      <span>
        <MdArrowBack /> Back to home
      </span>
    </Link>
  );
};

export default BackToHome;
