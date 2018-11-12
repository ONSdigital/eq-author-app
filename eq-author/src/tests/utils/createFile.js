export function createTextFile(contents = "", name = "foo.json") {
  return new File(contents.split(""), name);
}

export function createJsonFile(obj = {}, name) {
  return createTextFile(JSON.stringify(obj), name);
}
