/** @jsxImportSource theme-ui */

import type { NextPage } from "next";
import PageBase from "../../components/PageBase";
import { useMemo, useState } from "react";
import { randomInt } from "d3";

const Page: NextPage = () => {
  const [activeElement, setActiveElement] = useState<string | undefined>();
  const elements = useMemo(() => ["A", "B", "C", "D", "E"], []);
  console.log("rerendered page");
  return (
    <PageBase title="Uplifting state without rerendering">
      activeElement: {activeElement}
      <div sx={{ display: "flex", gap: "1em" }}>
        {elements.map((d) => {
          console.log(`rerendered ${d}`);
          return (
            <div
              key={d}
              sx={{
                p: 5,
                borderRadius: 2,
                borderWidth: 4,
                borderStyle: "solid",
                borderColor: activeElement == d ? "black" : "transparent",
                background: ["gold", "orange", "red", "cornflowerblue"][
                  randomInt(4)()
                ],
                cursor: "pointer",
              }}
              onClick={() => {
                setActiveElement(d);
              }}
            >
              {d}
            </div>
          );
        })}
      </div>
    </PageBase>
  );
};
export default Page;
