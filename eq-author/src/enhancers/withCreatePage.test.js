import {
  mapMutateToProps,
  createUpdater,
  redirectToNewPage,
} from "./withCreatePage";
import fragment from "graphql/sectionFragment.graphql";
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

  describe("createUpdater", () => {
    it("should update the cache pass and the result to be the correct page", () => {
      const id = `Section${section.id}`;
      const readFragment = jest.fn(() => section);
      const writeFragment = jest.fn();

      const updater = createUpdater(section.id, 0);
      updater({ readFragment, writeFragment }, result);

      expect(readFragment).toHaveBeenCalledWith({ id, fragment });
      expect(writeFragment).toHaveBeenCalledWith({
        id,
        fragment,
        data: section,
      });
      expect(section.pages).toContain(newPage);
      expect(section.pages[0]).toBe(newPage);
    });

    it("should update position value of all pages", () => {
      const pageAId = "a";
      const pageBId = "b";
      const pageCId = "c";

      const cache = {
        section: {
          id: section.id,
          pages: [
            { id: pageAId, position: 0 },
            { id: pageBId, position: 1 },
            { id: pageCId, position: 2 },
          ],
        },
      };

      const proxy = {
        writeFragment: jest.fn(({ data }) => (cache.section = data)),
        readFragment: jest.fn(() => cache.section),
      };

      const updater = createUpdater(section.id, newPage.position);
      updater(proxy, result);

      expect(cache.section.pages).toEqual([
        { id: pageAId, position: 0 },
        newPage,
        { id: pageBId, position: 2 },
        { id: pageCId, position: 3 },
      ]);
    });
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

    it("should have a onAddPage prop", () => {
      expect(props.onAddPage).toBeInstanceOf(Function);
    });

    it("should redirect and return the new page", () => {
      return props.onAddPage(section.id).then(result => {
        expect(result).toEqual(newPage);
        expect(history.push).toHaveBeenCalled();
      });
    });
  });
});
