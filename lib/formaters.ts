import * as d3 from "d3";

export const pctFormat = d3.format(".2%");
export const floatFormat = d3.format(",.4");
export const intFormat = d3.format(",");
export const dateLongFormat = d3.timeFormat("%B %d, %Y");
export const dateShortFormat = d3.timeFormat("%Y-%m-%d");
export const monthFormat = d3.timeFormat("%B, %Y");
