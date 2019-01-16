import { mapMutateToProps } from "./withUpdateQuestionConfirmation";

describe("withUpdateQuestionConfirmation", () => {
  let mutate;

  beforeEach(() => {
    mutate = jest.fn().mockResolvedValue({
      data: {
        updateQuestionConfirmation: {
          id: "4",
        },
      },
    });
  });

  it("should return a function onUpdateQuestionConfirmation", () => {
    expect(mapMutateToProps({ mutate }).onUpdateQuestionConfirmation).toEqual(
      expect.any(Function)
    );
  });

  it("should filter the values and run the update", async () => {
    const change = {
      id: "4",
      page: {
        id: "5",
      },
      positive: {
        label: "yes",
        something: "wrong",
      },
    };
    await mapMutateToProps({ mutate }).onUpdateQuestionConfirmation(change);

    expect(mutate).toHaveBeenCalledWith({
      variables: {
        input: {
          id: "4",
          positive: {
            label: "yes",
          },
        },
      },
    });
  });
});
