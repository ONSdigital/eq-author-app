const runQuestionnaireMigrations = require("./runQuestionnaireMigrations");
const { buildContext } = require("../tests/utils/contextBuilder");

describe("runQuestionnaireMigrations", () => {
  let res, req, next, migrations, logger;

  beforeEach(async () => {
    req = {
      questionnaire: await buildContext({
        metadata: [{}],
      }),
    };
    res = {};
    next = jest.fn();
    migrations = [];
    logger = {
      info: jest.fn(),
      error: jest.fn(),
    };
  });

  it("should correctly handle no questionnaire", async () => {
    req = {};
    let migrationOne = jest.fn(() => req.questionnaire);
    migrations = [migrationOne];

    await runQuestionnaireMigrations(logger)({
      migrations,
      currentVersion: migrations.length,
    })(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(migrationOne).not.toHaveBeenCalled();
  });

  it("should correctly handle an undefined version", async () => {
    req.questionnaire.version = undefined;
    let migrationOne = jest.fn(() => req.questionnaire);
    migrations = [migrationOne];

    await runQuestionnaireMigrations(logger)({
      migrations,
      currentVersion: migrations.length,
    })(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(migrationOne).toHaveBeenCalledWith(req.questionnaire);
    expect(req.questionnaire.version).toEqual(1);
  });

  it("should not migrate data if version up to date", async () => {
    req = {
      questionnaire: {
        version: 2,
      },
    };
    let migrationOne = jest.fn(() => req.questionnaire);
    let migrationTwo = jest.fn(() => req.questionnaire);
    migrations = [migrationOne, migrationTwo];
    await runQuestionnaireMigrations(logger)({
      migrations,
      currentVersion: migrations.length,
    })(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(migrationOne).not.toHaveBeenCalled();
    expect(migrationTwo).not.toHaveBeenCalled();
  });

  it("should not update version if migration fails", async () => {
    const err = new Error("foobar");
    req.questionnaire.version = 1;
    let migrationOne = jest.fn(() => req.questionnaire);
    let migrationTwo = jest.fn(() => req.questionnaire);
    let migrationThree = jest.fn(() => {
      throw err;
    });
    migrations = [migrationOne, migrationTwo, migrationThree];

    await runQuestionnaireMigrations(logger)({
      migrations,
      currentVersion: migrations.length,
    })(req, res, next);
    expect(next).toHaveBeenCalledWith(err);
    expect(migrationOne).not.toHaveBeenCalled();
    expect(migrationTwo).toHaveBeenCalled();
    expect(migrationThree).toThrowError();
    expect(logger.info).toHaveBeenCalledTimes(2);
    expect(logger.error).toHaveBeenCalledTimes(1);
    expect(req.questionnaire.version).toEqual(1);
  });

  it("should migrate data and set version correctly", async () => {
    req.questionnaire.version = 1;

    let migrationOne = jest.fn(() => req.questionnaire);
    let migrationTwo = jest.fn(questionnaire => {
      questionnaire.title = "foo";
      return questionnaire;
    });
    let migrationThree = jest.fn(questionnaire => {
      questionnaire.description = "bar";
      return questionnaire;
    });

    migrations = [migrationOne, migrationTwo, migrationThree];

    await runQuestionnaireMigrations(logger)({
      migrations,
      currentVersion: migrations.length,
    })(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(migrationOne).not.toHaveBeenCalled();
    expect(migrationTwo).toHaveBeenCalledWith(req.questionnaire);
    expect(migrationThree).toHaveBeenCalledWith(req.questionnaire);
    expect(req.questionnaire.title).toEqual("foo");
    expect(req.questionnaire.description).toEqual("bar");
    expect(logger.info).toHaveBeenCalledTimes(2);
    expect(req.questionnaire.version).toEqual(3);
  });
});
