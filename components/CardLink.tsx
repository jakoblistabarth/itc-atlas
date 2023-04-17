/** @jsxImportSource theme-ui */

import NextLink from "next/link";
import React, { FC } from "react";
import { MdArrowForward } from "react-icons/md";
import { Card, Link, Text } from "theme-ui";

type Props = React.PropsWithChildren<{
  href: string;
  buttonText?: string;
}>;

const CardLink: FC<Props> = ({ href, buttonText = "more", children }) => {
  return (
    <NextLink href={href} passHref legacyBehavior>
      <Link>
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
            <Text variant="muted">
              {buttonText}{" "}
              <MdArrowForward
                className="icon"
                sx={{ opacity: 0, transition: "opacity .5s" }}
              />
            </Text>
          </div>
        </Card>
      </Link>
    </NextLink>
  );
};

export default CardLink;
