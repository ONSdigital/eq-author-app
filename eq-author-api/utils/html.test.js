const { isHtml, stripTags } = require("./html");

describe("html", () => {
  describe("isHtml", () => {
    it("should correctly determine if value is HTML", () => {
      expect(isHtml("<p>test</p>")).toEqual(true);
      expect(isHtml("<body<h1>test</h1></body>")).toEqual(true);
      expect(isHtml("<dsa i am valid html >")).toEqual(true);
    });

    it("should correctly determine if value is not HTML", () => {
      expect(isHtml("< i am NOT valid html >")).toEqual(false);
      expect(isHtml("Just text...")).toEqual(false);
      expect(isHtml("<>")).toEqual(false);
      expect(isHtml("")).toEqual(false);
      expect(isHtml(true)).toEqual(false);
      expect(isHtml(null)).toEqual(false);
      expect(isHtml(false)).toEqual(false);
      expect(isHtml([])).toEqual(false);
      expect(isHtml({})).toEqual(false);
      expect(isHtml(1)).toEqual(false);
    });
  });

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
