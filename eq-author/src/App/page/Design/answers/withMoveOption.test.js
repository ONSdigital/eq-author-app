import { mapMutateToProps } from "./withMoveOption";

describe("enhancers > withMoveOption", () => {
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
      expect(props.onMoveOption).toBeInstanceOf(Function);
    });

    it("should call mutate", () => {
      props.onMoveOption({ id: option.id, position: 0 });
      expect(mutate).toHaveBeenCalledWith({
        variables: { input: { id: "1", position: 0 } },
      });
    });
  });
});
