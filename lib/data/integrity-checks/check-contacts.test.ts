import * as aq from "arquero";
import { describe, test, expect, beforeAll } from "@jest/globals";
import loadContacts, { ContactRaw } from "../load/loadContacts";

let contacts: ContactRaw[];

beforeAll(async () => {
  contacts = await loadContacts();
});

describe("For Contacts", () => {
  test.failing("APPnr are unique", () => {
    const duplicates = aq
      .from(contacts)
      // .filter((d: ContactRaw) => d.id)
      .groupby("APPnr")
      .count()
      .filter((d: ContactRaw & { count: number }) => d.count > 1)
      .numRows();
    expect(duplicates).toBe(0);
  });
  test("contactNo are not unique", () => {
    const duplicates = aq
      .from(contacts)
      // .filter((d: ContactRaw) => d.id)
      .groupby("ContactNo")
      .count()
      .filter((d: ContactRaw & { count: number }) => d.count > 1);
    expect(duplicates.numRows()).toBeGreaterThan(0);
  });
  test("studentId does occure more than once", () => {
    const duplicates = aq
      .from(contacts)
      .groupby("ITC Student No.")
      .count()
      .filter((d: ContactRaw & { count: number }) => d.count > 1);
    expect(duplicates.numRows()).toBeGreaterThan(0);
  });
});
