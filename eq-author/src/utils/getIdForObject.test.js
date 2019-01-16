import getIdForObject from "./getIdForObject";

describe("getIdForObject", () => {
  it("should return a valid id if `id` and `__typename` fields are present", () => {
    const result = {
      __typename: "Questionnaire",
      id: "1",
    };

    expect(getIdForObject(result)).toEqual("Questionnaire1");
  });

  it("should returns null for invalid result", () => {
    expect(getIdForObject({})).toBeNull();
  });
});
