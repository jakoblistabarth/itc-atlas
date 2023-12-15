import { FC, useState } from "react";
import { CountryWithApplicantCount } from "../lib/data/queries/country/getCountryWithApplicantCount";
import { NeCountriesTopoJson } from "../types/NeTopoJson";
import Section from "./Section";
import MapLayoutFluid from "./MapLayout/MapLayoutFluid";
import AlumniOrigin from "./visuals/maps/AlumniOrigin";
import { ApplicationLevels } from "../lib/data/queries/application/getApplicationLevels";
import { geoBertin1953 } from "d3-geo-projection";

type Props = {
  neCountriesTopoJson: NeCountriesTopoJson;
  levels: ApplicationLevels;
  applicants: CountryWithApplicantCount;
};

const AlumniOriginByLevel: FC<Props> = ({
  neCountriesTopoJson,
  levels,
  applicants,
}) => {
  const [level, setLevel] = useState<string | undefined>(undefined);
  return (
    <>
      <Section>
        <h2>Alumni</h2>
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
              {levels.map((d) => (
                <option value={d.level ?? ""} key={d.level}>
                  {d.level}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="my-5 max-w-lg">
          <MapLayoutFluid projection={geoBertin1953()}>
            <AlumniOrigin
              neCountriesTopoJson={neCountriesTopoJson}
              level={level}
              applicants={applicants}
            />
          </MapLayoutFluid>
        </div>
      </Section>
    </>
  );
};

export default AlumniOriginByLevel;
