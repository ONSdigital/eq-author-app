const { buildContext } = require("../../tests/utils/contextBuilder");
const {
  updateQuestionnaire,
  deleteQuestionnaire,
  queryQuestionnaire,
  listQuestionnaires,
} = require("../../tests/utils/contextBuilder/questionnaire");

describe("Permissions", () => {
  let ctx;

  beforeEach(async () => {
    ctx = await buildContext({ title: "Title" });
  });

  afterEach(async () => {
    await deleteQuestionnaire(ctx, ctx.questionnaire.id);
    ctx = null;
  });

  describe("Creator", () => {
    it("should be able to update a questionnaire", async () => {
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

    describe("Admin users", () => {
      let admin, ctx2;

      beforeEach(async () => {
        admin = await buildContext(null, { admin: true });
        const result = await buildContext({ title: "Title" });
        ctx2 = result;
      });

      afterEach(() => {
        return deleteQuestionnaire(ctx2, ctx2.questionnaire.id);
      });

      it("should have write access even if not an editor", async () => {
        ctx2.user = admin.user;
        await expect(
          updateQuestionnaire(ctx2, {
            id: ctx2.questionnaire.id,
            title: "Title updated",
          })
        ).resolves.toMatchObject({
          title: "Title updated",
        });
      });

      it("should be able to see private questionnaires", async () => {
        const _private = await buildContext({
          title: "Title",
          isPublic: false,
        });
        await expect(listQuestionnaires(admin.user)).resolves.toContainEqual({
          id: _private.questionnaire.id,
        });
      });
    });
  });
});
