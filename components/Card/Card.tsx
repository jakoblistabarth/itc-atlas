import { Component, HTMLAttributes, PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";
import Body from "./Body";
import Footer from "./Footer";
import Header from "./Header";

type Props = HTMLAttributes<HTMLDivElement> & PropsWithChildren;

export class Card extends Component<Props> {
  static Body = Body;
  static Header = Header;
  static Footer = Footer;

  render() {
    return (
      <div
        className={twMerge(
          "rounded border bg-white shadow dark:border-itc-green-800 dark:bg-itc-green-900",
          this.props.className,
        )}
      >
        {this.props.children}
      </div>
    );
  }
}
