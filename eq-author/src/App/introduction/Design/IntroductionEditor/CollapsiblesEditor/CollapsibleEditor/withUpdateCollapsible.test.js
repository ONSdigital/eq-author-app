import { mapMutateToProps } from "./withUpdateCollapsible";

describe("withUpdateCollapsible", () => {
  let mutate;
  beforeEach(() => {
    mutate = jest.fn();
  });

  it("should return a updateCollapsible func", () => {
    expect(mapMutateToProps({ mutate }).updateCollapsible).toBeInstanceOf(
      Function
    );
  });

  it("should filter the args, create an optimistic response and call mutate", () => {
    mapMutateToProps({ mutate }).updateCollapsible({
      id: "id",
      title: "title",
      description: "description",
      foo: "foo",
    });
    expect(mutate).toHaveBeenCalledWith({
      optimisticResponse: {
        updateCollapsible: {
          id: "id",
          title: "title",
          description: "description",
          foo: "foo",
          __typename: "Collapsible",
        },
      },
      variables: {
        input: {
          id: "id",
          title: "title",
          description: "description",
        },
      },
    });
  });
});
