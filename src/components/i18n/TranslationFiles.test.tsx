import "jest";
import { messages_es } from "./es";
import { messages_en } from "./en";

const messageKeysEn = Object.keys(messages_en);
const messageKeysEs = Object.keys(messages_es);
const sortedKeysEn = Object.keys(messages_en).sort();
const sortedKeysEs = Object.keys(messages_es).sort();

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
