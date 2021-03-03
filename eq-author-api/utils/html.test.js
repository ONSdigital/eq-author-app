const { stripTags } = require("./html");

describe("html", () => {
  describe("stripTags", () => {
    it("should correctly strip html tags", () => {
      expect(stripTags("<p>test</p>")).toEqual("test");
      expect(stripTags("<p></p>")).toEqual("");
      expect(stripTags("test")).toEqual("test");
      expect(stripTags("")).toEqual("");
      expect(stripTags(true)).toEqual(true);
      expect(stripTags(null)).toEqual(null);
      expect(stripTags(false)).toEqual(false);
      expect(stripTags([])).toEqual([]);
      expect(stripTags("<p>[]</p>")).toEqual("[]");
      expect(stripTags({})).toEqual({});
      expect(stripTags(1)).toEqual(1);
    });
  });
});
