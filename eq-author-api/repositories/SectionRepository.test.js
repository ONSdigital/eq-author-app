const db = require("../db");
const QuestionnaireRepository = require("../repositories/QuestionnaireRepository");
const SectionRepository = require("../repositories/SectionRepository");
const { last, head, map, toString, times } = require("lodash");

const reverse = array => array.slice().reverse();

const buildQuestionnaire = questionnaire => ({
  title: "Test questionnaire",
  surveyId: "1",
  theme: "default",
  legalBasis: "Voluntary",
  navigation: false,
  createdBy: "foo",
  ...questionnaire
});

const buildSection = section => ({
  title: "Test section",
  alias: "Test alias",
  introductionTitle: null,
  introductionContent: null,
  introductionEnabled: false,
  ...section
});

const setup = async () => {
  const questionnaire = await QuestionnaireRepository.insert(
    buildQuestionnaire()
  );

  return { questionnaire };
};

const eachP = (items, iter) =>
  items.reduce(
    (promise, item) => promise.then(() => iter(item)),
    Promise.resolve()
  );

describe("SectionRepository", () => {
  beforeAll(() => db.migrate.latest());
  afterAll(() => db.destroy());
  afterEach(() => db("Questionnaires").delete());

  it("allows sections to be created", async () => {
    const {
      questionnaire: { id: questionnaireId }
    } = await setup();

    const section = buildSection({ questionnaireId: questionnaireId });
    const result = await SectionRepository.insert(section);

    expect(result).toMatchObject(section);
    expect(result.order).not.toBeNull();
  });

  it("allows sections to be updated", async () => {
    const {
      questionnaire: { id: questionnaireId }
    } = await setup();

    const section = await SectionRepository.insert(
      buildSection({ questionnaireId: questionnaireId })
    );

    const update = {
      id: section.id,
      title: "updated title",
      alias: "updated alias",
      introductionTitle: "updated intro title",
      introductionContent: "updated intro content",
      introductionEnabled: true
    };

    await SectionRepository.update(update);
    const result = await SectionRepository.getById(section.id);

    expect(result).toMatchObject(update);
  });

  it("allow sections to be deleted", async () => {
    const {
      questionnaire: { id: questionnaireId }
    } = await setup();
    const section = await SectionRepository.insert(
      buildSection({ questionnaireId: questionnaireId })
    );

    await SectionRepository.remove(section.id);
    const result = await SectionRepository.getById(section.id);

    expect(result).toBeUndefined();
  });

  it("allows sections to be un-deleted", async () => {
    const {
      questionnaire: { id: questionnaireId }
    } = await setup();

    const section = await SectionRepository.insert(
      buildSection({ questionnaireId: questionnaireId })
    );

    await SectionRepository.remove(section.id);
    await SectionRepository.undelete(section.id);

    const result = await SectionRepository.getById(section.id);
    expect(result).toMatchObject(section);
  });

  it("can get section position", async () => {
    const {
      questionnaire: { id: questionnaireId }
    } = await setup();

    const result = await SectionRepository.insert(
      buildSection({ questionnaireId: questionnaireId })
    );

    const position = await SectionRepository.getPosition(result);
    expect(position).toEqual(0);
  });

  it("throws if asked for the position of an invalid id", async () => {
    let error = undefined;
    try {
      await SectionRepository.getPosition({ id: 999900 });
    } catch (e) {
      error = e;
    }
    expect(error).not.toBeUndefined();
  });

  it("can get section count ", async () => {
    const {
      questionnaire: { id: questionnaireId }
    } = await setup();

    await SectionRepository.insert(buildSection({ questionnaireId }));

    const count = await SectionRepository.getSectionCount(questionnaireId);
    expect(count).toEqual("1");
  });

  describe("re-ordering", () => {
    const createSections = (questionnaireId, numberOfPages) => {
      const sections = times(numberOfPages, i =>
        buildSection({ title: `Section ${i}`, questionnaireId })
      );

      return eachP(sections, SectionRepository.insert).then(() =>
        SectionRepository.findAll({ questionnaireId })
      );
    };

    it("should add sections in correct order", async () => {
      const {
        questionnaire: { id: questionnaireId }
      } = await setup();

      const results = await createSections(questionnaireId, 5);

      expect(results).toHaveLength(5);

      results.forEach((result, i) => {
        expect(result).toMatchObject({ title: `Section ${i}` });
        expect(result.position).toEqual(toString(i));
      });
    });

    it("can move sections within a questionnaire", async () => {
      const {
        questionnaire: { id: questionnaireId }
      } = await setup();

      const sections = await createSections(questionnaireId, 5);

      // reverse the list
      await eachP(sections, ({ id, questionnaireId }) =>
        SectionRepository.move({
          id: id,
          questionnaireId: questionnaireId,
          position: 0
        })
      );

      const updatedSections = await SectionRepository.findAll({
        questionnaireId
      });

      expect(map(updatedSections, "id")).toEqual(map(reverse(sections), "id"));
    });

    it("can move sections forwards", async () => {
      const {
        questionnaire: { id: questionnaireId }
      } = await setup();

      const sections = await createSections(questionnaireId, 5);

      const firstSection = sections[0];

      await SectionRepository.move({
        id: firstSection.id,
        questionnaireId: questionnaireId,
        position: "3"
      });

      const updatedSections = await SectionRepository.findAll({
        questionnaireId
      });

      expect(updatedSections[3].id).toEqual(firstSection.id);
    });

    it("gracefully handles position values greater than number of pages", async () => {
      const {
        questionnaire: { id: questionnaireId }
      } = await setup();

      const results = await createSections(questionnaireId, 5);

      await SectionRepository.move({
        id: head(results).id,
        questionnaireId: questionnaireId,
        position: 10
      });

      const updatedResults = await SectionRepository.findAll({
        questionnaireId: questionnaireId
      });

      expect(last(updatedResults).id).toBe(head(results).id);
    });

    it("gracefully handles position values less than zero", async () => {
      const {
        questionnaire: { id: questionnaireId }
      } = await setup();

      const results = await createSections(questionnaireId, 5);

      await SectionRepository.move({
        id: last(results).id,
        questionnaireId: questionnaireId,
        position: -100
      });

      const updatedResults = await SectionRepository.findAll({
        questionnaireId: questionnaireId
      });

      expect(head(updatedResults).id).toBe(last(results).id);
    });

    it("reorders sections correctly even when there are deleted sections", async () => {
      const {
        questionnaire: { id: questionnaireId }
      } = await setup();

      const sections = await createSections(questionnaireId, 3);

      await SectionRepository.remove(sections[1].id);

      const newSection = await SectionRepository.insert(
        buildSection({ title: "new section", questionnaireId: questionnaireId })
      );

      await SectionRepository.move({
        id: newSection.id,
        questionnaireId: questionnaireId,
        position: 0
      });

      const updatedResults = await SectionRepository.findAll({
        questionnaireId: questionnaireId
      });

      expect(updatedResults).not.toContainEqual(
        expect.objectContaining({ id: sections[1].id })
      );

      expect(map(updatedResults, "id")).toEqual(
        map([newSection, sections[0], sections[2]], "id")
      );
    });

    it("returns deleted section to correct position when un-deleted ", async () => {
      const {
        questionnaire: { id: questionnaireId }
      } = await setup();

      const sections = await createSections(questionnaireId, 5);

      await SectionRepository.remove(sections[3].id);

      await SectionRepository.move({
        id: sections[4].id,
        questionnaireId: questionnaireId,
        position: 2
      });

      await SectionRepository.undelete(sections[3].id);

      const updatedResults = await SectionRepository.findAll({
        questionnaireId: questionnaireId
      });

      expect(map(updatedResults, "id")).toEqual(
        map(
          [sections[0], sections[1], sections[4], sections[2], sections[3]],
          "id"
        )
      );
    });

    it("allow insertion at specific position", async () => {
      const {
        questionnaire: { id: questionnaireId }
      } = await setup();

      const section1 = await SectionRepository.insert(
        buildSection({ questionnaireId: questionnaireId, position: 0 })
      );
      const section2 = await SectionRepository.insert(
        buildSection({ questionnaireId: questionnaireId, position: 0 })
      );
      const section3 = await SectionRepository.insert(
        buildSection({ questionnaireId: questionnaireId, position: 0 })
      );
      const section4 = await SectionRepository.insert(
        buildSection({ questionnaireId: questionnaireId, position: 0 })
      );
      const section5 = await SectionRepository.insert(
        buildSection({ questionnaireId: questionnaireId, position: 0 })
      );

      const updatedResults = await SectionRepository.findAll({
        questionnaireId: questionnaireId
      });

      expect(map(updatedResults, "id")).toEqual(
        map([section5, section4, section3, section2, section1], "id")
      );
    });

    it("allows insertion at middle of list", async () => {
      const {
        questionnaire: { id: questionnaireId }
      } = await setup();

      const section1 = await SectionRepository.insert(
        buildSection({ questionnaireId: questionnaireId, position: 0 })
      );
      const section2 = await SectionRepository.insert(
        buildSection({ questionnaireId: questionnaireId, position: 1 })
      );
      const section3 = await SectionRepository.insert(
        buildSection({ questionnaireId: questionnaireId, position: 2 })
      );

      await SectionRepository.move({
        id: section3.id,
        questionnaireId: questionnaireId,
        position: 1
      });

      const updatedResults = await SectionRepository.findAll({
        questionnaireId: questionnaireId
      });

      expect(map(updatedResults, "id")).toEqual(
        map([section1, section3, section2], "id")
      );
    });

    it("correctly inserts at end of list", async () => {
      const {
        questionnaire: { id: questionnaireId }
      } = await setup();

      const sections = await createSections(questionnaireId, 3);

      await eachP(reverse(sections), section =>
        SectionRepository.move({
          id: section.id,
          questionnaireId: questionnaireId,
          position: 2
        })
      );

      const updatedResults = await SectionRepository.findAll({
        questionnaireId: questionnaireId
      });

      expect(map(updatedResults, "id")).toEqual(map(reverse(sections), "id"));
    });
  });

  describe("Duplication", () => {
    it("should duplicate a section", async () => {
      const {
        questionnaire: { id: questionnaireId }
      } = await setup();

      const section = await SectionRepository.insert(
        buildSection({ questionnaireId })
      );
      const positionOfSection = await SectionRepository.getPosition(section);

      const duplicateSection = await SectionRepository.duplicateSection(
        section.id,
        positionOfSection
      );
      expect(duplicateSection).toMatchObject({
        title: `Copy of ${section.title}`,
        alias: `Copy of ${section.alias}`
      });
    });
  });
});
