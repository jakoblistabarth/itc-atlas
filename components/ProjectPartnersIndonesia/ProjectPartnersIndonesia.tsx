import bbox from "@turf/bbox";
import bboxPolygon from "@turf/bbox-polygon";
import buffer from "@turf/buffer";
import rewind from "@turf/rewind";
import { geoEquirectangular } from "d3-geo";
import { FC } from "react";
import { feature } from "topojson-client";
import { NeCountriesTopoJson } from "../../types/NeTopoJson";
import MapLayerBase from "../MapLayerBase";
import MapLayoutFluid from "../MapLayout/MapLayoutFluid";
import MarkGeometry from "../MarkGeometry";
import MarkGlyph from "../MarkGlyph";

type Props = {
  countries: NeCountriesTopoJson;
};

const ProjectPartnersIndonesia: FC<Props> = ({ countries }) => {
  const fc = feature(countries, countries.objects.ne_admin_0_countries);
  const indonesia = fc.features.find((d) => d.properties.ADM0_A3 === "IDN");
  const extent = indonesia
    ? // TODO: find out why buffer needs to be rewinded
      rewind(
        buffer(bboxPolygon(bbox(indonesia)), 500, { units: "kilometers" }),
        {
          reverse: true,
        },
      )
    : undefined;
  const partners = [
    {
      longitude: 106.5,
      latitude: -6,
      fill: "red",
      labelColor: "white",
      label: "A",
      fontSize: 10,
    },
    {
      longitude: 106.8,
      latitude: -6.5,
      fill: "darkred",
      labelColor: "white",
      fontSize: 10,
      label: "B",
    },
    {
      longitude: 110,
      latitude: -7.5,
      fill: "red",
      labelColor: "white",
      label: "C",
      fontSize: 10,
    },
  ];
  return (
    <div>
      <MapLayoutFluid projection={geoEquirectangular()} extent={extent}>
        <MapLayerBase countries={countries} />
        {indonesia && (
          <MarkGeometry feature={indonesia} fill="lightgrey" stroke="grey" />
        )}
        {partners.map((d) => (
          <MarkGlyph key={d.label} {...d} />
        ))}
      </MapLayoutFluid>
    </div>
  );
};

export default ProjectPartnersIndonesia;
