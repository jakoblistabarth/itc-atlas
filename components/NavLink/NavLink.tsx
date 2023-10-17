import { FC } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import clsx from "clsx";

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
      className={clsx(
        "rounded-md bg-white p-2 text-itc-green transition-colors duration-500",
        !disabled && "pointer opacity-100 hover:bg-itc-green-100",
        disabled && "cursor-not-allowed opacity-50",
        isActive ? "font-bold" : "font-normal",
      )}
    >
      {children}
    </Link>
  );
};

export default NavLink;
