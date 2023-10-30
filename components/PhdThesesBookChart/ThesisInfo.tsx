import { FC, useState } from "react";
import getPhdTheses from "../../lib/data/queries/phd/getPhdTheses";
import Book from "../Book";
import { Canvas } from "@react-three/fiber";
import { Bounds, Environment, Float, Shadow } from "@react-three/drei";
import { ScaleOrdinal } from "d3";
import { useTransition, animated, config } from "@react-spring/web";
import CountryCodeBadge from "../CountryCodeBadge";
import { MdClose } from "react-icons/md";
import clsx from "clsx";

type Props = {
  info?: Awaited<ReturnType<typeof getPhdTheses>>[number];
  colorScale: ScaleOrdinal<string, string, string>;
  onCloseHandler: () => void;
};

const ThesisInfo: FC<Props> = ({ info, colorScale, onCloseHandler }) => {
  const [showCanvas, setShowCanvas] = useState(false);
  const transitions = useTransition(info, {
    from: {
      opacity: 0,
      transform: `scale(${0.75})`,
    },
    enter: {
      opacity: 1,
      transform: `scale(${1})`,
    },
    leave: {
      opacity: 0,
      transform: `scale(${0.75})`,
    },
    onRest: () => setShowCanvas(true),
    onChange: () => setShowCanvas(false),
    config: config.gentle,
  });
  return transitions((style, info) => (
    <div className="absolute left-3 top-3" onClick={(e) => e.stopPropagation()}>
      <animated.div
        style={style}
        className="relative z-50 rounded-md bg-white p-5 shadow-2xl dark:bg-itc-green-900"
      >
        <div className="flex w-full place-content-between items-center">
          <div className="text-xs">Thesis details</div>
          <button
            className="rounded-full p-2 hover:bg-itc-green-50"
            onClick={onCloseHandler}
          >
            <MdClose />
          </button>
        </div>
        <div className="h-[150px] w-[300px]">
          {showCanvas && (
            <Canvas orthographic>
              <Environment preset="apartment" />
              <Bounds fit damping={30} observe margin={1}>
                <Float
                  floatIntensity={0.1}
                  rotation-z={-Math.PI / 2.2}
                  rotation-y={-Math.PI / 2.5}
                  position-y={0.2}
                >
                  <Book
                    color={colorScale(info?.departmentMainId ?? "")}
                    thesisId={"1"}
                    active={false}
                  />
                </Float>
                <Shadow opacity={0.25} />
              </Bounds>
            </Canvas>
          )}
        </div>
        <div className="mb-2">
          <h2 className="max-w-[15em]">{info?.thesisTitle}</h2>
          <p className="">Name of phd Candidate</p>
        </div>
        {info?.country && (
          <CountryCodeBadge isoAlpha3Code={info.country.isoAlpha3} />
        )}
        <table className="mt-3 text-xs">
          <tbody>
            {[
              ["Main department", info?.departmentMainId],
              ["Secondary department", info?.departmentSecondaryId],
              ["Published", info?.graduationYear],
            ].map(([k, v], idx) => (
              <tr
                key={idx}
                className={clsx("align-baseline", !v && "text-gray-400")}
              >
                <td>{k}</td>
                <td className={"ps-3 font-serif font-bold"}>
                  {v ? v : <span className="font-normal italic">No Data</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </animated.div>
    </div>
  ));
};
export default ThesisInfo;
