/** @jsxImportSource theme-ui */

import { FC, PropsWithChildren } from "react";
import { Grid, StylePropertyValue } from "theme-ui";
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
  textTransform?: StylePropertyValue<CSS.Property.TextTransform>;
  letterSpacing?: number;
};

const DockBlock: FC<PropsWithChildren> = ({ children }) => (
  <div
    sx={{
      mt: 4,
      mb: 2,
      boxShadow: "rgba(0, 0, 0, 0.10) 0 1px 3px 0",
      border: "1px solid hsla(203, 50%, 30%, 0.15)",
      borderRadius: "4px",
      background: "white",
      padding: 4,
    }}
  >
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
      <Grid
        columns="minmax(50px, 250px) 1fr"
        column-gap={2}
        row-gap={5}
        sx={{ alignItems: "baseline" }}
      >
        <div sx={{ fontSize: "12px", color: "grey" }}>
          {fontSizeScreen} | {fontSizePrint}pt
        </div>
        <div
          sx={{
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
        <div sx={{ fontSize: "12px", color: "grey" }}>
          <strong>{styleName}</strong>
          <br />
          {fontFamily} · {fontWeight} · {fontStyle}{" "}
          {letterSpacing && `· ${letterSpacing}`}{" "}
          {textTransform && `· ${textTransform}`}
        </div>
      </Grid>
    </DockBlock>
  );
};

export default TextStyleSpec;
