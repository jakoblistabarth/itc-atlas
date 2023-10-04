/** @jsxImportSource theme-ui */

import type { NextPage } from "next";
import PageBase from "../../components/PageBase";
import { FC, memo, useCallback, useMemo, useState } from "react";
import { randomInt } from "d3";

const Page: NextPage = () => {
  const [activeElement, setActiveElement] = useState<string | undefined>();
  const elements = useMemo(() => ["A", "B", "C"], []);
  const cbf = useCallback((itemId: string) => setActiveElement(itemId), []);
  const ln = useCallback(() => console.log("rendered: page"), []);
  ln();
  return (
    <PageBase title="Uplifting state without rerendering">
      activeElement: {activeElement}
      <div sx={{ display: "flex", gap: "1em" }}>
        {elements.map((d) => {
          // const isActive = !!(activeElement === d);
          return (
            <MemoizedItem
              key={d}
              id={d}
              isActive={false}
              onClickHandler={() => cbf(d)}
            >
              {d}
            </MemoizedItem>
          );
        })}
      </div>
    </PageBase>
  );
};
export default Page;

type ItemProps = {
  id: string;
  isActive: boolean;
  onClickHandler: (d: string) => void;
} & JSX.IntrinsicElements["div"];

const Item: FC<ItemProps> = ({ id, isActive, onClickHandler, ...rest }) => {
  const ln = useCallback((d: string) => console.log(`rendered" ${d}`), []);
  ln(id);
  return (
    <div
      {...rest}
      sx={{
        p: 5,
        borderRadius: 2,
        borderWidth: 4,
        borderStyle: "solid",
        borderColor: isActive ? "black" : "transparent",
        boxShadow: 1,
        // background: ["gold", "orange", "red", "cornflowerblue"][
        //   randomInt(4)()
        // ],
        cursor: "pointer",
      }}
      onClick={() => onClickHandler(id)}
    >
      {id}
    </div>
  );
};

const MemoizedItem = memo(Item);
