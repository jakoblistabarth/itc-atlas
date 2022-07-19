import loadNaturalEarthData from "./loadNaturalEarthData";
import loadAirports from "./loadAirports";
import fakeTravelData from "./fakeTravelData";

loadNaturalEarthData();
loadAirports().then(() => {
  fakeTravelData();
});
