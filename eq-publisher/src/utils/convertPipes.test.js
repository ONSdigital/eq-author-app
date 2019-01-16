const convertPipes = require("../utils/convertPipes");

const createPipe = ({
  pipeType = "answers",
  id = 123,
  type = "TextField",
  text = "foo",
} = {}) =>
  `<span data-piped="${pipeType}" data-id="${id}" data-type="${type}">${text}</span>`;

const createContext = (metadata = []) => ({
  questionnaireJson: {
    metadata,
  },
});

describe("convertPipes", () => {
  it("should handle empty strings", () => {
    expect(convertPipes(createContext())("")).toEqual("");
  });

  it("should handle null values", () => {
    expect(convertPipes(createContext())(null)).toBeNull();
  });

  it("should handle undefined values", () => {
    expect(convertPipes(createContext())(undefined)).toBeUndefined();
  });

  it("should handle empty html tags", () => {
    expect(convertPipes(createContext())("<p></p>")).toEqual("<p></p>");
  });

  it("should handle unknown pipe types", () => {
    expect(
      convertPipes(createContext())(createPipe({ pipeType: "Foo" }))
    ).toEqual("");
  });

  describe("Answer pipes", () => {
    it("should convert relevant elements to pipe format", () => {
      const html = createPipe();
      expect(convertPipes(createContext())(html)).toEqual(
        "{{ answers['answer123'] }}"
      );
    });

    it("should handle multiple piped values", () => {
      const pipe1 = createPipe();
      const pipe2 = createPipe({ id: "456", text: "bar" });
      const html = `${pipe1}${pipe2}`;

      expect(convertPipes(createContext())(html)).toEqual(
        "{{ answers['answer123'] }}{{ answers['answer456'] }}"
      );
    });

    it("should handle piped values amongst regular text", () => {
      const pipe1 = createPipe();
      const pipe2 = createPipe({ id: "456", text: "bar" });
      const html = `hello ${pipe1}${pipe2} world`;

      expect(convertPipes(createContext())(html)).toEqual(
        "hello {{ answers['answer123'] }}{{ answers['answer456'] }} world"
      );
    });

    describe("formatting", () => {
      it("should format Date Range answers with `format_date`", () => {
        const html = createPipe({ id: "123", type: "DateRange" });
        expect(convertPipes(createContext())(html)).toEqual(
          "{{ answers['answer123'] | format_date }}"
        );
      });

      it("should format Date answers with `format_date`", () => {
        const html = createPipe({ id: "123", type: "Date" });
        expect(convertPipes(createContext())(html)).toEqual(
          "{{ answers['answer123'] | format_date }}"
        );
      });

      it("should format Currency answers with `format_currency`", () => {
        const html = createPipe({ id: "123", type: "Currency" });
        expect(convertPipes(createContext())(html)).toEqual(
          "{{ format_currency(answers['answer123'], 'GBP') }}"
        );
      });

      it("should format Number answers with `format_number`", () => {
        const html = createPipe({ id: "123", type: "Number" });
        expect(convertPipes(createContext())(html)).toEqual(
          "{{ answers['answer123'] | format_number }}"
        );
      });
    });
  });

  describe("Metadata pipes", () => {
    it("should convert a metdata to the correct pipe format", () => {
      const html = createPipe({ pipeType: "metadata" });
      const metadata = [{ id: "123", key: "my_metadata", type: "Text" }];
      expect(convertPipes(createContext(metadata))(html)).toEqual(
        "{{ metadata['my_metadata'] }}"
      );
    });

    it("should ignore non-existant metadata", () => {
      const html = createPipe({ pipeType: "metadata" });
      const metadata = [{ id: "456", key: "my_metadata", type: "Text" }];
      expect(convertPipes(createContext(metadata))(html)).toEqual("");
    });

    describe("formatting", () => {
      it("should format date metadata as date", () => {
        const html = createPipe({ pipeType: "metadata" });
        const metadata = [{ id: "123", key: "my_metadata", type: "Date" }];
        expect(convertPipes(createContext(metadata))(html)).toEqual(
          "{{ metadata['my_metadata'] | format_date }}"
        );
      });
    });
  });
});
