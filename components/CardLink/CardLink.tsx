import clsx from "clsx";
import Link from "next/link";
import React, { FC } from "react";
import { MdArrowForward } from "react-icons/md";

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
      className={clsx(disabled && "cursor-not-allowed opacity-50")}
    >
      <div
        className={clsx(
          "rounded-sm p-3 shadow",
          !disabled &&
            "group transition-transform duration-500 hover:scale-105",
        )}
      >
        {children}
        <div className="mt-2 flex items-center gap-1">
          {buttonText}
          <MdArrowForward className="icon opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        </div>
      </div>
    </Link>
  );
};

export default CardLink;
