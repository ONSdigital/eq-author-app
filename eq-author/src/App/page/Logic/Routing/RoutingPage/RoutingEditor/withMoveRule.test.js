import { mapMutateToProps } from "./withMoveRule";

describe("withMoveRule", () => {
  describe("mapMutateToProps", () => {
    let props;
    let mutate;

    beforeEach(() => {
      mutate = jest.fn(() => Promise.resolve());
      props = mapMutateToProps({ mutate });
    });

    it("should have a updateRouting prop", () => {
      expect(props.moveRule).toBeInstanceOf(Function);
    });

    it("should call mutate", () => {
      props.moveRule({ id: "1", position: 1 });
      expect(mutate).toHaveBeenCalledWith({
        variables: { input: { id: "1", position: 1 } },
      });
    });
  });
});
