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

const setup = async () => {
  const questionnaire = await QuestionnaireRepository.insert(
    buildQuestionnaire()
  );

  const section = await SectionRepository.insert(
    buildSection({
      questionnaireId: questionnaire.id
    })
  );

  return { questionnaire, section };
};

const eachP = (items, iter) =>
  items.reduce(
    (promise, item) => promise.then(() => iter(item)),
    Promise.resolve()
  );

describe("PagesRepository", () => {
  beforeAll(() => db.migrate.latest());
  afterAll(() => db.destroy());
  afterEach(() => db("Questionnaires").delete());

  it("throws for unknown page types", () => {
    const page = buildPage({ pageType: "NotARealPageType" });
    expect(() => PageRepository.insert(page)).toThrow();
  });

  it("allows pages to be created", async () => {
    const { section } = await setup();

    const page = buildPage({ sectionId: section.id });

    const result = await PageRepository.insert(page);

    expect(result).toMatchObject(page);
    expect(result.order).not.toBeNull();
  });

  it("allows pages to be updated", async () => {
    const { section } = await setup();

    const result = await PageRepository.insert(
      buildPage({ sectionId: section.id })
    );

    await PageRepository.update({
      id: result.id,
      title: "updated title",
      pageType: "QuestionPage"
    });
    const updated = await PageRepository.getById(result.id);

    expect(updated.title).not.toEqual(result.title);
  });

  it("allow pages to be deleted", async () => {
    const { section } = await setup();
    const page = await PageRepository.insert(
      buildPage({ sectionId: section.id })
    );

    await PageRepository.remove(page.id);
    const result = await PageRepository.getById(page.id);

    expect(result).toBeUndefined();
  });

  it("allows pages to be un-deleted", async () => {
    const { section } = await setup();

    const page = await PageRepository.insert(
      buildPage({ sectionId: section.id })
    );

    await PageRepository.remove(page.id);
    await PageRepository.undelete(page.id);

    const result = await PageRepository.getById(page.id);
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

      return eachP(pages, PageRepository.insert).then(() =>
        PageRepository.findAll({ sectionId })
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
        PageRepository.move({
          id: page.id,
          sectionId: section.id,
          position: 0
        })
      );

      const updatePages = await PageRepository.findAll({
        sectionId: section.id
      });

      expect(map(updatePages, "id")).toEqual(map(reverse(pages), "id"));
    });

    it("can move pages to the end of the current section", async () => {
      const { section } = await setup();
      const pages = await createPages(section.id, 5);

      const middlePage = pages[3];

      await PageRepository.move({
        id: middlePage.id,
        sectionId: section.id,
        position: "5"
      });

      const updatePages = await PageRepository.findAll({
        sectionId: section.id
      });

      expect(last(updatePages).id).toEqual(middlePage.id);
    });

    it("can move pages forwards in the current section", async () => {
      const { section } = await setup();
      const pages = await createPages(section.id, 5);

      const firstPage = pages[0];

      await PageRepository.move({
        id: firstPage.id,
        sectionId: section.id,
        position: "3"
      });

      const updatePages = await PageRepository.findAll({
        sectionId: section.id
      });

      expect(updatePages[3].id).toEqual(firstPage.id);
    });

    it("gracefully handles position values greater than number of pages", async () => {
      const { section } = await setup();
      const results = await createPages(section.id, 5);

      await PageRepository.move({
        id: head(results).id,
        sectionId: section.id,
        position: results.length * 2
      });

      const updatedResults = await PageRepository.findAll({
        sectionId: section.id
      });

      expect(last(updatedResults).id).toBe(head(results).id);
    });

    it("gracefully handles position values less than zero", async () => {
      const { section } = await setup();
      const results = await createPages(section.id, 5);

      await PageRepository.move({
        id: last(results).id,
        sectionId: section.id,
        position: -100
      });

      const updatedResults = await PageRepository.findAll({
        sectionId: section.id
      });

      expect(head(updatedResults).id).toBe(last(results).id);
    });

    it("can move pages between sections", async () => {
      const {
        section,
        questionnaire: { id: questionnaireId }
      } = await setup();

      const section2 = await SectionRepository.insert(
        buildSection({ title: "Section 2", questionnaireId })
      );
      const results = await createPages(section.id, 3);

      await PageRepository.move({
        id: head(results).id,
        sectionId: section2.id,
        position: 0
      });

      const updatedResults = await PageRepository.findAll({
        sectionId: section2.id
      });

      expect(head(updatedResults)).toMatchObject({ id: head(results).id });
    });

    it("correctly re-orders pages as they're moved between sections", async () => {
      const {
        section,
        questionnaire: { id: questionnaireId }
      } = await setup();

      const section2 = await SectionRepository.insert(
        buildSection({ title: "Section 2", questionnaireId })
      );
      const results = await createPages(section.id, 3);

      await PageRepository.move({
        id: results[0].id,
        sectionId: section2.id,
        position: 0
      });
      await PageRepository.move({
        id: results[1].id,
        sectionId: section2.id,
        position: 0
      });

      const updatedResults = await PageRepository.findAll({
        sectionId: section2.id
      });

      expect(map(updatedResults, "id")).toEqual(
        map([results[1], results[0]], "id")
      );
    });

    it("reorders pages correctly even when there are deleted pages in a section", async () => {
      const { section } = await setup();
      const pages = await createPages(section.id, 3);

      await PageRepository.remove(pages[1].id);
      const newPage = await PageRepository.insert(
        buildPage({ title: "newest page", sectionId: section.id })
      );

      await PageRepository.move({
        id: newPage.id,
        sectionId: section.id,
        position: 0
      });

      const updatedResults = await PageRepository.findAll({
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

      await PageRepository.remove(pages[3].id);

      await PageRepository.move({
        id: pages[4].id,
        sectionId: section.id,
        position: 2
      });

      await PageRepository.undelete(pages[3].id);

      const updatedResults = await PageRepository.findAll({
        sectionId: section.id
      });

      expect(map(updatedResults, "id")).toEqual(
        map([pages[0], pages[1], pages[4], pages[2], pages[3]], "id")
      );
    });

    it("allow insertion at specific position", async () => {
      const { section } = await setup();

      const page1 = await PageRepository.insert(
        buildPage({ sectionId: section.id, position: 0 })
      );
      const page2 = await PageRepository.insert(
        buildPage({ sectionId: section.id, position: 0 })
      );
      const page3 = await PageRepository.insert(
        buildPage({ sectionId: section.id, position: 0 })
      );
      const page4 = await PageRepository.insert(
        buildPage({ sectionId: section.id, position: 0 })
      );
      const page5 = await PageRepository.insert(
        buildPage({ sectionId: section.id, position: 0 })
      );

      const updatedResults = await PageRepository.findAll({
        sectionId: section.id
      });

      expect(map(updatedResults, "id")).toEqual(
        map([page5, page4, page3, page2, page1], "id")
      );
    });

    it("allows insertion at middle of list", async () => {
      const { section } = await setup();

      const page1 = await PageRepository.insert(
        buildPage({ sectionId: section.id, position: 0 })
      );
      const page2 = await PageRepository.insert(
        buildPage({ sectionId: section.id, position: 1 })
      );
      const page3 = await PageRepository.insert(
        buildPage({ sectionId: section.id, position: 2 })
      );

      await PageRepository.move({
        id: page3.id,
        sectionId: section.id,
        position: 1
      });

      const updatedResults = await PageRepository.findAll({
        sectionId: section.id
      });

      expect(map(updatedResults, "id")).toEqual(
        map([page1, page3, page2], "id")
      );
    });

    it("makes space when `order` values converge", async () => {
      const { section } = await setup();

      const page1 = await PageRepository.insert(
        buildPage({ sectionId: section.id, position: 0 })
      );
      const page2 = await PageRepository.insert(
        buildPage({ sectionId: section.id, position: 1 })
      );

      // by moving more than 10 times the `order` values will converge, since (1000 / 2^12) < 1
      const plan = times(12, i => (i % 2 === 0 ? page1 : page2));

      await eachP(plan, page =>
        PageRepository.move({
          id: page.id,
          sectionId: section.id,
          position: 0
        })
      );

      const updatedResults = await PageRepository.findAll({
        sectionId: section.id
      });

      expect(map(updatedResults, "id")).toEqual(map([page2, page1], "id"));
    });

    it("correctly inserts at end of list", async () => {
      const { section } = await setup();

      const pages = await createPages(section.id, 3);

      await eachP(reverse(pages), page =>
        PageRepository.move({
          id: page.id,
          sectionId: section.id,
          position: 2
        })
      );

      const updatedResults = await PageRepository.findAll({
        sectionId: section.id
      });

      expect(map(updatedResults, "id")).toEqual(map(reverse(pages), "id"));
    });

    it("handles moving single page to its own position", async () => {
      const { section } = await setup();
      const pages = await createPages(section.id, 3);

      await PageRepository.move({
        id: pages[1].id,
        sectionId: section.id,
        position: 1
      });

      const updatedResults = await PageRepository.findAll({
        sectionId: section.id
      });

      expect(map(updatedResults, "id")).toEqual(map(pages, "id"));
    });

    it("handles moving only page in a section", async () => {
      const { section } = await setup();
      const pages = await createPages(section.id, 1);

      await PageRepository.move({
        id: pages[0].id,
        sectionId: section.id,
        position: 1000
      });

      const updatedResults = await PageRepository.findAll({
        sectionId: section.id
      });

      expect(map(updatedResults, "id")).toEqual(map(pages, "id"));
    });

    it("can get position for a single page", async () => {
      const { section } = await setup();
      const pages = await createPages(section.id, 5);

      const position = await PageRepository.getPosition({ id: pages[2].id });

      expect(position).toBe(pages[2].position);
    });
  });

  describe("Duplicating a page", () => {
    it("copies the necessary data into the duplicate from the original", async () => {
      const { section } = await setup();

      const page = buildPage({ sectionId: section.id });
      const result = await PageRepository.insert(page);

      const duplicatePage = await PageRepository.duplicatePage(result.id, 1);

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
      const result = await PageRepository.insert(page);

      const duplicatePage = await PageRepository.duplicatePage(result.id, 1);

      const startsWithCopyOf = duplicatePage.alias.startsWith("Copy of");

      expect(startsWithCopyOf).toBe(true);
    });

    it("prepends 'Copy of' to the question title of the copy when duplicating a page", async () => {
      const { section } = await setup();

      const page = buildPage({ sectionId: section.id });
      const result = await PageRepository.insert(page);

      const duplicatePage = await PageRepository.duplicatePage(result.id, 1);

      const startsWithCopyOf = duplicatePage.title.startsWith("Copy of");

      expect(startsWithCopyOf).toBe(true);
    });

    it("is able to insert the copied page below the original", async () => {
      const { section } = await setup();

      const pageOne = await PageRepository.insert(
        buildPage({ sectionId: section.id })
      );
      const positionOfPageOne = await PageRepository.getPosition(pageOne);

      const pageTwo = await PageRepository.duplicatePage(
        pageOne.id,
        parseInt(positionOfPageOne) + 1
      );

      const positionOfPageTwo = await PageRepository.getPosition(pageTwo);

      expect(parseInt(positionOfPageOne) + 1).toEqual(
        parseInt(positionOfPageTwo)
      );
    });

    it("maintains the order of other questions within the section after duplicating a page", async () => {
      const { section } = await setup();

      const pageOne = await PageRepository.insert(
        buildPage({ sectionId: section.id })
      );
      const pageTwo = await PageRepository.insert(
        buildPage({ sectionId: section.id })
      );

      const pageThree = await PageRepository.duplicatePage(pageOne.id, 1);

      const positionOfPageOne = await PageRepository.getPosition(pageOne);
      const positionOfPageTwo = await PageRepository.getPosition(pageTwo);
      const positionOfPageThree = await PageRepository.getPosition(pageThree);

      expect(parseInt(positionOfPageOne) + 1).toEqual(
        parseInt(positionOfPageThree)
      );
      expect(parseInt(positionOfPageTwo) - 1).toEqual(
        parseInt(positionOfPageThree)
      );
    });
  });
});
