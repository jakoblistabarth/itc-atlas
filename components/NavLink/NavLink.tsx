import Link from "next/link";
import { useRouter } from "next/router";
import { FC } from "react";
import { twMerge } from "tailwind-merge";

type Props = React.PropsWithChildren<{
  href: string;
  disabled?: boolean;
}>;

const NavLink: FC<Props> = ({ href, children, disabled = false }) => {
  const { pathname } = useRouter();
  const isActive = pathname.startsWith(href);
  return (
    <Link
      href={href}
      onClick={disabled ? (e) => e.preventDefault() : undefined}
      className={twMerge(
        "rounded-md bg-white p-2 text-itc-green transition-colors duration-500 dark:bg-itc-green-700 dark:text-white",
        !disabled &&
          "pointer opacity-100 hover:bg-itc-green-100 hover:dark:bg-itc-green-600",
        disabled && "cursor-not-allowed opacity-50",
        isActive ? "font-bold" : "font-normal",
      )}
    >
      {children}
    </Link>
  );
};

export default NavLink;
