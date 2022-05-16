import * as d3 from "d3";

export const fPercentage = d3.format(".2%");
export const fFloat = d3.format(",.4");
export const fInt = d3.format(",");
export const fDateLong = d3.timeFormat("%B %d, %Y");
export const fDateShort = d3.timeFormat("%Y-%m-%d");
export const fDateMonthYear = d3.timeFormat("%B, %Y");
export const fDateYear = d3.timeFormat("%Y");
