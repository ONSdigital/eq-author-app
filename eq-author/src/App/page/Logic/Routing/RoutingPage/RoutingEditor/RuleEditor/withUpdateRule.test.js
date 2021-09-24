import { mapMutateToProps } from "./withUpdateRule";

describe("withUpdateRule", () => {
  describe("mapMutateToProps", () => {
    let props;
    let mutate;

    beforeEach(() => {
      mutate = jest.fn(() => Promise.resolve());
      props = mapMutateToProps({ mutate });
    });

    it("should have a updateRule prop", () => {
      expect(props.updateRule).toBeInstanceOf(Function);
    });

    it("should call mutate", () => {
      props.updateRule({
        id: "1",
        foo: "bar",
        destination: { sectionId: "5" },
      });
      expect(mutate).toHaveBeenCalledWith({
        refetchQueries: ["GetQuestionnaire"],
        variables: { input: { id: "1", destination: { sectionId: "5" } } },
      });
    });
  });
});
