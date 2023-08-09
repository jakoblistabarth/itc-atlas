/** @jsxImportSource theme-ui */

import { FC, useContext, useState } from "react";
import MapLayerBase from "../../MapLayerBase";
import { MapLayoutContext } from "../../MapLayout/MapLayoutContext";
import {
  CountryProperties,
  NeCountriesTopoJson,
} from "../../../types/NeTopoJson";
import Tooltip from "../../Tooltip/";
import { TooltipTrigger } from "../../Tooltip/TooltipTrigger";
import MarkCircle from "../../MarkCircle";
import { Vector2 } from "three";
import TooltipContent from "../../Tooltip/TooltipContent";
import LineChart from "../../Timeline/LineChart";
import LegendProportionalCircle from "../../LegendProportionalCircle";
import LabelPoint from "../../LabelPoint";
import { LabelPlacement } from "../../../types/LabelPlacement";
import { feature } from "topojson-client";
import useSWR from "swr";
import type { Feature, FeatureCollection, Point } from "geojson";
import getApplicationsByYear from "../../../lib/data/queries/application/getApplicationsByYear";
import getCountryWithApplicantCount, {
  CountryWithApplicantCount,
} from "../../../lib/data/queries/country/getCountryWithApplicantCount";
import getCentroidByIsoCode from "../../../lib/data/getCentroidByIsoCode";
import { descending, max, scaleSqrt } from "d3";
import { MdArrowForward } from "react-icons/md";
import { getFilledSeries } from "../../LinePath/LinePath.helpers";

type Props = {
  neCountriesTopoJson: NeCountriesTopoJson;
  level?: string;
  applicants: CountryWithApplicantCount;
};

const AlumniOrigin: FC<Props> = ({
  neCountriesTopoJson,
  level,
  applicants,
}) => {
  const { projection, width } = useContext(MapLayoutContext);

  const [country, setCountry] = useState<string | null>(null);

  const geographies = feature(
    neCountriesTopoJson,
    neCountriesTopoJson.objects.ne_admin_0_countries
  );

  type CountryPropertiesWithAlumniCount = CountryProperties & {
    alumniCount: number;
  };

  const { data: sparklineData } = useSWR<
    Awaited<ReturnType<typeof getApplicationsByYear>>
  >("/api/data/application/groupByYear?country=" + country);

  const { data: filteredApplicants, isLoading: filteredApplicantsIsLoading } =
    useSWR<Awaited<ReturnType<typeof getCountryWithApplicantCount>>>(
      "/api/data/country/count/applicant?level=" + level
    );

  const mapData = filteredApplicants ?? applicants;

  const points: FeatureCollection<Point, CountryPropertiesWithAlumniCount> = {
    type: "FeatureCollection",
    features: geographies.features
      .map((country) => {
        const isoCode = country.properties?.ADM0_A3_NL;
        const pos = getCentroidByIsoCode(isoCode);
        const feature: Feature<Point, CountryPropertiesWithAlumniCount> = {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [pos?.x ?? 0, pos?.y ?? 0],
          },
          properties: {
            ...country.properties,
            alumniCount:
              mapData.find((d) => d.isoAlpha3 === isoCode)?._count.applicants ??
              0,
          },
        };
        return feature;
      })
      .filter(
        (feature: Feature): feature is Feature =>
          !!feature.properties?.alumniCount
      ) //TODO: replace by filter > 0
      .sort((a: Feature, b: Feature) =>
        descending(a.properties?.alumniCount, b.properties?.alumniCount)
      ),
  };

  const minX = 1950;
  const maxX = new Date().getFullYear();
  const sparklineDataFilled = sparklineData
    ? getFilledSeries(
        sparklineData,
        (d) => d.examYear,
        (d) => d._count._all,
        minX,
        maxX
      )
    : [];

  const isNumber = (item: number | undefined): item is number => {
    return !!item;
  };

  const alumniCount = points.features
    .map((point) => point.properties?.alumniCount)
    .filter(isNumber);
  const alumniMax = max(alumniCount);

  const scale = scaleSqrt()
    .domain([0, alumniMax ?? 1])
    .range([0, width / 20]);
  return (
    <>
      <MapLayerBase countries={neCountriesTopoJson} projection={projection} />
      <g id="alumni-countries-symbols">
        {!filteredApplicantsIsLoading &&
          points.features.map((point, idx) => {
            const coords = projection(
              point.geometry.coordinates as [number, number]
            );
            const pos = coords ? new Vector2(...coords) : new Vector2();
            return (
              <Tooltip key={`tooltip-country-${idx}`}>
                <TooltipTrigger asChild>
                  <g>
                    <MarkCircle
                      position={pos}
                      radius={scale(point.properties?.alumniCount)}
                      fill={"teal"}
                      stroke={"teal"}
                      strokeWidth={0.5}
                      fillOpacity={0.1}
                      // TODO: check whether moving state back to point symbol improves behaviour (e.g. css transition)
                      // seems like the transition is only working once the data is fetched by SWR
                      onMouseEnter={() => {
                        setCountry(point.properties?.ADM0_A3_NL);
                      }}
                      onMouseLeave={() => setCountry(null)}
                      isActive={country === point.properties?.ADM0_A3_NL}
                      interactive
                    />
                  </g>
                </TooltipTrigger>
                {sparklineData && (
                  <TooltipContent>
                    <div>
                      <strong>{point.properties?.NAME_EN}</strong>
                      <br />
                      {point.properties?.alumniCount}{" "}
                      <span sx={{ textDecoration: "underline" }}>{level}</span>{" "}
                      alumni
                    </div>
                    <div>
                      {sparklineDataFilled && (
                        <LineChart
                          data={sparklineDataFilled}
                          width={100}
                          height={30}
                        />
                      )}
                    </div>
                    <p sx={{ color: "grey", m: 0 }}>
                      All alumni over time <MdArrowForward />
                    </p>
                  </TooltipContent>
                )}
              </Tooltip>
            );
          })}
      </g>
      <g id="alumni-country-labels" pointerEvents={"none"}>
        {!filteredApplicantsIsLoading &&
          points.features.slice(0, 3).map((point, idx) => {
            const coords = projection(
              point.geometry.coordinates as [number, number]
            );
            const pos = coords ? new Vector2(...coords) : undefined;
            return (
              <LabelPoint
                key={`label-${point.properties?.ADM0_A3_NL}-${idx}`}
                position={pos}
                placement={LabelPlacement.CENTER}
                fill={"teal"}
                fontSize={10}
              >
                {point.properties?.NAME_EN}
              </LabelPoint>
            );
          })}
      </g>
      <LegendProportionalCircle
        data={points.features
          .map((feature) => feature.properties?.alumniCount)
          .filter(isNumber)}
        scaleRadius={scale}
        title={"Graduates per country"}
        unitLabel={"graduate"}
        showFunction={false}
      />
    </>
  );
};

export default AlumniOrigin;
