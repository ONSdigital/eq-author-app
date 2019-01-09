const knex = require("knex")(require("../knexfile"));
const buildTestQuestionnaire = require("../tests/utils/buildTestQuestionnaire")(
  knex
);

const SelectedOptionsRepository = require("./SelectedOptions2Repository")(knex);

describe("ChoseOptions Repository", () => {
  beforeAll(() => knex.migrate.latest());
  afterAll(() => knex.destroy());

  afterEach(async () => {
    await knex.transaction(async trx => {
      await trx.table("Questionnaires").delete();
    });
  });

  let rightSide, answer;
  beforeEach(async () => {
    const questionnaire = await buildTestQuestionnaire({
      sections: [
        {
          pages: [
            {
              answers: [
                {
                  type: "Radio",
                  options: [{ label: "1" }, { label: "2" }]
                }
              ],
              routing: {
                rules: [
                  {
                    expressionGroup: {
                      expressions: [
                        {
                          right: { type: "SelectedOptions" }
                        }
                      ]
                    }
                  }
                ]
              }
            }
          ]
        }
      ]
    });
    answer = questionnaire.sections[0].pages[0].answers[0];
    rightSide =
      questionnaire.sections[0].pages[0].routing.rules[0].expressionGroup
        .expressions[0].right;
  });

  describe("insert", () => {
    it("will insert a number of option ids", async () => {
      const selectedOption = await SelectedOptionsRepository.insert({
        sideId: rightSide.id,
        optionId: answer.options[0].id
      });

      expect(selectedOption).toMatchObject({
        sideId: rightSide.id,
        optionId: answer.options[0].id
      });
    });
  });

  describe("getBySideId", () => {
    it("will retrieve the selected id using the sideId", async () => {
      await SelectedOptionsRepository.insert({
        sideId: rightSide.id,
        optionId: answer.options[0].id
      });
      await SelectedOptionsRepository.insert({
        sideId: rightSide.id,
        optionId: answer.options[1].id
      });

      const selectedOptions = await SelectedOptionsRepository.getBySideId(
        rightSide.id
      );

      expect(selectedOptions).toEqual([
        {
          sideId: rightSide.id,
          optionId: answer.options[0].id
        },
        {
          sideId: rightSide.id,
          optionId: answer.options[1].id
        }
      ]);
    });
  });

  describe("deleteBySideId", () => {
    it("will delete all selected options for a given side Id", async () => {
      await SelectedOptionsRepository.insert({
        sideId: rightSide.id,
        optionId: answer.options[0].id
      });

      await SelectedOptionsRepository.deleteBySideId(rightSide.id);
      const remainingOptions = await SelectedOptionsRepository.getBySideId(
        rightSide.id
      );
      expect(remainingOptions.length).toEqual(0);
    });
  });
});
