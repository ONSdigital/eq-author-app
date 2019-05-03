const { cloneDeep } = require("lodash");
const uuid = require("uuid");

const {
  updateCreatedByToUseUsers,
  getUserByName,
  getUserByEmail,
} = require("./updateCreatedByToUseUsers.js");

const { createUser } = require("../utils/datastore");
const { AUTHOR_TEAM_NAME } = require("../constants/authorTeamUser");

describe("updateCreatedByToUseUsers", () => {
  const buildQuestionnaire = createdBy => ({
    id: "1",
    title: "Test Questionnaire",
    createdBy,
  });
  beforeAll(async () => {
    await createUser({ name: AUTHOR_TEAM_NAME, externalId: "1234" });
  });
  // This test must remain for your migration to always work
  it("should be deterministic", async () => {
    const questionnaire = buildQuestionnaire("Author Integration Test"); // Fill in the structure of the questionnaire here
    const result1 = await updateCreatedByToUseUsers(cloneDeep(questionnaire));
    const result2 = await updateCreatedByToUseUsers(cloneDeep(questionnaire));
    expect(result1).toEqual(result2);
  });

  it("should update a createdBy to reflect the id in the users table using name", async () => {
    const name = uuid.v4();
    await createUser({ name, externalId: "12345" });
    const questionnaire = buildQuestionnaire(name);
    await updateCreatedByToUseUsers(questionnaire);
    const testUser = await getUserByName(name);
    expect(questionnaire.createdBy).toEqual(testUser.id);
  });

  it("should update a createdBy to reflect the id in the users table using email", async () => {
    const email = uuid.v4();
    await createUser({
      email,
      externalId: "12346",
    });
    const questionnaire = buildQuestionnaire(email);
    await updateCreatedByToUseUsers(questionnaire);
    const testUser = await getUserByEmail(email);
    expect(questionnaire.createdBy).toEqual(testUser.id);
  });

  it("should update a createdBy to EQ team if user does not exist in table", async () => {
    const questionnaire = buildQuestionnaire("UnknownUser");
    await updateCreatedByToUseUsers(questionnaire);
    const testUser = await getUserByName(AUTHOR_TEAM_NAME);
    expect(questionnaire.createdBy).toEqual(testUser.id);
  });
});
