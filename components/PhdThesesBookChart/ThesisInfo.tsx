import clsx from "clsx";
import { FC } from "react";
import getPhdTheses from "../../lib/data/queries/phd/getPhdTheses";
import Book from "../Book";
import { Canvas } from "@react-three/fiber";
import { Bounds, Environment, Float } from "@react-three/drei";
import { ScaleOrdinal } from "d3";

type Props = {
  info?: Awaited<ReturnType<typeof getPhdTheses>>[number];
  activeThesis?: string;
  colorScale: ScaleOrdinal<string, string, string>;
};

const ThesisInfo: FC<Props> = ({ info, activeThesis, colorScale }) => (
  <div
    className={clsx(
      "absolute left-3 top-3 z-50 rounded-md bg-white p-5 shadow-2xl transition-transform dark:bg-itc-green-900",
      activeThesis ? "translate-y-0 opacity-100" : " translate-y-10 opacity-0",
    )}
  >
    <Canvas className="w-1/2" orthographic>
      <Environment preset="apartment" />
      <Bounds fit margin={2}>
        <Float
          floatIntensity={0.1}
          rotation-z={-Math.PI / 2.2}
          rotation-y={-Math.PI / 2.5}
        >
          <Book
            color={colorScale(info?.departmentMainId ?? "")}
            thesisId={"1"}
            active={false}
          />
        </Float>
      </Bounds>
    </Canvas>
    <h2 className="max-w-[15em]">{info?.thesisTitle}</h2>
    <div className="inline-block rounded-sm border border-itc-blue px-1 text-itc-blue">
      {info?.country?.isoAlpha3}
    </div>
    {info?.startYear && info.graduationYear && (
      <p>
        {info?.startYear}–{info?.graduationYear}
      </p>
    )}
  </div>
);
export default ThesisInfo;
