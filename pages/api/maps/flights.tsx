import type { NextApiRequest, NextApiResponse } from "next";
import getFlights from "../../../lib/data/getFlights";
import ReactDOMServer from "react-dom/server";
import getCountries from "../../../lib/data/getCountries";
import BaseLayer from "../../../components/map/BaseLayer";
import { geoBertin1953 } from "d3-geo-projection";
import themes from "../../../lib/styles/themes";
import FlowLayer from "../../../components/map/FlowLayer";
import { scaleLinear } from "d3";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const theme = req.query.theme?.toString();

  const [odMatrix, countries] = await Promise.all([
    (await getFlights()).odMatrix,
    getCountries(),
  ]);

  const mapOptions = {
    width: 900,
    height: 500,
    projection: geoBertin1953(),
    theme: themes[theme],
  };

  const svg = ReactDOMServer.renderToStaticMarkup(
    <svg
      width={900}
      height={500}
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <BaseLayer
        data={countries}
        projection={geoBertin1953()}
        theme={mapOptions.theme}
      />
      <FlowLayer
        projection={mapOptions.projection}
        data={odMatrix}
        scaleWidth={scaleLinear().domain([0, 100]).range([0, 20])}
        // flowStyle={mapOptions.style.flow}
        // pointStyle={pointStyle}
      />
    </svg>
  );
  res.status(200).setHeader("Content-Type", "text/html").send(svg);
}
