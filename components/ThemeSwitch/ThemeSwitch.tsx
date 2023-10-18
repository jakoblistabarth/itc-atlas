import React from "react";
import { useTheme } from "next-themes";
import { MdOutlineDarkMode, MdOutlineLightMode } from "react-icons/md";

const ThemeSwitch = () => {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => (theme == "dark" ? setTheme("light") : setTheme("dark"))}
      className="transition-color flex items-center rounded-lg bg-itc-green-50 p-2 text-itc-green duration-300 hover:bg-itc-green-100 dark:bg-itc-green-200 dark:text-gray-800"
    >
      {theme === "dark" ? <MdOutlineLightMode /> : <MdOutlineDarkMode />}{" "}
    </button>
  );
};

export default ThemeSwitch;
