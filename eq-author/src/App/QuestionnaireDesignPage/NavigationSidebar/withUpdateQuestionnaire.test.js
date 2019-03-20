import { omit } from "lodash";

import { mapMutateToProps } from "./withUpdateQuestionnaire";

describe("enhancers > withUpdateQuestionnaire", () => {
  describe("mapMutateToProps", () => {
    let props;
    let mutate;
    let questionnaire;

    beforeEach(() => {
      mutate = jest.fn();
      props = mapMutateToProps({ mutate });
      questionnaire = { id: "1", title: "Foo" };
    });

    it("should have an onUpdate prop", () => {
      expect(props.onUpdateQuestionnaire).toBeInstanceOf(Function);
    });

    it("should call mutate", () => {
      questionnaire.foo = "bar";
      props.onUpdateQuestionnaire(questionnaire);
      expect(mutate).toHaveBeenCalledWith({
        variables: { input: omit(questionnaire, "foo") },
      });
    });
  });
});
