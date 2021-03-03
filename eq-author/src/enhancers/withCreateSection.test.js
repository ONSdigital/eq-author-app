import { mapMutateToProps, redirectToNewSection } from "./withCreateSection";

import { buildSectionPath } from "utils/UrlUtils";

describe("withCreateSection", () => {
  const questionnaire = {
    id: "1",
    title: "My Questionnaire",
    sections: [],
  };

  let history, mutate, result, newSection, newPage, ownProps;

  beforeEach(() => {
    history = {
      push: jest.fn(),
    };

    newPage = {
      id: "5",
    };

    newSection = {
      id: "4",
      title: "New Section",
      pages: [newPage],
    };

    result = {
      data: {
        createSection: newSection,
      },
    };

    ownProps = {
      questionnaire,
      questionnaireId: questionnaire.id,
      history,
      match: {
        params: {
          questionnaireId: questionnaire.id,
        },
      },
    };

    mutate = jest.fn(() => Promise.resolve(result));
  });

  describe("redirectToNewSection", () => {
    it("should redirect to the correct url", () => {
      redirectToNewSection(ownProps)(newSection);

      expect(history.push).toHaveBeenCalledWith(
        buildSectionPath({
          questionnaireId: questionnaire.id,
          sectionId: newSection.id,
        })
      );
    });
  });

  describe("mapMutateToProps", () => {
    let props;

    beforeEach(() => {
      props = mapMutateToProps({ ownProps, mutate });
    });

    it("should have a onAddSection prop", () => {
      expect(props.onAddSection).toBeInstanceOf(Function);
    });

    it("should redirect", () => {
      return props.onAddSection().then((result) => {
        expect(result).toEqual(newSection);
        expect(history.push).toHaveBeenCalled();
      });
    });
  });
});
