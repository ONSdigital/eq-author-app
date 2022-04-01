const { buildContext } = require("../../tests/utils/contextBuilder");

const {
  deleteQuestionnaire,
} = require("../../tests/utils/contextBuilder/questionnaire");

const {
  queryPage,
  deletePage,
  movePage,
} = require("../../tests/utils/contextBuilder/page");

const {
  createQuestionPage,
  updateQuestionPage,
} = require("../../tests/utils/contextBuilder/page/questionPage");

const { DATE, NUMBER, CHECKBOX } = require("../../constants/answerTypes");
const {
  getSectionByPageId,
  getPageById,
  getPages,
  getFolderById,
  getFolderByPageId,
} = require("../resolvers/utils");

const getFirstPage = (questionnaire) =>
  questionnaire.sections[0].folders[0].pages[0];

const uuidRejex =
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

describe("page", () => {
  let ctx, questionnaire;

  afterEach(async () => {
    await deleteQuestionnaire(ctx, questionnaire.id);
  });

  describe("create", () => {
    it("should create a page", async () => {
      ctx = await buildContext({
        sections: [
          {
            folders: [{}],
          },
        ],
      });
      questionnaire = ctx.questionnaire;
      const section = questionnaire.sections[0];
      const folder = section.folders[0];

      const createdPage = await createQuestionPage(ctx, {
        title: "Title",
        contactDetailsPhoneNumber: "0300 1234 931",
        contactDetailsEmailAddress: "surveys@ons.gov.uk",
        contactDetailsEmailSubject: "Change of details",
        contactDetailsIncludeRuRef: true,
        description: "Description",
        folderId: folder.id,
        descriptionEnabled: true,
        guidanceEnabled: true,
        definitionEnabled: true,
        additionalInfoEnabled: true,
      });

      expect(createdPage).toMatchObject({
        title: "Title",
        description: "Description",
        descriptionEnabled: true,
        guidanceEnabled: true,
        definitionEnabled: true,
        additionalInfoEnabled: true,
      });
    });

    it("should create at a given folder position", async () => {
      ctx = await buildContext({
        sections: [
          {
            folders: [
              {
                pages: [{}],
              },
            ],
          },
        ],
      });

      questionnaire = ctx.questionnaire;
      const targetSection = questionnaire.sections[0];
      const targetFolder = targetSection.folders[0];

      const { id: pageId } = await createQuestionPage(ctx, {
        title: "Does Blathers like insects?",
        description: "",
        folderId: targetFolder.id,
        position: 0,
      });

      const readPage = getPageById(ctx, pageId);
      const readFolder = getFolderByPageId(ctx, readPage.id);

      expect(readPage.id).toEqual(pageId);
      expect(readFolder.pages[0].id).toEqual(pageId);
    });
  });

  describe("mutate", () => {
    it("should mutate a section", async () => {
      ctx = await buildContext({
        sections: [
          {
            folders: [
              {
                pages: [
                  {
                    title: "title-1",
                    alias: "alias-1",
                    description: "description-1",
                    descriptionEnabled: true,
                    guidance: "guidance-1",
                    guidanceEnabled: true,
                    definitionLabel: "definitionLabel-1",
                    definitionContent: "definitionContent-1",
                    definitionEnabled: true,
                    additionalInfoLabel: "additionalInfoLabel-1",
                    additionalInfoContent: "additionalInfoContent-1",
                    additionalInfoEnabled: true,
                  },
                ],
              },
            ],
          },
        ],
      });
      questionnaire = ctx.questionnaire;
      const page = getFirstPage(questionnaire);
      const update = {
        id: page.id,
        title: "title-updated",
        alias: "alias-updated",
        description: "description-updated",
        descriptionEnabled: false,
        guidance: "guidance-updated",
        guidanceEnabled: false,
        definitionLabel: "definitionLabel-updated",
        definitionContent: "definitionContent-updated",
        definitionEnabled: false,
        additionalInfoLabel: "additionalInfoLabel-updated",
        additionalInfoContent: "additionalInfoContent-updated",
        additionalInfoEnabled: false,
      };
      const updatedPage = await updateQuestionPage(ctx, update);
      expect(updatedPage).toEqual(expect.objectContaining(update));
    });
  });

  describe("move", () => {
    describe("within a section", () => {
      beforeEach(async () => {
        ctx = await buildContext({
          sections: [
            {
              folders: [
                {
                  pages: [{}, {}],
                },
              ],
            },
            {
              folders: [
                {
                  pages: [{}],
                },
              ],
            },
          ],
        });
        questionnaire = ctx.questionnaire;
      });

      it("should be able to move a page later in a folder", async () => {
        const section = questionnaire.sections[0];
        const pageToMoveId = section.folders[0].pages[0].id;
        const secondPageId = section.folders[0].pages[1].id;

        expect(section.folders[0].pages[0].id).toEqual(pageToMoveId);
        expect(section.folders[0].pages[1].id).toEqual(secondPageId);

        const returnedQuestionnaire = await movePage(ctx, {
          id: pageToMoveId,
          sectionId: section.id,
          folderId: section.folders[0].id,
          position: 1,
        });

        expect(
          returnedQuestionnaire.sections[0].folders[0].pages[0].id
        ).toEqual(secondPageId);
        expect(
          returnedQuestionnaire.sections[0].folders[0].pages[1].id
        ).toEqual(pageToMoveId);
      });

      it("should be able to move a page earlier in a folder", async () => {
        const section = questionnaire.sections[0];
        const firstPageId = section.folders[0].pages[0].id;
        const pageToMoveId = section.folders[0].pages[1].id;

        expect(section.folders[0].pages[0].id).toEqual(firstPageId);
        expect(section.folders[0].pages[1].id).toEqual(pageToMoveId);

        const returnedQuestionnaire = await movePage(ctx, {
          id: pageToMoveId,
          sectionId: section.id,
          folderId: section.folders[0].id,
          position: 0,
        });

        expect(
          returnedQuestionnaire.sections[0].folders[0].pages[0].id
        ).toEqual(pageToMoveId);
        expect(
          returnedQuestionnaire.sections[0].folders[0].pages[1].id
        ).toEqual(firstPageId);
      });

      it("should replenish last disabled folder in section", async () => {
        const [firstSection, secondSection] = questionnaire.sections;
        const [sourceFolder] = secondSection.folders;

        await movePage(ctx, {
          id: sourceFolder.pages[0].id,
          sectionId: firstSection.id,
          position: 0,
        });

        const updatedSourceFolder = getFolderById(ctx, sourceFolder.id);
        expect(updatedSourceFolder.pages).toHaveLength(1);
      });

      it("should be able to move a page later in a section", async () => {
        const section = questionnaire.sections[0];
        const pageToMoveId = section.folders[0].pages[0].id;
        const secondPageId = section.folders[0].pages[1].id;

        expect(section.folders[0].pages[0].id).toEqual(pageToMoveId);
        expect(section.folders[0].pages[1].id).toEqual(secondPageId);

        const returnedQuestionnaire = await movePage(ctx, {
          id: pageToMoveId,
          sectionId: section.id,
          position: 1,
        });

        expect(
          returnedQuestionnaire.sections[0].folders[0].pages[0].id
        ).toEqual(secondPageId);
        expect(
          returnedQuestionnaire.sections[0].folders[1].pages[0].id
        ).toEqual(pageToMoveId);
      });

      it("should be able to move a page earlier in a section", async () => {
        const section = questionnaire.sections[0];
        const firstPageId = section.folders[0].pages[0].id;
        const pageToMoveId = section.folders[0].pages[1].id;

        expect(section.folders[0].pages[0].id).toEqual(firstPageId);
        expect(section.folders[0].pages[1].id).toEqual(pageToMoveId);

        const returnedQuestionnaire = await movePage(ctx, {
          id: pageToMoveId,
          sectionId: section.id,
          position: 0,
        });

        expect(
          returnedQuestionnaire.sections[0].folders[0].pages[0].id
        ).toEqual(pageToMoveId);
        expect(
          returnedQuestionnaire.sections[0].folders[1].pages[0].id
        ).toEqual(firstPageId);
      });
    });

    describe("between sections", () => {
      it("should be able to move sections", async () => {
        ctx = await buildContext({
          sections: [
            {
              folders: [
                {
                  pages: [{}, {}],
                },
              ],
            },
            {
              folders: [
                {
                  pages: [{}, {}],
                },
              ],
            },
          ],
        });
        questionnaire = ctx.questionnaire;
        const { id: pageId, sectionId: sectionIdBeforeMove } =
          getFirstPage(questionnaire);
        const { id: newSectionId } = questionnaire.sections[1];

        expect(sectionIdBeforeMove).not.toBe(newSectionId);

        await movePage(ctx, {
          id: pageId,
          sectionId: newSectionId,
          position: 1,
        });

        const { id: sectionIdAfterMove } = getSectionByPageId(ctx, pageId);

        expect(sectionIdAfterMove).not.toBe(sectionIdBeforeMove);
        expect(sectionIdAfterMove).toBe(newSectionId);
      });
    });
  });

  describe("query", () => {
    let queriedPage, setupPage;

    beforeEach(async () => {
      ctx = await buildContext({
        metadata: [{}],
        sections: [
          {
            folders: [
              {
                pages: [
                  {
                    answers: [{ type: NUMBER }],
                  },
                  {
                    title: "title-1",
                    alias: "alias-1",
                    description: "description-1",
                    guidance: "guidance-1",
                    definitionLabel: "definitionLabel-1",
                    definitionContent: "definitionContent-1",
                    additionalInfoLabel: "additionalInfoLabel-1",
                    additionalInfoContent: "additionalInfoContent-1",
                    confirmation: {},
                    answers: [{ type: DATE }],
                  },
                ],
              },
            ],
          },
        ],
      });
      questionnaire = ctx.questionnaire;
      setupPage = questionnaire.sections[0].folders[0].pages[1];
      queriedPage = await queryPage(ctx, setupPage.id);
    });

    it("should resolve page fields", () => {
      expect(queriedPage).toMatchObject({
        id: expect.any(String),
        title: expect.any(String),
        alias: expect.any(String),
        displayName: expect.any(String),
        description: expect.any(String),
        descriptionEnabled: expect.any(Boolean),
        guidance: expect.any(String),
        guidanceEnabled: expect.any(Boolean),
        pageType: expect.any(String),
        answers: expect.any(Array),
        section: expect.any(Object),
        folder: expect.any(Object),
        position: expect.any(Number),
        definitionLabel: expect.any(String),
        definitionContent: expect.any(String),
        definitionEnabled: expect.any(Boolean),
        additionalInfoLabel: expect.any(String),
        additionalInfoContent: expect.any(String),
        additionalInfoEnabled: expect.any(Boolean),
        confirmation: expect.any(Object) || null,
        routing: expect.any(Object) || null,
      });
    });

    it("should resolve pageType", () => {
      expect(queriedPage.pageType).toEqual("QuestionPage");
    });

    it("should resolve answers", () => {
      expect(queriedPage.answers).toEqual([
        expect.objectContaining({ id: setupPage.answers[0].id }),
      ]);
    });

    it("should resolve section", () => {
      expect(queriedPage.section.id).toEqual(questionnaire.sections[0].id);
    });

    it("should resolve folder", () => {
      expect(queriedPage.folder.id).toEqual(
        questionnaire.sections[0].folders[0].id
      );
    });

    it("should resolve confirmation", () => {
      expect(queriedPage.confirmation.id).toEqual(setupPage.confirmation.id);
    });
  });

  describe("delete", () => {
    it("should delete a page", async () => {
      ctx = await buildContext({ sections: [{ folders: [{ pages: [{}] }] }] });
      questionnaire = ctx.questionnaire;
      const page = questionnaire.sections[0].folders[0].pages[0];
      await deletePage(ctx, page.id);
      const deletedQuestionPage = await queryPage(ctx, page.id);
      expect(deletedQuestionPage).toBeNull();
    });

    it("should create a replacement page if final folder in section depleted of pages", async () => {
      ctx = await buildContext({ sections: [{ folders: [{ pages: [{}] }] }] });
      questionnaire = ctx.questionnaire;
      const page = questionnaire.sections[0].folders[0].pages[0];
      await deletePage(ctx, page.id);
      const pages = getPages(ctx);
      expect(pages).toHaveLength(1);
    });
  });

  describe("author validation", () => {
    it("should validate the page", async () => {
      ctx = await buildContext({
        sections: [
          {
            folders: [
              {
                pages: [
                  {
                    title: "",
                  },
                ],
              },
            ],
          },
        ],
      });
      questionnaire = ctx.questionnaire;
      const page = ctx.questionnaire.sections[0].folders[0].pages[0];

      const readPage = await queryPage(ctx, page.id);

      expect(readPage).toMatchObject({
        validationErrorInfo: {
          totalCount: 2,
          errors: [
            expect.objectContaining({ errorCode: "ERR_NO_ANSWERS" }),
            expect.objectContaining({ errorCode: "ERR_VALID_REQUIRED" }),
          ],
        },
      });
    });

    it("should include the count of errors on children", async () => {
      ctx = await buildContext({
        sections: [
          {
            folders: [
              {
                pages: [
                  {
                    answers: [
                      {
                        type: CHECKBOX,
                        options: [
                          {
                            label: "",
                            qCode: "qCode1",
                          },
                          { label: "", type: CHECKBOX, qCode: "qCode 2" },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      });

      questionnaire = ctx.questionnaire;
      const page = ctx.questionnaire.sections[0].folders[0].pages[0];

      const readPage = await queryPage(ctx, page.id);
      expect(readPage).toMatchObject({
        validationErrorInfo: {
          totalCount: 2,
          errors: [
            {
              errorCode: "ERR_VALID_REQUIRED",
              field: "label",
              id: uuidRejex,
              type: "option",
            },
            {
              errorCode: "ERR_VALID_REQUIRED",
              field: "label",
              id: uuidRejex,
              type: "option",
            },
          ],
        },
      });
    });
  });

  describe("comments", () => {
    it("should retrieve comments from context", async () => {
      ctx = await buildContext({
        sections: [
          {
            folders: [
              {
                pages: [{}],
              },
            ],
          },
        ],
      });

      questionnaire = ctx.questionnaire;
      const page = ctx.questionnaire.sections[0].folders[0].pages[0];

      ctx.comments[page.id] = [
        {
          id: "comment-1",
          commentText: "Test comment 1",
        },
        {
          id: "comment-2",
          commentText: "Test comment 2",
        },
      ];

      const updatedPage = await updateQuestionPage(ctx, {
        id: page.id,
      });

      expect(updatedPage.comments).toEqual(
        expect.arrayContaining(ctx.comments[page.id])
      );
    });
  });
});
