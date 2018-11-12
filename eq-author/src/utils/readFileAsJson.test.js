import readFileAsJson from "./readFileAsJson";
import { createTextFile, createJsonFile } from "tests/utils/createFile";

it("returns a promise", () => {
  expect(readFileAsJson(createJsonFile())).toBeInstanceOf(Promise);
});

it("requires File or Blob as argument", () => {
  expect(() => readFileAsJson({})).toThrow();
  expect(() => readFileAsJson(createJsonFile())).not.toThrow();
});

it("resovles valid JSON", () => {
  expect.assertions(1);

  const obj = { foo: "bar" };

  return readFileAsJson(createJsonFile(obj)).then(data => {
    expect(data).toEqual(obj);
  });
});

it("rejects invalid JSON", () => {
  expect.assertions(1);

  return readFileAsJson(createTextFile("LOL")).catch(e => {
    expect(e).toBeInstanceOf(Error);
  });
});
