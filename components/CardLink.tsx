/** @jsxImportSource theme-ui */

import Link from "next/link";
import React, { FC } from "react";
import { MdArrowForward } from "react-icons/md";
import { Card, Text } from "theme-ui";

type Props = React.PropsWithChildren<{
  href: string;
  buttonText?: string;
}>;

const CardLink: FC<Props> = ({ href, buttonText = "more", children }) => {
  return (
    <Link href={href} sx={{ variant: "styles.a" }}>
      <Card
        sx={{
          "&:hover": {
            transform: "scale(1.025)",
            ".icon": {
              opacity: 1,
            },
          },
        }}
      >
        {children}
        <div sx={{ mt: 2 }}>
          <Text>
            {buttonText}{" "}
            <MdArrowForward
              className="icon"
              sx={{ opacity: 0, transition: "opacity .5s" }}
            />
          </Text>
        </div>
      </Card>
    </Link>
  );
};

export default CardLink;
