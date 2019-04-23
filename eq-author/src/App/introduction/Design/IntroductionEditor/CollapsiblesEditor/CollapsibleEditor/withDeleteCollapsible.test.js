import { mapMutateToProps } from "./withDeleteCollapsible";

describe("withDeleteCollapsible", () => {
  let mutate;
  beforeEach(() => {
    mutate = jest.fn();
  });

  it("should return a deleteCollapsible func", () => {
    expect(mapMutateToProps({ mutate }).deleteCollapsible).toBeInstanceOf(
      Function
    );
  });

  it("should filter the args to what is allowed and call mutate", () => {
    mapMutateToProps({ mutate }).deleteCollapsible({
      id: "id",
      title: "title",
      description: "description",
    });
    expect(mutate).toHaveBeenCalledWith({
      variables: {
        input: {
          id: "id",
        },
      },
    });
  });
});
