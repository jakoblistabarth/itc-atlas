import * as aq from "arquero";
import fs from "fs";
import Fuse from "fuse.js";
import { feature } from "topojson-client";
import xlsx from "xlsx";
import getPopulatedPlaces from "./getPopulatedPlaces";
import getUnsdCountries from "./getUnsdCountries";

const cleanAlumni = async () => {
  const filePath = "./data/itc/All Alumni until 2020_Anon_JMT.xlsx";
  const file = xlsx.readFile(filePath, {
    cellDates: true,
  });
  const data = xlsx.utils.sheet_to_json(file.Sheets[file.SheetNames[0]], {
    defval: null,
  });

  const unsdCodes = await getUnsdCountries();
  const nePopulatedPlaces = getPopulatedPlaces("10m");

  const places = feature(
    nePopulatedPlaces,
    nePopulatedPlaces.objects.ne_populated_places
  )
    .features.filter((d) => d.properties)
    .map((d) => d.properties);

  const fuseCountries = new Fuse(unsdCodes, {
    // includeScore: true,
    distance: 50,
    keys: ["Country or Area"],
  });

  const tb = aq
    .from(data)
    .rename({
      City: "city",
      "No.": "contactNo",
      Level: "level",
      Country: "country",
      "Exam Year": "examYear",
      "ITC code": "courseCode",
      Description: "description",
    })
    .derive({
      examYear2: aq.escape((d) => {
        if (!d.examYear || !Number.isInteger(d.examYear)) return null;
        return new Date(d.examYear + " GMT").toISOString();
      }),
    })
    .derive({
      country: aq.escape((d) => {
        // Correct erroneously assigned country "Heard Island and McDonald Islands" instead of "Honduras" (HMD vs HND)
        if (typeof d.city !== "string") return d.country;
        if (d.city.match("^Tegu[c|e]igalpa.*")) return "Honduras";
        if (d.country === "Palestinian Territories")
          return "State of Palestine";
        return d.country;
      }),
    })
    .derive({
      countryISO3: aq.escape((d) => {
        if (!d.country) return null;
        const results = fuseCountries.search(d.country);
        const result = results[0];
        if (!result) return null;
        return result.item["ISO-alpha3 Code"];
      }),
    })
    .derive({
      populatedPlaceNE: aq.escape((d) => {
        if (!d.city) return null;
        const placesSelection = places.filter(
          (p) => p.ADM0_A3 === d.countryISO3
        );
        const fusePlaces = new Fuse(placesSelection, {
          // includeScore: true,
          distance: 50,
          keys: ["NAME_EN"],
        });
        const result = fusePlaces.search(d.city)[0];
        if (!result) return null;
        return result.item["NAME_EN"];
      }),
    })
    .select(
      "contactNo",
      "examYear",
      "examYear2",
      "city",
      "populatedPlaceNE",
      "country",
      "countryISO3",
      "level",
      "courseCode",
      "description"
    );

  fs.writeFileSync("./data/itc" + "/alumni.json", JSON.stringify(tb.objects()));
};

export default cleanAlumni;
