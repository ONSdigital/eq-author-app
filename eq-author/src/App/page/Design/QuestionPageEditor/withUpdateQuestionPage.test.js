import { mapMutateToProps } from "./withUpdateQuestionPage";

describe("enhancers > withUpdatePage", () => {
  describe("mapMutateToProps", () => {
    let props;
    let mutate;
    let page;

    beforeEach(() => {
      mutate = jest.fn();
      props = mapMutateToProps({ mutate });
      page = {
        title: "123",
      };
    });

    it("should have an onUpdatePage prop", () => {
      expect(props.onUpdateQuestionPage).toBeInstanceOf(Function);
    });

    it("should call mutate", () => {
      props.onUpdateQuestionPage(page);
      expect(mutate).toHaveBeenCalledWith({
        variables: { input: { title: "123" } },
      });
    });
  });
});
