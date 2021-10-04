import { mapMutateToProps } from "./withCreateRouting";

describe("withCreateRouting", () => {
  describe("mapMutateToProps", () => {
    let props;
    let mutate;

    beforeEach(() => {
      mutate = jest.fn(() => Promise.resolve());
      props = mapMutateToProps({ mutate });
    });

    it("should have a createRouting prop", () => {
      expect(props.createRouting).toBeInstanceOf(Function);
    });

    it("should call mutate", () => {
      props.createRouting("id");
      expect(mutate).toHaveBeenCalledWith({
        refetchQueries: ["GetQuestionnaire"],
        variables: { input: { pageId: "id" } },
      });
    });
  });
});
