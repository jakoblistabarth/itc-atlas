import Link from "next/link";
import React, { FC } from "react";
import { MdArrowBack } from "react-icons/md";

const BackToHome: FC = () => {
  return (
    <Link href="/">
      <a>
        <MdArrowBack /> Back to home
      </a>
    </Link>
  );
};

export default BackToHome;
