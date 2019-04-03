import { mapMutateToProps } from "./withCreateCollapsible";

describe("withCreateCollapsible", () => {
  let mutate;
  beforeEach(() => {
    mutate = jest.fn();
  });

  it("should return a createCollapsible func", () => {
    expect(mapMutateToProps({ mutate }).createCollapsible).toBeInstanceOf(
      Function
    );
  });

  it("should filter the args to what is allowed and call mutate", () => {
    mapMutateToProps({ mutate }).createCollapsible({
      introductionId: "introId",
      title: "title",
      description: "description",
      foo: "foo",
    });
    expect(mutate).toHaveBeenCalledWith({
      variables: {
        input: {
          introductionId: "introId",
          title: "title",
          description: "description",
        },
      },
    });
  });
});
