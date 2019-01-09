const knex = require("knex")(require("../knexfile"));
const Routing2Repository = require("./Routing2Repository")(knex);
const DestinationRepository = require("./DestinationRepository")(knex);
const buildTestQuestionnaire = require("../tests/utils/buildTestQuestionnaire")(
  knex
);

describe("Routing2 Repository", () => {
  beforeAll(() => knex.migrate.latest());
  afterAll(() => knex.destroy());
  afterEach(async () => {
    await knex.transaction(async trx => {
      await trx.table("Questionnaires").delete();
    });
  });

  it("should allow insert of a Routing2", async () => {
    const questionnaire = await buildTestQuestionnaire({
      sections: [
        {
          pages: [
            {
              title: "foo"
            }
          ]
        }
      ]
    });

    const pageId = questionnaire.sections[0].pages[0].id;

    const destination = await DestinationRepository.insert();

    const routing = await Routing2Repository.insert({
      pageId,
      destinationId: destination.id
    });

    expect(routing).toMatchObject({
      id: expect.any(Number),
      pageId
    });
  });

  it("Should allow read of a routing by pageId", async () => {
    const questionnaire = await buildTestQuestionnaire({
      sections: [
        {
          pages: [
            {
              title: "foo"
            }
          ]
        }
      ]
    });

    const pageId = questionnaire.sections[0].pages[0].id;

    const destination = await DestinationRepository.insert();

    await Routing2Repository.insert({
      pageId,
      destinationId: destination.id
    });

    const routing = await Routing2Repository.getByPageId(pageId);
    expect(routing).toMatchObject({
      id: expect.any(Number),
      pageId
    });
  });

  it("should allow reading by id", async () => {
    const questionnaire = await buildTestQuestionnaire({
      sections: [
        {
          pages: [
            {
              title: "foo"
            }
          ]
        }
      ]
    });

    const pageId = questionnaire.sections[0].pages[0].id;

    const destination = await DestinationRepository.insert();

    const insertedRouting = await Routing2Repository.insert({
      pageId,
      destinationId: destination.id
    });

    const routing = await Routing2Repository.getById(insertedRouting.id);
    expect(routing).toMatchObject({
      id: expect.any(Number),
      destinationId: destination.id,
      pageId
    });
  });
});
