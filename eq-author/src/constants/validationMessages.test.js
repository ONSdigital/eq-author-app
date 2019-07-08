import VALIDATION_MESSAGES from "./validationMessages";

describe("constants/validationMessages", () => {
  let label = "Field Label";

  it("should return validation message with correct label", () => {
    Object.values(VALIDATION_MESSAGES).forEach(messageTemplate => {
      const validationMessage = messageTemplate({ label });
      expect(validationMessage).toEqual(expect.stringMatching(label));
    });
  });
});
