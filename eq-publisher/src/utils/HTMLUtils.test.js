const { getInnerHTML, getText, parseContent } = require("./HTMLUtils");

describe("HTMLUtils", () => {
  describe("getInnerHTML", () => {
    it("should exclude outer tag", () => {
      expect(getInnerHTML("<p>foo bar</p>")).toBe("foo bar");
    });

    it("should return plain-text untouched", () => {
      expect(getInnerHTML("foo bar")).toBe("foo bar");
    });
  });

  describe("getText", () => {
    it("should return the input if plain text passed in", () => {
      expect(getText("Lorem ipsum")).toEqual("Lorem ipsum");
    });

    it("should return the plain text if HTML is passed in", () => {
      expect(getText("<p>Lorem <em>ipsum</em></p>")).toEqual("Lorem ipsum");
    });
  });

  describe("parseContent", () => {
    it("should return undefined if no content supplied", () => {
      expect(parseContent()).toBeUndefined();
      expect(parseContent("")).toBeUndefined();
      expect(parseContent("<p></p>")).toBeUndefined();
    });

    it("should correctly parse content into runner-compatible object", () => {
      const guidance = `
        <h2>Vivamus sagittis lacus vel augue laoreet</h2>
        <p></p>
        <p>Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Duis mollis, est non commodo luctus, nisi erat porttitor ligula.</p>
        <p></p>
        <ul>
          <li>Cras justo odio, dapibus ac facilisis in, egestas eget quam.</li>
          <li>Aenean eu leo quam.</li>
          <li>Pellentesque ornare sem lacinia quam venenatis vestibulum.</li>
          <li>Vestibulum id ligula porta felis euismod semper.</li>
        </ul>
      `;

      expect(parseContent(guidance)).toEqual({
        content: [
          {
            title: "Vivamus sagittis lacus vel augue laoreet"
          },
          {
            description:
              "Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Duis mollis, est non commodo luctus, nisi erat porttitor ligula."
          },
          {
            list: [
              "Cras justo odio, dapibus ac facilisis in, egestas eget quam.",
              "Aenean eu leo quam.",
              "Pellentesque ornare sem lacinia quam venenatis vestibulum.",
              "Vestibulum id ligula porta felis euismod semper."
            ]
          }
        ]
      });
    });
  });
});
