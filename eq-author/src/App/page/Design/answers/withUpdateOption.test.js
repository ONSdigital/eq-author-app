import { mapMutateToProps } from "./withUpdateOption";

describe("enhancers > withUpdateOption", () => {
  describe("mapMutateToProps", () => {
    let props;
    let mutate;
    let option;

    beforeEach(() => {
      mutate = jest.fn();
      props = mapMutateToProps({ mutate });
      option = {
        id: "1",
        foo: "bar",
        additionalAnswer: { id: "2", bar: "baz" },
      };
    });

    it("should have an onUpdateOption prop", () => {
      expect(props.onUpdateOption).toBeInstanceOf(Function);
    });

    it("should call mutate", () => {
      props.onUpdateOption(option);
      expect(mutate).toHaveBeenCalledWith({
        variables: { input: { id: "1", additionalAnswer: { id: "2" } } },
      });
    });
  });
});
