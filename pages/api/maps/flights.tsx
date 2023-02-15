import type { NextApiRequest, NextApiResponse } from "next";
import ReactDOMServer from "react-dom/server";
import getCountries from "../../../lib/data/getCountries";
import BaseLayer from "../../../components/map/BaseLayer";
import { geoBertin1953 } from "d3-geo-projection";
import themes, { ThemeNames } from "../../../lib/styles/themes";
import FlowLayer from "../../../components/map/FlowLayer";
import MapLayout from "../../../components/map/layout/MapLayout";
import MapLayoutBody from "../../../components/map/layout/MapLayoutBody";
import MapLayoutHeader from "../../../components/map/layout/MapLayoutHeader";
import { MapOptions } from "../../../types/MapOptions";
import FlowLegend from "../../../components/map/FlowLegend";
import MapLayoutAside from "../../../components/map/layout/MapLayoutAside";
import * as d3 from "d3";
import defaultTheme from "../../../lib/styles/themes/defaultTheme";
import getOdMatrix from "../../../lib/data/getOdMatrix";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const themeReq = req.query.theme?.toString() as ThemeNames;
  const theme = !themeReq ? defaultTheme : themes.get(themeReq);
  if (!theme) {
    res.status(400).json({ error: "invalid theme name" });
  }

  const neCountriesTopoJson = getCountries();
  const odMatrix = await getOdMatrix();

  const flightsPerRoute = odMatrix.flows.features.map(
    (flow) => flow.properties?.value
  );
  const min = d3.min(flightsPerRoute);
  const max = d3.max(flightsPerRoute);
  const scale = d3
    .scaleLinear()
    .domain([min ?? 0, max ?? 1])
    .range([1, 15]);

  const mapOptions: MapOptions = {
    bounds: {
      width: 900,
      height: 500,
      frame: {
        top: 70,
        bottom: 0,
        left: 150,
        right: 0,
      },
    },
    projection: geoBertin1953(),
    theme: theme ?? defaultTheme,
    styles: {
      pointStyle: {
        stroke: "none",
        fillOpacity: 1,
      },
    },
  };

  const svg = ReactDOMServer.renderToStaticMarkup(
    <MapLayout
      bounds={mapOptions.bounds}
      projection={mapOptions.projection}
      theme={theme}
    >
      <MapLayoutHeader
        bounds={mapOptions.bounds}
        title={"ITC's flight activities"}
        subtitle={"by staff for projects and examinations"}
        theme={theme}
      />
      <MapLayoutAside xOffset={0} yOffset={mapOptions.bounds?.frame?.top}>
        <FlowLegend
          data={odMatrix.flows.features.map((flow) => flow.properties?.value)}
          scaleWidth={scale}
          title="No. of flights in 2019"
          unitLabel="flights"
          style={mapOptions.theme.flow}
        />
      </MapLayoutAside>
      <MapLayoutBody bounds={mapOptions.bounds}>
        <BaseLayer
          countries={neCountriesTopoJson}
          projection={mapOptions.projection}
          theme={mapOptions.theme}
        />
        <FlowLayer
          projection={mapOptions.projection}
          data={odMatrix}
          scaleWidth={scale}
          flowStyle={mapOptions.theme.flow}
          pointStyle={mapOptions.styles?.pointStyle}
        />
      </MapLayoutBody>
    </MapLayout>
  );
  res
    .status(200)
    .setHeader("Content-Type", "text/html; charset=utf-8;")
    .send(svg);
}
