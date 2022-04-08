import "jest";
import { messages_es } from "./es";
import { messages_en } from "./en";
import { flattenMessages } from "./utils";

const flattenEs = flattenMessages(messages_es);
const flattenEn = flattenMessages(messages_en);
const messageKeysEn = Object.keys(flattenEn);
const messageKeysEs = Object.keys(flattenEs);
const sortedKeysEn = Object.keys(flattenEn).sort();
const sortedKeysEs = Object.keys(flattenEs).sort();

describe("language files", () => {
  it("should have the same number of keys", () => {
    expect(messageKeysEn.length).toEqual(messageKeysEs.length);
  });

  it("should have the same ordered keys", () => {
    expect(sortedKeysEn).toEqual(sortedKeysEs);
  });

  it("english translation file should be sorted alphabetically by keys", () => {
    expect(messageKeysEn).toEqual(sortedKeysEn);
  });

  it("spanish translation file should be sorted alphabetically by keys", () => {
    expect(messageKeysEs).toEqual(sortedKeysEs);
  });
});
