const knex = require("knex")(require("../knexfile"));
const buildTestQuestionnaire = require("../tests/utils/buildTestQuestionnaire")(
  knex
);
const { END_OF_QUESTIONNAIRE } = require("../constants/logicalDestinations");

const DestinationRepository = require("./DestinationRepository")(knex);

describe("Destination Repository", () => {
  beforeAll(() => knex.migrate.latest());
  afterAll(() => knex.destroy());

  afterEach(async () => {
    await knex.transaction(async trx => {
      await trx.table("Questionnaires").delete();
    });
  });

  describe("Insert", () => {
    it("should insert a destination with a default of NextPage", async () => {
      const destination = await DestinationRepository.insert();
      expect(destination).toMatchObject({
        id: expect.any(Number),
        logical: "NextPage",
        pageId: null,
        sectionId: null
      });
    });

    it("should read a destination by id", async () => {
      const destination = await DestinationRepository.insert();

      const readDestination = await DestinationRepository.getById(
        destination.id
      );

      expect(readDestination).toMatchObject(destination);
    });
  });
  describe("Update", () => {
    let pageId, sectionId;

    beforeEach(async () => {
      const questionnaire = await buildTestQuestionnaire({
        sections: [
          {
            pages: [{}]
          }
        ]
      });
      const section = questionnaire.sections[0];
      sectionId = section.id;
      pageId = section.pages[0].id;
    });

    it("should update to page destination", async () => {
      const destination = await DestinationRepository.insert();

      const updatedDestination = await DestinationRepository.update({
        id: destination.id,
        pageId
      });

      expect(updatedDestination).toMatchObject({
        id: destination.id,
        pageId,
        sectionId: null,
        logical: null
      });
    });

    it("should update to section destination", async () => {
      const destination = await DestinationRepository.insert();

      const updatedDestination = await DestinationRepository.update({
        id: destination.id,
        sectionId
      });

      expect(updatedDestination).toMatchObject({
        id: destination.id,
        pageId: null,
        sectionId,
        logical: null
      });
    });

    it("should update to logical destination", async () => {
      const destination = await DestinationRepository.insert();

      const updatedDestination = await DestinationRepository.update({
        id: destination.id,
        logical: END_OF_QUESTIONNAIRE
      });

      expect(updatedDestination).toMatchObject({
        id: destination.id,
        pageId: null,
        sectionId: null,
        logical: END_OF_QUESTIONNAIRE
      });
    });
  });
});
