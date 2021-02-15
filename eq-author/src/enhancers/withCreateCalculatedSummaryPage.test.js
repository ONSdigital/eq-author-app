import {
  mapMutateToProps,
  redirectToNewPage,
} from "./withCreateCalculatedSummaryPage";
import { buildPagePath } from "utils/UrlUtils";

describe("withCreateCalculatedSummaryPage", () => {
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
        createCalculatedSummaryPage: newPage,
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

    it("should have a onAddCalculatedSummaryPage prop", () => {
      expect(props.onAddCalculatedSummaryPage).toBeInstanceOf(Function);
    });

    it("should redirect and return the new page", () => {
      return props.onAddCalculatedSummaryPage(section.id, 0).then((result) => {
        expect(result).toEqual(newPage);
        expect(history.push).toHaveBeenCalled();
      });
    });
  });
});
