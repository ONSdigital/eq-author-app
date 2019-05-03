const { buildClaims, getLaunchUrl } = require("./launch");
const { last } = require("lodash");

const { buildContext } = require("../tests/utils/contextBuilder");
const {
  deleteQuestionnaire,
} = require("../tests/utils/contextBuilder/questionnaire");
const { updateMetadata } = require("../tests/utils/contextBuilder/metadata");

const { TEXT } = require("../constants/metadataTypes");

describe("launcher middleware", () => {
  let ctx, questionnaire, metadata, res, req, next;

  beforeEach(async () => {
    ctx = await buildContext({
      metadata: [{}],
    });
    questionnaire = ctx.questionnaire;
    metadata = last(questionnaire.metadata);
    req = { params: { questionnaireId: questionnaire.id } };
    res = {
      redirect: jest.fn(),
    };
    next = jest.fn();
  });

  afterEach(async () => {
    await deleteQuestionnaire(ctx, questionnaire.id);
  });

  it("should call a redirect with a jwt", async () => {
    await updateMetadata(ctx, {
      id: metadata.id,
      key: "foobar",
      type: TEXT,
      textValue: "textValue",
    });
    await getLaunchUrl(req, res, next);
    expect(res.redirect).toHaveBeenCalled();
  });

  it("should call next with an error if metadata key is null", async () => {
    await updateMetadata(ctx, {
      id: metadata.id,
      key: null,
      type: TEXT,
      textValue: "textValue",
    });
    await getLaunchUrl(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });

  it("should call next with an error if metadata key is an empty string", async () => {
    await updateMetadata(ctx, {
      id: metadata.id,
      key: "",
      type: TEXT,
      textValue: "textValue",
    });
    await getLaunchUrl(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });

  it("should call next with an error if metadata key is a string of whitespaces", async () => {
    await updateMetadata(ctx, {
      id: metadata.id,
      key: "      ",
      type: TEXT,
      textValue: "textValue",
    });
    await getLaunchUrl(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });

  it("should convert date values to ISO string dates when building claims", () => {
    expect(
      buildClaims([
        { id: 1, key: "hello", type: "Date", dateValue: "01/01/2018" },
      ])
    ).toMatchObject({
      claims: {
        hello: "2018-01-01",
      },
    });
  });

  it("should convert date values to ISO string even if ISO format already", () => {
    expect(
      buildClaims([
        {
          id: 1,
          key: "hello",
          type: "Date",
          dateValue: "2018-01-01T00:00:00+00:00",
        },
      ])
    ).toMatchObject({
      claims: {
        hello: "2018-01-01",
      },
    });
  });
});
