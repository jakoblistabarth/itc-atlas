import DataFrame from "../DataFrame/DataFrame";

const cleanTravelData2019 = (data) => {
  const df = new DataFrame(data)
    .where((row) => row["Sales Type"] !== "Train" && row.Route)
    .dropColumn("Hotel location")
    .mutate("airportCodes", (row) => row.Route.split("-"))
    .dropColumn("Route")
    .mutate("orderDate", (row) => row["Order Date"].toISOString())
    .dropColumn("Order Date")
    .mutate("departureDate", (row) => row["Departure Date"].toISOString())
    .dropColumn("Departure Date")
    .mutate("arrivalDate", (row) => row["Arrival Date"].toISOString())
    .dropColumn("Arrival Date")
    .mutate("travelDays", (row) => Math.abs(row["Travel days"]))
    .dropColumn("Travel days")
    .mutate("ticketCount", (row) => Math.abs(row["Ticket Count"]))
    .dropColumn("Ticket Count")
    .mutate("fare", (row) => Math.abs(row["Fare"]))
    .dropColumn("Fare")
    .mutate("tax", (row) => Math.abs(row["Tax"]))
    .dropColumn("Tax")
    .mutate("ref2", (row) => (row["Ref2"] ? "#" + row["Ref2"] : null))
    .dropColumn("Ref2")
    .renameColumn({ Ref1: "ref1" });

  return df.toArray();
};

export default cleanTravelData2019;
