const convertPipes = require("../utils/convertPipes");
const getAllAnswers = require("../utils/convertPipes").getAllAnswers;
const {
  CURRENCY,
  DATE_RANGE,
  DATE,
  NUMBER,
  UNIT,
} = require("../constants/answerTypes");
const createPipe = ({ pipeType = "answers", id = 1, text = "foo" } = {}) =>
  `<span data-piped="${pipeType}" data-id="${id}">${text}</span>`;

const createContext = (metadata = []) => ({
  questionnaireJson: {
    metadata,
    sections: [
      {
        pages: [
          {
            answers: [
              { id: `1`, type: "Text" },
              { id: `2`, type: CURRENCY },
              { id: `3`, type: DATE_RANGE },
              { id: `4`, type: DATE },
              { id: `5`, type: NUMBER },
              {
                id: `6`,
                type: UNIT,
                properties: { required: false, decimals: 0, unit: "Metres" },
              },
            ],
          },
          {},
        ],
      },
    ],
  },
});

describe("getAllAnswers", () => {
  it("should retrieve all answers when one page is empty", () => {
    expect(getAllAnswers(createContext().questionnaireJson)).toEqual(
      createContext().questionnaireJson.sections[0].pages[0].answers
    );
  });
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

  it("should handle empty answer in page", () => {
    expect(convertPipes(createContext())("<p></p>")).toEqual("<p></p>");
  });

  describe("Answer pipes", () => {
    it("should convert relevant elements to pipe format", () => {
      const html = createPipe();
      expect(convertPipes(createContext())(html)).toEqual(
        "{{ answers['answer1'] }}"
      );
    });

    it("should handle multiple piped values", () => {
      const pipe1 = createPipe();
      const pipe2 = createPipe({ id: "2", text: "bar" });
      const html = `${pipe1}${pipe2}`;

      expect(convertPipes(createContext())(html)).toEqual(
        "{{ answers['answer1'] }}{{ format_currency(answers['answer2'], 'GBP') }}"
      );
    });

    it("should handle piped values amongst regular text", () => {
      const pipe1 = createPipe();
      const pipe2 = createPipe({ id: "2", text: "bar" });
      const html = `hello ${pipe1}${pipe2} world`;

      expect(convertPipes(createContext())(html)).toEqual(
        "hello {{ answers['answer1'] }}{{ format_currency(answers['answer2'], 'GBP') }} world"
      );
    });

    describe("formatting", () => {
      it("should format Date Range answers with `format_date`", () => {
        const html = createPipe({ id: "3" });
        expect(convertPipes(createContext())(html)).toEqual(
          "{{ answers['answer3'] | format_date }}"
        );
      });

      it("should format Date answers with `format_date`", () => {
        const html = createPipe({ id: "4" });
        expect(convertPipes(createContext())(html)).toEqual(
          "{{ answers['answer4'] | format_date }}"
        );
      });

      it("should format Currency answers with `format_currency`", () => {
        const html = createPipe({ id: "2" });
        expect(convertPipes(createContext())(html)).toEqual(
          "{{ format_currency(answers['answer2'], 'GBP') }}"
        );
      });

      it("should format Number answers with `format_number`", () => {
        const html = createPipe({ id: "5" });
        expect(convertPipes(createContext())(html)).toEqual(
          "{{ answers['answer5'] | format_number }}"
        );
      });

      it("should format Units answers with `format_unit` and includes the unit type", () => {
        const html = createPipe({ id: "6" });
        expect(convertPipes(createContext())(html)).toEqual(
          "{{ format_unit('length-meter',answers['answer6']) }}"
        );
      });
    });
  });

  describe("Metadata pipes", () => {
    it("should convert a metdata to the correct pipe format", () => {
      const html = createPipe({ id: "123", pipeType: "metadata" });
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
        const html = createPipe({ id: "123", pipeType: "metadata" });
        const metadata = [{ id: "123", key: "my_metadata", type: "Date" }];
        expect(convertPipes(createContext(metadata))(html)).toEqual(
          "{{ metadata['my_metadata'] | format_date }}"
        );
      });
    });
  });
});
