/** @jsxImportSource theme-ui */

import NextLink from "next/link";
import { Link } from "theme-ui";
import React, { FC } from "react";
import { MdArrowBack } from "react-icons/md";

const BackToHome: FC = () => {
  return (
    <NextLink href="/" passHref legacyBehavior>
      <Link>
        <MdArrowBack /> Back to home
      </Link>
    </NextLink>
  );
};

export default BackToHome;
