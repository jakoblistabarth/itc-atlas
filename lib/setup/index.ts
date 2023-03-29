import loadNaturalEarthData from "./loadNaturalEarthData";
import loadAirports from "./loadAirports";
import createCourseGenealogy from "./createCourseGenealogy";
import loadHgtData from "./loadHgtData";
import { createDataDirectories } from "./createDataDirectories";

createDataDirectories();
createCourseGenealogy();
loadNaturalEarthData();
loadAirports();
loadHgtData();
