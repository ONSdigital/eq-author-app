const { cloneDeep } = require("lodash");
const { v4: uuidv4 } = require("uuid");

const updateCreatedByToUseUsers = require("./updateCreatedByToUseUsers.js");

const {
  createUser,
  getUserByName,
  getUserByEmail,
} = require("../db/datastore");
const { AUTHOR_TEAM_NAME } = require("../constants/authorTeamUser");

describe("updateCreatedByToUseUsers", () => {
  const buildQuestionnaire = (createdBy) => ({
    id: "1",
    title: "Test Questionnaire",
    createdBy,
  });

  beforeAll(async () => {
    await createUser({
      name: AUTHOR_TEAM_NAME,
      externalId: "1234",
      email: "test@test.com",
    });
  });
  // This test must remain for your migration to always work
  it("should be deterministic", async () => {
    const questionnaire = buildQuestionnaire("Author Integration Test"); // Fill in the structure of the questionnaire here
    const result1 = await updateCreatedByToUseUsers(cloneDeep(questionnaire));
    const result2 = await updateCreatedByToUseUsers(cloneDeep(questionnaire));
    expect(result1).toEqual(result2);
  });

  it("should update a createdBy to reflect the id in the users table using name", async () => {
    const name = uuidv4();
    await createUser({ name, externalId: "12345", email: "test@test.com" });
    const questionnaire = buildQuestionnaire(name);
    await updateCreatedByToUseUsers(questionnaire);
    const testUser = await getUserByName(name);
    expect(questionnaire.createdBy).toEqual(testUser.id);
  });

  it("should update a createdBy to reflect the id in the users table using email", async () => {
    const email = uuidv4();
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
