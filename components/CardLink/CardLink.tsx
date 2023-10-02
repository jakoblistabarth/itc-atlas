/** @jsxImportSource theme-ui */

import Link from "next/link";
import React, { FC } from "react";
import { MdArrowForward } from "react-icons/md";
import { Card, Text } from "theme-ui";

type Props = React.PropsWithChildren<{
  href: string;
  buttonText?: string;
  disabled?: boolean;
}>;

const CardLink: FC<Props> = ({
  href,
  buttonText = "more",
  disabled = false,
  children,
}) => {
  return (
    <Link
      onClick={disabled ? (e) => e.preventDefault() : undefined}
      href={href}
      sx={{
        variant: "styles.a",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
      }}
    >
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
