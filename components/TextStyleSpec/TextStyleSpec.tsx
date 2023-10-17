import { FC, PropsWithChildren } from "react";
import CSS from "csstype";

type Props = {
  styleName: string;
  /* What is the style's font size in ?? for on screen? */
  sampleText?: string;
  fontSizeScreen: string;
  /* What is the style's font size in points (pt) for print documents? */
  fontSizePrint: number;
  /* What is the style's font family? */
  fontFamily: string;
  fontStyle?: string;
  fontWeight?: string;
  textTransform?: CSS.Property.TextTransform;
  letterSpacing?: number;
};

const DockBlock: FC<PropsWithChildren> = ({ children }) => (
  <div className="!my-5 rounded-md border border-gray-200 bg-white p-5 shadow">
    {children}
  </div>
);

const TextStyleSpec: FC<Props> = ({
  styleName,
  sampleText = "Lorem ipsum",
  fontSizeScreen,
  fontSizePrint,
  fontFamily,
  fontStyle = "normal",
  fontWeight = "normal",
  textTransform,
  letterSpacing,
}) => {
  return (
    <DockBlock>
      <div className="grid grid-cols-[minmax(50px,_250px)_1fr] items-baseline gap-x-2 gap-y-5">
        <div className="!text-xs text-gray-500">
          {fontSizeScreen} | {fontSizePrint}pt
        </div>
        <div
          style={{
            fontSize: fontSizeScreen,
            fontFamily,
            fontStyle,
            fontWeight,
            textTransform,
            letterSpacing,
          }}
        >
          {sampleText}
        </div>
        <div className="!text-xs text-gray-500">
          <strong>{styleName}</strong>
          <br />
          {fontFamily} · {fontWeight} · {fontStyle}{" "}
          {letterSpacing && `· ${letterSpacing}`}{" "}
          {textTransform && `· ${textTransform}`}
        </div>
      </div>
    </DockBlock>
  );
};

export default TextStyleSpec;
