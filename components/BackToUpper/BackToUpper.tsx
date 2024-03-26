import Link from "next/link";
import { FC } from "react";
import { HiOutlineArrowSmUp } from "react-icons/hi";
import { useRouter } from "next/router";

const BackToUpper: FC = () => {
  const path = useRouter().pathname;
  let upperPath = "/";
  path
    .split("/")
    .filter((d) => d != "" && d.indexOf("[") == -1)
    .map((d, idx, arr) => {
      arr.length - 1 == idx
        ? upperPath
        : idx % 2 != 0
        ? (upperPath = upperPath + "/" + d)
        : (upperPath = upperPath + "" + d);
    });
  return (
    <Link href={upperPath} className="flex items-center gap-x-2">
      one level up
      <HiOutlineArrowSmUp />
    </Link>
  );
};

export default BackToUpper;
