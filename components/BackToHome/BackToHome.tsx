import Link from "next/link";
import { FC } from "react";
import { HiOutlineHome } from "react-icons/hi";

const BackToHome: FC = () => {
  return (
    <Link href="/" className="flex items-center gap-x-2">
      back home <HiOutlineHome />
    </Link>
  );
};

export default BackToHome;
