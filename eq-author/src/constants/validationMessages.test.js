import VALIDATION_MESSAGES from "./validationMessages";

describe("constants/validationMessages", () => {
  let label = "Field Label";

  it("should return validation message with correct label", () => {
    const validationMessage = VALIDATION_MESSAGES.ERR_VALID_REQUIRED({ label });

    expect(validationMessage).toEqual(expect.stringMatching(label));
  });
});
