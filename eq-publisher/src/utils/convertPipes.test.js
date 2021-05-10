const convertPipes = require("../utils/convertPipes");
const getAllAnswers = require("../utils/convertPipes").getAllAnswers;
const {
  CURRENCY,
  DATE_RANGE,
  DATE,
  NUMBER,
  UNIT,
} = require("../constants/answerTypes");
const createPipe = ({
  pipeType = "answers",
  id = "0151378b-579d-40bf-b4d4-a378c573706a",
  text = "foo",
  type = "",
} = {}) =>
  `<span data-piped="${pipeType}" ${
    type === "" ? "" : `data-type="${type}"`
  } data-id="${id}">${text}</span>`;

const createContext = (metadata = []) => ({
  questionnaireJson: {
    metadata,
    sections: [
      {
        folders: [
          {
            pages: [
              {
                answers: [
                  { id: `0151378b-579d-40bf-b4d4-a378c573706a`, type: "Text" },
                  {
                    id: `1151378b-579d-40bf-b4d4-a378c573706a`,
                    type: CURRENCY,
                  },
                  {
                    id: `2151378b-579d-40bf-b4d4-a378c573706a`,
                    type: DATE_RANGE,
                  },
                  {
                    id: `9151378b-579d-40bf-b4d4-a378c573706a`,
                    type: DATE_RANGE,
                    properties: {
                      fallback: {
                        enabled: true,
                        start: "2016-from",
                        end: "2016-to",
                      },
                    },
                  },
                  {
                    id: `5251378b-579d-40bf-b4d4-a378c573706a`,
                    type: DATE_RANGE,
                    properties: {
                      fallback: {
                        enabled: true,
                      },
                    },
                  },
                  { id: `3151378b-579d-40bf-b4d4-a378c573706a`, type: DATE },
                  { id: `4151378b-579d-40bf-b4d4-a378c573706a`, type: NUMBER },
                  {
                    id: `5151378b-579d-40bf-b4d4-a378c573706a`,
                    type: UNIT,
                    properties: {
                      required: false,
                      decimals: 0,
                      unit: "Metres",
                    },
                  },
                ],
              },
              {},
            ],
          },
        ],
      },
    ],
  },
});

describe("getAllAnswers", () => {
  it("should retrieve all answers when one page is empty", () => {
    expect(getAllAnswers(createContext().questionnaireJson)).toEqual(
      createContext().questionnaireJson.sections[0].folders[0].pages[0].answers
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
        "{{ answers['answer0151378b-579d-40bf-b4d4-a378c573706a'] }}"
      );
    });

    it("should handle multiple piped values", () => {
      const pipe1 = createPipe();
      const pipe2 = createPipe({
        id: "1151378b-579d-40bf-b4d4-a378c573706a",
        text: "bar",
      });
      const html = `${pipe1}${pipe2}`;

      expect(convertPipes(createContext())(html)).toEqual(
        "{{ answers['answer0151378b-579d-40bf-b4d4-a378c573706a'] }}{{ format_currency(answers['answer1151378b-579d-40bf-b4d4-a378c573706a'], 'GBP') }}"
      );
    });

    it("should handle piped values amongst regular text", () => {
      const pipe1 = createPipe();
      const pipe2 = createPipe({
        id: "1151378b-579d-40bf-b4d4-a378c573706a",
        text: "bar",
      });
      const html = `hello ${pipe1}${pipe2} world`;

      expect(convertPipes(createContext())(html)).toEqual(
        "hello {{ answers['answer0151378b-579d-40bf-b4d4-a378c573706a'] }}{{ format_currency(answers['answer1151378b-579d-40bf-b4d4-a378c573706a'], 'GBP') }} world"
      );
    });

    describe("formatting", () => {
      // gz
      it("should format Date Range answers with fallback from", () => {
        const html = createPipe({
          id: "9151378b-579d-40bf-b4d4-a378c573706afrom",
          type: "DateRange",
        });
        expect(convertPipes(createContext())(html)).toEqual(
          "{{ format_conditional_date (answers['answer9151378b-579d-40bf-b4d4-a378c573706afrom'], metadata['2016-from']) }}"
        );
      });

      it("should not format Date Range answers with fallback from when from isn't supplied", () => {
        const html = createPipe({
          id: "5251378b-579d-40bf-b4d4-a378c573706afrom",
          type: "DateRange",
        });
        expect(convertPipes(createContext())(html)).toEqual(
          "{{ answers['answer5251378b-579d-40bf-b4d4-a378c573706afrom'] | format_date }}"
        );
      });

      it("should format Date Range answers with fallback to", () => {
        const html = createPipe({
          id: "9151378b-579d-40bf-b4d4-a378c573706ato",
          type: "DateRange",
        });
        expect(convertPipes(createContext())(html)).toEqual(
          "{{ format_conditional_date (answers['answer9151378b-579d-40bf-b4d4-a378c573706ato'], metadata['2016-to']) }}"
        );
      });

      it("should format Date Range answers with fallback to when to isn't supplied", () => {
        const html = createPipe({
          id: "5251378b-579d-40bf-b4d4-a378c573706ato",
          type: "DateRange",
        });
        expect(convertPipes(createContext())(html)).toEqual(
          "{{ answers['answer5251378b-579d-40bf-b4d4-a378c573706ato'] | format_date }}"
        );
      });

      it("should format Date Range answers with `format_date`", () => {
        const html = createPipe({ id: "2151378b-579d-40bf-b4d4-a378c573706a" });
        expect(convertPipes(createContext())(html)).toEqual(
          "{{ answers['answer2151378b-579d-40bf-b4d4-a378c573706a'] | format_date }}"
        );
      });

      it("should format Date answers with `format_date`", () => {
        const html = createPipe({ id: "3151378b-579d-40bf-b4d4-a378c573706a" });
        expect(convertPipes(createContext())(html)).toEqual(
          "{{ answers['answer3151378b-579d-40bf-b4d4-a378c573706a'] | format_date }}"
        );
      });

      it("should format Currency answers with `format_currency`", () => {
        const html = createPipe({ id: "1151378b-579d-40bf-b4d4-a378c573706a" });
        expect(convertPipes(createContext())(html)).toEqual(
          "{{ format_currency(answers['answer1151378b-579d-40bf-b4d4-a378c573706a'], 'GBP') }}"
        );
      });

      it("should format Number answers with `format_number`", () => {
        const html = createPipe({ id: "4151378b-579d-40bf-b4d4-a378c573706a" });
        expect(convertPipes(createContext())(html)).toEqual(
          "{{ answers['answer4151378b-579d-40bf-b4d4-a378c573706a'] | format_number }}"
        );
      });

      it("should format Units answers with `format_unit` and includes the unit type", () => {
        const html = createPipe({ id: "5151378b-579d-40bf-b4d4-a378c573706a" });
        expect(convertPipes(createContext())(html)).toEqual(
          "{{ format_unit('length-meter',answers['answer5151378b-579d-40bf-b4d4-a378c573706a']) }}"
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

    it("should add fallback metadata if available", () => {
      const html = createPipe({ id: "42", pipeType: "metadata" });
      const metadata = [
        { id: "42", key: "skeleton", type: "Text", fallbackKey: "cruciform" },
      ];
      expect(convertPipes(createContext(metadata))(html)).toEqual(
        "{{ first_non_empty_item(metadata['skeleton'], metadata['cruciform']) }}"
      );
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
