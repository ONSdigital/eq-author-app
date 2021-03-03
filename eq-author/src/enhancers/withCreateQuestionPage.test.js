import { mapMutateToProps, redirectToNewPage } from "./withCreateQuestionPage";
import { buildPagePath } from "utils/UrlUtils";

describe("containers/QuestionnaireDesignPage/withCreatePage", () => {
  const page = {
    id: "3",
    title: "My Page",
  };
  const section = {
    id: "2",
    title: "My Section",
    pages: [page],
  };
  const questionnaire = {
    id: "1",
    title: "My Questionnaire",
    sections: [section],
  };

  let history, mutate, result, newPage, ownProps;

  beforeEach(() => {
    history = {
      push: jest.fn(),
    };

    newPage = {
      id: "8",
      title: "New Page",
      position: 1,
      section: {
        id: section.id,
      },
    };

    result = {
      data: {
        createQuestionPage: newPage,
      },
    };

    ownProps = {
      history,
      match: {
        params: {
          questionnaireId: questionnaire.id,
        },
      },
    };

    mutate = jest.fn(() => Promise.resolve(result));
  });

  describe("redirectToNewPage", () => {
    it("should redirect to the correct url", () => {
      redirectToNewPage(ownProps)(newPage);

      expect(history.push).toHaveBeenCalledWith(
        buildPagePath({
          questionnaireId: questionnaire.id,
          sectionId: section.id,
          pageId: newPage.id,
        })
      );
    });
  });

  describe("mapMutateToProps", () => {
    let props;
    beforeEach(() => {
      props = mapMutateToProps({ ownProps, mutate });
    });

    it("should have a onAddQuestionPage prop", () => {
      expect(props.onAddQuestionPage).toBeInstanceOf(Function);
    });

    it("should redirect and return the new page", () => {
      return props.onAddQuestionPage(section.id).then((result) => {
        expect(result).toEqual(newPage);
        expect(history.push).toHaveBeenCalled();
      });
    });
  });
});
