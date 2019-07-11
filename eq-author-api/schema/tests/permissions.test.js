const { buildContext } = require("../../tests/utils/contextBuilder");
const {
  updateQuestionnaire,
  deleteQuestionnaire,
  queryQuestionnaire,
} = require("../../tests/utils/contextBuilder/questionnaire");

describe("Permissions", () => {
  let ctx;
  afterEach(async () => {
    await deleteQuestionnaire(ctx, ctx.questionnaire.id);
    ctx = null;
  });

  describe("Creator", () => {
    it("should be able to update a questionnaire", async () => {
      ctx = await buildContext({ title: "Title" });

      const result = await updateQuestionnaire(ctx, {
        id: ctx.questionnaire.id,
        title: "Title updated",
      });
      expect(result).toMatchObject({
        title: "Title updated",
      });
    });
  });

  describe("Other users", () => {
    let user, creator;
    beforeEach(async () => {
      const ctx2 = await buildContext(null);
      user = ctx2.user;
      ctx = await buildContext({ title: "Title" });
      creator = ctx.user;
    });
    afterEach(() => {
      user = null;
      ctx.user = creator;
    });

    describe("Standard user", () => {
      beforeEach(() => {
        ctx.user = user;
      });

      it("should be possible to read a questionnaire", async () => {
        const result = await queryQuestionnaire(ctx);
        expect(result).toMatchObject({ title: "Title", permission: "Read" });
      });

      it("should fail to update the questionnaire", async () => {
        expect(
          updateQuestionnaire(ctx, {
            id: ctx.questionnaire.id,
            title: "Title updated",
          })
        ).rejects.toThrowError(/User does not have write permission/);
      });

      it("should fail to delete the questionnaire", async () => {
        expect(
          deleteQuestionnaire(ctx, ctx.questionnaire.id)
        ).rejects.toThrowError(/User does not have write permission/);
      });
    });

    describe("Editor", () => {
      beforeEach(async () => {
        // Add user as an editor
        await updateQuestionnaire(ctx, {
          id: ctx.questionnaire.id,
          editors: [user.id],
        });
      });

      it("should be possible to read a questionnaire", async () => {
        const result = await queryQuestionnaire(ctx);
        expect(result).toMatchObject({
          title: "Title",
          permission: "Write",
          editors: [expect.objectContaining({ id: user.id })],
        });
      });

      it("should be able to update a questionnaire", async () => {
        ctx.user = user;
        const result = await updateQuestionnaire(ctx, {
          id: ctx.questionnaire.id,
          title: "Title updated",
        });
        expect(result).toMatchObject({
          title: "Title updated",
        });
      });

      it("should fail to update the questionnaire once they are removed as an editor", async () => {
        ctx.user = creator;
        await updateQuestionnaire(ctx, {
          id: ctx.questionnaire.id,
          editors: [],
        });

        ctx.user = user;
        expect(
          updateQuestionnaire(ctx, {
            id: ctx.questionnaire.id,
            title: "Title updated",
          })
        ).rejects.toThrowError(/User does not have write permission/);
      });
    });
  });
});
