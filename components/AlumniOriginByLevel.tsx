import { FC, useState } from "react";
import { CountryWithApplicantCount } from "../lib/data/queries/country/getCountryWithApplicantCount";
import { NeCountriesTopoJson } from "../types/NeTopoJson";
import Section from "./Section";
import MapLayoutFluid from "./MapLayout/MapLayoutFluid";
import AlumniOrigin from "./visuals/maps/AlumniOrigin";
import { ApplicationLevels } from "../lib/data/queries/application/getApplicationLevels";
import { geoBertin1953 } from "d3-geo-projection";
import Paragraph from "./Paragraph";

type Props = {
  neCountriesTopoJson: NeCountriesTopoJson;
  levels: ApplicationLevels;
  applicants: CountryWithApplicantCount;
  department: string;
};

const AlumniOriginByLevel: FC<Props> = ({
  neCountriesTopoJson,
  levels,
  applicants,
  department,
}) => {
  const [level, setLevel] = useState<string | undefined>(undefined);
  return (
    <>
      <Section>
        <h2>Alumni</h2>
        <Paragraph>
          Distribution of departmental alumni. Refine the selection based on
          educational level.
        </Paragraph>
        <div className="mb-5">
          <label>
            <br />
            Select a level you want to filter for:
            <select
              className="ml-4"
              name="level"
              onChange={(event) => setLevel(event.target.value)}
              placeholder={"none selected"}
            >
              <option value={""}>All levels</option>
              {levels
                .map((d) => d.level)
                .sort()
                .reverse()
                .map((d) => (
                  <option value={d ?? ""} key={d}>
                    {d}
                  </option>
                ))}
            </select>
          </label>
        </div>
        <div className="max-w-screen-sm">
          <MapLayoutFluid projection={geoBertin1953()}>
            <AlumniOrigin
              neCountriesTopoJson={neCountriesTopoJson}
              level={level}
              applicants={applicants}
              department={department}
            />
          </MapLayoutFluid>
        </div>
      </Section>
    </>
  );
};

export default AlumniOriginByLevel;
