import Link from "next/link";
import { FC } from "react";
import { HiOutlineHome } from "react-icons/hi";

const BackToHome: FC = () => {
  return (
    <Link href="/" className="flex gap-x-2 items-center">
      <HiOutlineHome /> back home
    </Link>
  );
};

export default BackToHome;
