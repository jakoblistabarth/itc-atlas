const mapshaper = require("mapshaper");

scales = [10, 110]; // available 110m 50m, 10m

for (scale of scales) {
  mapshaper.runCommands(
    "-i \
      data/geographic/input/ne_" +
      scale +
      "m_lakes/ne_" +
      scale +
      "m_lakes.shp name=ne_lakes  \
      -o format=topojson data/geographic/ne_" +
      scale +
      "m_lakes.json \
    "
  );

  mapshaper.runCommands(
    "-i \
      data/geographic/input/ne_" +
      scale +
      "m_rivers_lake_centerlines/ne_" +
      scale +
      "m_rivers_lake_centerlines.shp name=ne_rivers  \
      -o format=topojson data/geographic/ne_" +
      scale +
      "m_rivers.json \
    "
  );
}
