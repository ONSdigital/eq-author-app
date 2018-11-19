/* eslint-disable camelcase */

const db = require("../db");

const buildTestQuestionnaire = require("../tests/utils/buildTestQuestionnaire");

const QuestionConfirmationRepository = require("./QuestionConfirmationRepository");

describe("QuestionConfirmationRepository", () => {
  let page;
  beforeAll(async () => {
    await db.migrate.latest();
    const questionnaire = await buildTestQuestionnaire({
      sections: [
        {
          pages: [
            {
              answers: []
            }
          ]
        }
      ]
    });
    page = questionnaire.sections[0].pages[0];
  });
  afterAll(() => db.destroy());
  afterEach(() => db("QuestionConfirmations").delete());

  describe("create", () => {
    it("should create and return the confirmation", async () => {
      const confirmation = await QuestionConfirmationRepository.create({
        pageId: page.id
      });
      expect(confirmation).toMatchObject({
        id: expect.any(Number),
        title: null,
        pageId: page.id,
        positiveLabel: null,
        positiveDescription: null,
        negativeLabel: null,
        negativeDescription: null,
        isDeleted: false,
        created_at: expect.any(Date),
        updated_at: expect.any(Date)
      });
    });

    it("should not allow you to create a confirmation for a question if one already exists", async () => {
      await QuestionConfirmationRepository.create({
        pageId: page.id
      });
      let thrown = false;
      try {
        await QuestionConfirmationRepository.create({
          pageId: page.id
        });
      } catch (e) {
        thrown = e;
      }
      expect(thrown).toBeTruthy();
      expect(thrown.message).toMatch(/Cannot create a question confirmation/);
    });
  });

  describe("read", () => {
    let confirmation;
    beforeEach(async () => {
      confirmation = await QuestionConfirmationRepository.create({
        pageId: page.id
      });
    });

    describe("findById", () => {
      it("should find the confirmation by id", async () => {
        const foundConfirmation = await QuestionConfirmationRepository.findById(
          confirmation.id.toString()
        );
        expect(foundConfirmation).toMatchObject(confirmation);
      });
    });

    describe("findByPageId", () => {
      it("should find the confirmation for the page", async () => {
        const foundConfirmation = await QuestionConfirmationRepository.findByPageId(
          page.id.toString()
        );
        expect(foundConfirmation).toMatchObject(confirmation);
      });
    });
  });

  describe("update", () => {
    let confirmation;
    beforeEach(async () => {
      confirmation = await QuestionConfirmationRepository.create({
        pageId: page.id
      });
    });

    it("should save the values and return the updated object", async () => {
      const updatedConfirmation = await QuestionConfirmationRepository.update({
        id: confirmation.id,
        title: "My title",
        positiveDescription: "Positivity flows",
        negativeLabel: "Negativity grows"
      });

      const foundConfirmation = await QuestionConfirmationRepository.findById(
        confirmation.id.toString()
      );

      expect(updatedConfirmation).toMatchObject({
        id: confirmation.id,
        title: "My title",
        positiveDescription: "Positivity flows",
        negativeLabel: "Negativity grows"
      });
      expect(updatedConfirmation).toMatchObject(foundConfirmation);
    });

    it("should not be possible to update isDeleted or pageId directly", async () => {
      const updatedConfirmation = await QuestionConfirmationRepository.update({
        id: confirmation.id,
        title: "My title",
        isDeleted: true,
        pageId: 2
      });

      expect(updatedConfirmation).toMatchObject({
        ...confirmation,
        title: "My title",
        isDeleted: false,
        pageId: page.id
      });
    });
  });

  describe("delete", () => {
    let confirmation;
    beforeEach(async () => {
      confirmation = await QuestionConfirmationRepository.create({
        pageId: page.id
      });
    });

    it("should delete the confirmation and return existing values", async () => {
      const deletedConfirmation = await QuestionConfirmationRepository.delete(
        confirmation
      );
      expect(deletedConfirmation).toMatchObject({
        ...confirmation,
        isDeleted: true
      });
    });

    it("should not be possible to read a deleted confirmation", async () => {
      await QuestionConfirmationRepository.delete(confirmation);
      const readConfirmation = await QuestionConfirmationRepository.findById(
        confirmation.id
      );
      expect(readConfirmation).toBeUndefined();

      const readByPage = await QuestionConfirmationRepository.findByPageId(
        page.id
      );
      expect(readByPage).toBeUndefined();
    });
  });

  describe("restore", () => {
    let confirmation;
    beforeEach(async () => {
      confirmation = await QuestionConfirmationRepository.create({
        pageId: page.id
      });
      await QuestionConfirmationRepository.delete(confirmation);
    });

    it("should restore a deleted confirmation", async () => {
      await QuestionConfirmationRepository.restore(confirmation.id);
      const readConfirmation = await QuestionConfirmationRepository.findById(
        confirmation.id
      );
      expect(readConfirmation).toMatchObject({
        id: confirmation.id,
        isDeleted: false
      });
    });

    it("should delete all those linked to the page for the restored confirmation", async () => {
      const newConfirmation = await QuestionConfirmationRepository.create({
        pageId: page.id
      });
      await QuestionConfirmationRepository.restore(confirmation.id);

      const readNewConfirmation = await QuestionConfirmationRepository.findById(
        newConfirmation.id
      );
      expect(readNewConfirmation).toBeUndefined();

      const readByPage = await QuestionConfirmationRepository.findByPageId(
        page.id
      );
      expect(readByPage).toEqual(confirmation);
    });
  });
});
