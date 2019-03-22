import { mapMutateToProps } from "./withUpdateCalculatedSummaryPage";

describe("withUpdateCalculatedSummaryPage", () => {
  describe("mapMutateToProps", () => {
    let props;
    let mutate;
    let page;

    beforeEach(() => {
      mutate = jest.fn();
      props = mapMutateToProps({ mutate });
      page = {
        displayName: "123",
        summaryAnswers: [],
      };
    });

    it("should have an onCalculatedSummaryPage prop", () => {
      expect(props.onUpdateCalculatedSummaryPage).toBeInstanceOf(Function);
    });

    it("should call mutate", () => {
      props.onUpdateCalculatedSummaryPage(page);
      expect(mutate).toHaveBeenCalledWith({
        variables: { input: { summaryAnswers: [] } },
      });
    });
  });
});
