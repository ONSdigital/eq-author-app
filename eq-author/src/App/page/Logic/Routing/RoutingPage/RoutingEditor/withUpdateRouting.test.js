import { mapMutateToProps } from "./withUpdateRouting";

describe("withUpdateRouting", () => {
  describe("mapMutateToProps", () => {
    let props;
    let mutate;

    beforeEach(() => {
      mutate = jest.fn(() => Promise.resolve());
      props = mapMutateToProps({ mutate });
    });

    it("should have a updateRouting prop", () => {
      expect(props.updateRouting).toBeInstanceOf(Function);
    });

    it("should call mutate", () => {
      props.updateRouting({ id: "1", foo: "bar", else: { pageId: "3" } });
      expect(mutate).toHaveBeenCalledWith({
        refetchQueries: ["GetQuestionnaire"],
        variables: { input: { id: "1", else: { pageId: "3" } } },
      });
    });
  });
});
