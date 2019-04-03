import { mapMutateToProps } from "./withMoveCollapsible";

describe("withMoveCollapsible", () => {
  let mutate;
  beforeEach(() => {
    mutate = jest.fn();
  });

  it("should return a moveCollapsible func", () => {
    expect(mapMutateToProps({ mutate }).moveCollapsible).toBeInstanceOf(
      Function
    );
  });

  it("should filter the args to what is allowed and call mutate", () => {
    mapMutateToProps({ mutate }).moveCollapsible({
      id: "id",
      position: 1,
      foo: "foo",
    });
    expect(mutate).toHaveBeenCalledWith({
      variables: {
        input: {
          id: "id",
          position: 1,
        },
      },
    });
  });
});
