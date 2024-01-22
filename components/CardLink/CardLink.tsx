import Link from "next/link";
import React, { FC, HTMLAttributes } from "react";
import { MdArrowForward } from "react-icons/md";
import { twMerge } from "tailwind-merge";
import { Card } from "../Card/";

type Props = React.PropsWithChildren<{
  href: string;
  buttonText?: string;
  disabled?: boolean;
}> &
  HTMLAttributes<HTMLAnchorElement>;

const CardLink: FC<Props> = ({
  href,
  buttonText = "more",
  disabled = false,
  className,
  children,
}) => {
  return (
    <Link
      onClick={disabled ? (e) => e.preventDefault() : undefined}
      href={href}
      className={twMerge(
        disabled && "cursor-not-allowed opacity-50",
        className,
      )}
    >
      <Card
        className={twMerge(
          !disabled &&
            "group transition-transform duration-500 hover:scale-105",
        )}
      >
        <Card.Body>{children}</Card.Body>
        <Card.Footer>
          <div className="flex items-center gap-1">
            {buttonText}
            <MdArrowForward className="icon opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          </div>
        </Card.Footer>
      </Card>
    </Link>
  );
};

export default CardLink;
