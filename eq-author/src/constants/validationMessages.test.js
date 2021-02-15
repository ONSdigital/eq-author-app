import messageTemplates from "./validationMessages";
const {
  ERR_VALID_REQUIRED,
  ERR_UNIQUE_REQUIRED,
  ERR_REQUIRED_WHEN_SETTING,
} = messageTemplates;

describe("constants/validationMessages", () => {
  let label = "Field Label";

  it("should return validation message with correct label", () => {
    [ERR_VALID_REQUIRED, ERR_UNIQUE_REQUIRED].forEach((messageTemplate) => {
      const validationMessage = messageTemplate({ label, requiredMsg: label });
      expect(validationMessage).toEqual(expect.stringMatching(label));
    });
  });

  it("should return the message provided", () => {
    expect(ERR_REQUIRED_WHEN_SETTING({ message: "Some error" })).toEqual(
      "Some error"
    );
  });
});
