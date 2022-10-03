import loadNaturalEarthData from "./loadNaturalEarthData";
import loadAirports from "./loadAirports";
import fakeTravelData from "./fakeTravelData";
import loadCities from "./loadCitiesOver1000Population";

loadNaturalEarthData();
loadAirports().then(() => {
  fakeTravelData();
});
// loadCities();
