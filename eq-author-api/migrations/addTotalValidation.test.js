const { cloneDeep } = require("lodash");

const { CURRENCY, NUMBER } = require("../constants/answerTypes");
const { CUSTOM } = require("../constants/validationEntityTypes");
const { EQUAL } = require("../constants/validationConditions");

const addTotalValidation = require("./addTotalValidation.js");

describe("addTotalValidation", () => {
  let questionnaire;
  beforeEach(() => {
    questionnaire = {
      sections: [
        {
          pages: [
            {
              answers: [
                {
                  type: CURRENCY,
                },
                {
                  type: CURRENCY,
                },
              ],
            },
          ],
        },
      ],
    };
  });

  it("should be deterministic", () => {
    expect(addTotalValidation(cloneDeep(questionnaire))).toEqual(
      addTotalValidation(cloneDeep(questionnaire))
    );
  });

  it("should add a total validation when there are two groupable answers on the page", () => {
    expect(
      addTotalValidation(questionnaire).sections[0].pages[0]
    ).toMatchObject({
      totalValidation: {
        id: expect.any(String),
        enabled: false,
        entityType: CUSTOM,
        condition: EQUAL,
        previousAnswer: null,
        custom: null,
      },
    });
  });

  it("should not add total validation when there is more then one answer type on the page", () => {
    questionnaire.sections[0].pages[0].answers.push({ type: NUMBER });
    expect(
      addTotalValidation(questionnaire).sections[0].pages[0]
    ).toMatchObject({
      totalValidation: null,
    });
  });

  it("should not add total validation when there is only one groupable answer on the page", () => {
    questionnaire.sections[0].pages[0].answers = [{ type: NUMBER }];
    expect(
      addTotalValidation(questionnaire).sections[0].pages[0]
    ).toMatchObject({
      totalValidation: null,
    });
  });

  it("should not blow up on pages with no answers", () => {
    questionnaire.sections[0].pages[0].answers = undefined;
    expect(
      addTotalValidation(questionnaire).sections[0].pages[0].totalValidation
    ).not.toBeDefined();
  });
});
