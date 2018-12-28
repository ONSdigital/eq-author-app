import { mapMutateToProps } from "./withUpdateQuestionnaire";

describe("enhancers > withUpdateQuestionnaire", () => {
  describe("mapMutateToProps", () => {
    let props;
    let mutate;
    let questionnaire;

    beforeEach(() => {
      mutate = jest.fn();
      props = mapMutateToProps({ mutate });
      questionnaire = jest.fn();
    });

    it("should have an onUpdate prop", () => {
      expect(props.onUpdateQuestionnaire).toBeInstanceOf(Function);
    });

    it("should call mutate", () => {
      props.onUpdateQuestionnaire(questionnaire);
      expect(mutate).toHaveBeenCalledWith({
        variables: { input: questionnaire }
      });
    });
  });
});
