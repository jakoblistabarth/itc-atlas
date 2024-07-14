import { descending, max, scaleSqrt } from "d3";
import type { Feature, FeatureCollection, Point } from "geojson";
import { FC, useState } from "react";
import { MdArrowForward } from "react-icons/md";
import useSWRImmutable from "swr/immutable";
import { Vector2 } from "three";
import { feature } from "topojson-client";
import getCentroidByIsoCode from "../../../lib/data/getCentroidByIsoCode";
import getApplicationsByYear from "../../../lib/data/queries/application/getApplicationsByYear";
import getCountryWithApplicantCount, {
  CountryWithApplicantCount,
} from "../../../lib/data/queries/country/getCountryWithApplicantCount";
import { LabelPlacement } from "../../../types/LabelPlacement";
import {
  CountryProperties,
  NeCountriesTopoJson,
} from "../../../types/NeTopoJson";
import LabelPoint from "../../LabelPoint";
import LegendProportionalCircle from "../../LegendProportionalCircle";
import { getFilledSeries } from "../../LinePath/LinePath.helpers";
import MapLayerBase from "../../MapLayerBase";
import { useMapLayoutContext } from "../../MapLayout/MapLayoutContext";
import MarkCircle from "../../MarkCircle";
import LineChart from "../../Timeline/LineChart";
import Tooltip from "../../Tooltip/";

type Props = {
  neCountriesTopoJson: NeCountriesTopoJson;
  level?: string;
  department?: string;
  applicants: CountryWithApplicantCount;
};

type CountryPropertiesWithAlumniCount = CountryProperties & {
  alumniCount: number;
};

const AlumniOrigin: FC<Props> = ({
  neCountriesTopoJson,
  level,
  department,
  applicants,
}) => {
  const { projection, width } = useMapLayoutContext();

  const [country, setCountry] = useState<string | undefined>(undefined);

  const [properties, setProperties] = useState<
    CountryPropertiesWithAlumniCount | undefined
  >(undefined);

  const geographies = feature(
    neCountriesTopoJson,
    neCountriesTopoJson.objects.ne_admin_0_countries,
  );

  const { data: filteredApplicants, isLoading: filteredApplicantsIsLoading } =
    useSWRImmutable<Awaited<ReturnType<typeof getCountryWithApplicantCount>>>(
      `/api/data/country/count/applicant?${new URLSearchParams({
        level: level ?? "",
        department: department ?? "",
      }).toString()}`,
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
              level == "PhD"
                ? mapData.find((d) => d.isoAlpha3 === isoCode)?._count.phds ?? 0
                : mapData.find((d) => d.isoAlpha3 === isoCode)?._count
                    .applicants ?? 0,
          },
        };
        return feature;
      })
      .filter(
        (feature: Feature): feature is Feature =>
          !!feature.properties?.alumniCount,
      ) //TODO: replace by filter > 0
      .sort((a: Feature, b: Feature) =>
        descending(a.properties?.alumniCount, b.properties?.alumniCount),
      ),
  };

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
      <MapLayerBase countries={neCountriesTopoJson} />
      <Tooltip.Root open={!!country} placement="top-start" followCursor={true}>
        <Tooltip.Trigger asChild>
          <g id="alumni-countries-symbols">
            {!filteredApplicantsIsLoading &&
              points.features.map(({ properties, geometry }, idx) => (
                <g key={idx}>
                  <MarkCircle
                    longitude={geometry.coordinates[0]}
                    latitude={geometry.coordinates[1]}
                    radius={scale(properties?.alumniCount)}
                    fill={"teal"}
                    stroke={"teal"}
                    strokeWidth={0.5}
                    fillOpacity={0.1}
                    onMouseEnter={() => {
                      setCountry(properties?.ADM0_A3_NL);
                      setProperties(properties);
                    }}
                    onMouseLeave={() => {
                      setCountry(undefined);
                      setProperties(undefined);
                    }}
                    isActive={country === properties?.ADM0_A3_NL}
                    interactive
                  />
                </g>
              ))}
          </g>
        </Tooltip.Trigger>
        {country && (
          <TooltipSparkline
            properties={properties}
            level={level}
            country={country}
          />
        )}
      </Tooltip.Root>
      <g id="alumni-country-labels" pointerEvents={"none"}>
        {!filteredApplicantsIsLoading &&
          points.features.slice(0, 3).map((point, idx) => {
            const coords = projection(
              point.geometry.coordinates as [number, number],
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

type TooltipProps = {
  country: string;
  properties?: CountryPropertiesWithAlumniCount;
  level?: string;
};

const TooltipSparkline: FC<TooltipProps> = ({ country, properties, level }) => {
  const params = new URLSearchParams({ country });

  const { data, error, isLoading } = useSWRImmutable<
    Awaited<ReturnType<typeof getApplicationsByYear>>
  >(`/api/data/application/groupByYear?${params.toString()}`);

  if (error) return <Tooltip.Content>Error!</Tooltip.Content>;
  if (isLoading) return <Tooltip.Content>is Loading…!</Tooltip.Content>;

  const minX = 1950;
  const maxX = new Date().getFullYear();
  const sparklineDataFilled = data
    ? getFilledSeries(
        data,
        (d) => d.examYear,
        (d) => d._count._all,
        minX,
        maxX,
      )
    : [];

  return (
    <Tooltip.Content>
      <div>
        <strong>{properties?.NAME_EN}</strong>
        <br />
        {properties?.alumniCount} <span className="no-underline">{level}</span>{" "}
        alumni
      </div>
      <div>
        <LineChart data={sparklineDataFilled} width={100} height={30} />
      </div>
      <div className="flex items-baseline text-gray-500">
        <div>All alumni over time</div> <MdArrowForward />
      </div>
    </Tooltip.Content>
  );
};
