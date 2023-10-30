import { Component, PropsWithChildren } from "react";
import Body from "./Body";
import Header from "./Header";
import Footer from "./Footer";

type Props = PropsWithChildren;

export class Card extends Component<Props> {
  static Body = Body;
  static Header = Header;
  static Footer = Footer;

  render() {
    return (
      <div className="rounded border bg-white shadow dark:border-itc-green-800 dark:bg-itc-green-900">
        {this.props.children}
      </div>
    );
  }
}
