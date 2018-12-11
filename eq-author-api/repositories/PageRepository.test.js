const db = require("../db");
const QuestionnaireRepository = require("../repositories/QuestionnaireRepository");
const SectionRepository = require("../repositories/SectionRepository");
const PageRepository = require("../repositories/PageRepository");
const { last, head, map, times, omit, parseInt } = require("lodash");

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
  description: "section description",
  ...section
});

const buildPage = page => ({
  alias: "Page alias",
  title: "Test page",
  description: "page description",
  guidance: "page description",
  pageType: "QuestionPage",
  ...page
});

const eachP = (items, iter) =>
  items.reduce(
    (promise, item) => promise.then(() => iter(item)),
    Promise.resolve()
  );

describe("PagesRepository", () => {
  let knex;
  let questionnaireRepository;
  let sectionRepository;
  let pageRepository;

  beforeAll(async () => {
    const conf = await db(process.env.DB_SECRET_ID);
    knex = require("knex")(conf);
    await knex.migrate.latest();
    questionnaireRepository = QuestionnaireRepository(knex);
    sectionRepository = SectionRepository(knex);
    pageRepository = PageRepository(knex);
  });
  afterEach(() => knex("Questionnaires").delete());

  const setup = async () => {
    const questionnaire = await questionnaireRepository.insert(
      buildQuestionnaire()
    );

    const section = await sectionRepository.insert(
      buildSection({
        questionnaireId: questionnaire.id
      })
    );

    return { questionnaire, section };
  };

  it("throws for unknown page types", () => {
    const page = buildPage({ pageType: "NotARealPageType" });
    expect(() => pageRepository.insert(page)).toThrow();
  });

  it("allows pages to be created", async () => {
    const { section } = await setup();

    const page = buildPage({ sectionId: section.id });

    const result = await pageRepository.insert(page);

    expect(result).toMatchObject(page);
    expect(result.order).not.toBeNull();
  });

  it("allows pages to be updated", async () => {
    const { section } = await setup();

    const result = await pageRepository.insert(
      buildPage({ sectionId: section.id })
    );

    await pageRepository.update({
      id: result.id,
      title: "updated title",
      pageType: "QuestionPage"
    });
    const updated = await pageRepository.getById(result.id);

    expect(updated.title).not.toEqual(result.title);
  });

  it("allow pages to be deleted", async () => {
    const { section } = await setup();
    const page = await pageRepository.insert(
      buildPage({ sectionId: section.id })
    );

    await pageRepository.remove(page.id);
    const result = await pageRepository.getById(page.id);

    expect(result).toBeUndefined();
  });

  it("allows pages to be un-deleted", async () => {
    const { section } = await setup();

    const page = await pageRepository.insert(
      buildPage({ sectionId: section.id })
    );

    await pageRepository.remove(page.id);
    await pageRepository.undelete(page.id);

    const result = await pageRepository.getById(page.id);
    expect(result).toMatchObject(page);
  });

  describe("re-ordering", () => {
    const createPages = (sectionId, numberOfPages) => {
      const pages = times(numberOfPages, i =>
        buildPage({
          title: `Page ${i}`,
          sectionId
        })
      );

      return eachP(pages, pageRepository.insert).then(() =>
        pageRepository.findAll({ sectionId })
      );
    };

    it("should add pages in correct order", async () => {
      const { section } = await setup();
      const results = await createPages(section.id, 5);

      expect(results).toHaveLength(5);

      results.forEach((result, i) => {
        expect(result).toMatchObject({ title: `Page ${i}` });
        expect(result.position).toEqual(String(i));
      });
    });

    it("can move pages backwards within same section", async () => {
      const { section } = await setup();
      const pages = await createPages(section.id, 5);

      // reverse the list
      await eachP(pages, page =>
        pageRepository.move({
          id: page.id,
          sectionId: section.id,
          position: 0
        })
      );

      const updatePages = await pageRepository.findAll({
        sectionId: section.id
      });

      expect(map(updatePages, "id")).toEqual(map(reverse(pages), "id"));
    });

    it("can move pages to the end of the current section", async () => {
      const { section } = await setup();
      const pages = await createPages(section.id, 5);

      const middlePage = pages[3];

      await pageRepository.move({
        id: middlePage.id,
        sectionId: section.id,
        position: "5"
      });

      const updatePages = await pageRepository.findAll({
        sectionId: section.id
      });

      expect(last(updatePages).id).toEqual(middlePage.id);
    });

    it("can move pages forwards in the current section", async () => {
      const { section } = await setup();
      const pages = await createPages(section.id, 5);

      const firstPage = pages[0];

      await pageRepository.move({
        id: firstPage.id,
        sectionId: section.id,
        position: "3"
      });

      const updatePages = await pageRepository.findAll({
        sectionId: section.id
      });

      expect(updatePages[3].id).toEqual(firstPage.id);
    });

    it("gracefully handles position values greater than number of pages", async () => {
      const { section } = await setup();
      const results = await createPages(section.id, 5);

      await pageRepository.move({
        id: head(results).id,
        sectionId: section.id,
        position: results.length * 2
      });

      const updatedResults = await pageRepository.findAll({
        sectionId: section.id
      });

      expect(last(updatedResults).id).toBe(head(results).id);
    });

    it("gracefully handles position values less than zero", async () => {
      const { section } = await setup();
      const results = await createPages(section.id, 5);

      await pageRepository.move({
        id: last(results).id,
        sectionId: section.id,
        position: -100
      });

      const updatedResults = await pageRepository.findAll({
        sectionId: section.id
      });

      expect(head(updatedResults).id).toBe(last(results).id);
    });

    it("can move pages between sections", async () => {
      const {
        section,
        questionnaire: { id: questionnaireId }
      } = await setup();

      const section2 = await sectionRepository.insert(
        buildSection({ title: "Section 2", questionnaireId })
      );
      const results = await createPages(section.id, 3);

      await pageRepository.move({
        id: head(results).id,
        sectionId: section2.id,
        position: 0
      });

      const updatedResults = await pageRepository.findAll({
        sectionId: section2.id
      });

      expect(head(updatedResults)).toMatchObject({ id: head(results).id });
    });

    it("correctly re-orders pages as they're moved between sections", async () => {
      const {
        section,
        questionnaire: { id: questionnaireId }
      } = await setup();

      const section2 = await sectionRepository.insert(
        buildSection({ title: "Section 2", questionnaireId })
      );
      const results = await createPages(section.id, 3);

      await pageRepository.move({
        id: results[0].id,
        sectionId: section2.id,
        position: 0
      });
      await pageRepository.move({
        id: results[1].id,
        sectionId: section2.id,
        position: 0
      });

      const updatedResults = await pageRepository.findAll({
        sectionId: section2.id
      });

      expect(map(updatedResults, "id")).toEqual(
        map([results[1], results[0]], "id")
      );
    });

    it("reorders pages correctly even when there are deleted pages in a section", async () => {
      const { section } = await setup();
      const pages = await createPages(section.id, 3);

      await pageRepository.remove(pages[1].id);
      const newPage = await pageRepository.insert(
        buildPage({ title: "newest page", sectionId: section.id })
      );

      await pageRepository.move({
        id: newPage.id,
        sectionId: section.id,
        position: 0
      });

      const updatedResults = await pageRepository.findAll({
        sectionId: section.id
      });

      expect(updatedResults).not.toContainEqual(
        expect.objectContaining({ id: pages[1].id })
      );

      expect(map(updatedResults, "id")).toEqual(
        map([newPage, pages[0], pages[2]], "id")
      );
    });

    it("returns deleted pages to correct position when un-deleted, even after moves ", async () => {
      const { section } = await setup();
      const pages = await createPages(section.id, 5);

      await pageRepository.remove(pages[3].id);

      await pageRepository.move({
        id: pages[4].id,
        sectionId: section.id,
        position: 2
      });

      await pageRepository.undelete(pages[3].id);

      const updatedResults = await pageRepository.findAll({
        sectionId: section.id
      });

      expect(map(updatedResults, "id")).toEqual(
        map([pages[0], pages[1], pages[4], pages[2], pages[3]], "id")
      );
    });

    it("allow insertion at specific position", async () => {
      const { section } = await setup();

      const page1 = await pageRepository.insert(
        buildPage({ sectionId: section.id, position: 0 })
      );
      const page2 = await pageRepository.insert(
        buildPage({ sectionId: section.id, position: 0 })
      );
      const page3 = await pageRepository.insert(
        buildPage({ sectionId: section.id, position: 0 })
      );
      const page4 = await pageRepository.insert(
        buildPage({ sectionId: section.id, position: 0 })
      );
      const page5 = await pageRepository.insert(
        buildPage({ sectionId: section.id, position: 0 })
      );

      const updatedResults = await pageRepository.findAll({
        sectionId: section.id
      });

      expect(map(updatedResults, "id")).toEqual(
        map([page5, page4, page3, page2, page1], "id")
      );
    });

    it("allows insertion at middle of list", async () => {
      const { section } = await setup();

      const page1 = await pageRepository.insert(
        buildPage({ sectionId: section.id, position: 0 })
      );
      const page2 = await pageRepository.insert(
        buildPage({ sectionId: section.id, position: 1 })
      );
      const page3 = await pageRepository.insert(
        buildPage({ sectionId: section.id, position: 2 })
      );

      await pageRepository.move({
        id: page3.id,
        sectionId: section.id,
        position: 1
      });

      const updatedResults = await pageRepository.findAll({
        sectionId: section.id
      });

      expect(map(updatedResults, "id")).toEqual(
        map([page1, page3, page2], "id")
      );
    });

    it("makes space when `order` values converge", async () => {
      const { section } = await setup();

      const page1 = await pageRepository.insert(
        buildPage({ sectionId: section.id, position: 0 })
      );
      const page2 = await pageRepository.insert(
        buildPage({ sectionId: section.id, position: 1 })
      );

      // by moving more than 10 times the `order` values will converge, since (1000 / 2^12) < 1
      const plan = times(12, i => (i % 2 === 0 ? page1 : page2));

      await eachP(plan, page =>
        pageRepository.move({
          id: page.id,
          sectionId: section.id,
          position: 0
        })
      );

      const updatedResults = await pageRepository.findAll({
        sectionId: section.id
      });

      expect(map(updatedResults, "id")).toEqual(map([page2, page1], "id"));
    });

    it("correctly inserts at end of list", async () => {
      const { section } = await setup();

      const pages = await createPages(section.id, 3);

      await eachP(reverse(pages), page =>
        pageRepository.move({
          id: page.id,
          sectionId: section.id,
          position: 2
        })
      );

      const updatedResults = await pageRepository.findAll({
        sectionId: section.id
      });

      expect(map(updatedResults, "id")).toEqual(map(reverse(pages), "id"));
    });

    it("handles moving single page to its own position", async () => {
      const { section } = await setup();
      const pages = await createPages(section.id, 3);

      await pageRepository.move({
        id: pages[1].id,
        sectionId: section.id,
        position: 1
      });

      const updatedResults = await pageRepository.findAll({
        sectionId: section.id
      });

      expect(map(updatedResults, "id")).toEqual(map(pages, "id"));
    });

    it("handles moving only page in a section", async () => {
      const { section } = await setup();
      const pages = await createPages(section.id, 1);

      await pageRepository.move({
        id: pages[0].id,
        sectionId: section.id,
        position: 1000
      });

      const updatedResults = await pageRepository.findAll({
        sectionId: section.id
      });

      expect(map(updatedResults, "id")).toEqual(map(pages, "id"));
    });

    it("can get position for a single page", async () => {
      const { section } = await setup();
      const pages = await createPages(section.id, 5);

      const position = await pageRepository.getPosition({ id: pages[2].id });

      expect(position).toBe(pages[2].position);
    });
  });

  describe("Duplicating a page", () => {
    it("copies the necessary data into the duplicate from the original", async () => {
      const { section } = await setup();

      const page = buildPage({ sectionId: section.id });
      const result = await pageRepository.insert(page);

      const duplicatePage = await pageRepository.duplicatePage(result.id, 1);

      const fieldsToOmit = [
        "id",
        "order",
        "alias",
        "title",
        "createdAt",
        "updatedAt"
      ];

      expect(omit(result, fieldsToOmit)).toMatchObject(
        omit(duplicatePage, fieldsToOmit)
      );
    });

    it("prepends 'Copy of' to the question alias of the copy when duplicating a page", async () => {
      const { section } = await setup();

      const page = buildPage({ sectionId: section.id });
      const result = await pageRepository.insert(page);

      const duplicatePage = await pageRepository.duplicatePage(result.id, 1);

      const startsWithCopyOf = duplicatePage.alias.startsWith("Copy of");

      expect(startsWithCopyOf).toBe(true);
    });

    it("prepends 'Copy of' to the question title of the copy when duplicating a page", async () => {
      const { section } = await setup();

      const page = buildPage({ sectionId: section.id });
      const result = await pageRepository.insert(page);

      const duplicatePage = await pageRepository.duplicatePage(result.id, 1);

      const startsWithCopyOf = duplicatePage.title.startsWith("Copy of");

      expect(startsWithCopyOf).toBe(true);
    });

    it("is able to insert the copied page below the original", async () => {
      const { section } = await setup();

      const pageOne = await pageRepository.insert(
        buildPage({ sectionId: section.id })
      );
      const positionOfPageOne = await pageRepository.getPosition(pageOne);

      const pageTwo = await pageRepository.duplicatePage(
        pageOne.id,
        parseInt(positionOfPageOne) + 1
      );

      const positionOfPageTwo = await pageRepository.getPosition(pageTwo);

      expect(parseInt(positionOfPageOne) + 1).toEqual(
        parseInt(positionOfPageTwo)
      );
    });

    it("maintains the order of other questions within the section after duplicating a page", async () => {
      const { section } = await setup();

      const pageOne = await pageRepository.insert(
        buildPage({ sectionId: section.id })
      );
      const pageTwo = await pageRepository.insert(
        buildPage({ sectionId: section.id })
      );

      const pageThree = await pageRepository.duplicatePage(pageOne.id, 1);

      const positionOfPageOne = await pageRepository.getPosition(pageOne);
      const positionOfPageTwo = await pageRepository.getPosition(pageTwo);
      const positionOfPageThree = await pageRepository.getPosition(pageThree);

      expect(parseInt(positionOfPageOne) + 1).toEqual(
        parseInt(positionOfPageThree)
      );
      expect(parseInt(positionOfPageTwo) - 1).toEqual(
        parseInt(positionOfPageThree)
      );
    });
  });
});
