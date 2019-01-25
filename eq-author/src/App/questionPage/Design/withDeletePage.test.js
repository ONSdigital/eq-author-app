import { mapMutateToProps, createUpdater } from "./withDeletePage";
import fragment from "graphql/sectionFragment.graphql";

describe("withDeletePage", () => {
  let history, mutate, result, ownProps, onAddPage, raiseToast;
  let deletedPage,
    currentPage,
    sectionId,
    beforeDeleteSection,
    afterDeleteSection;

  beforeEach(() => {
    sectionId = "10";

    deletedPage = {
      id: "2",
      sectionId,
      position: 1,
    };

    currentPage = {
      id: "1",
      sectionId,
      position: 0,
    };

    beforeDeleteSection = {
      id: sectionId,
      pages: [currentPage, deletedPage, { id: "3", position: 2 }],
    };

    afterDeleteSection = {
      ...beforeDeleteSection,
      pages: [{ ...currentPage, position: 0 }, { id: "3", position: 1 }],
    };

    history = {
      push: jest.fn(),
    };

    result = {
      data: {
        deletePage: currentPage,
      },
    };

    onAddPage = jest.fn(() => Promise.resolve());
    raiseToast = jest.fn(() => Promise.resolve());

    ownProps = {
      client: {
        readFragment: jest
          .fn()
          .mockReturnValueOnce(beforeDeleteSection)
          .mockReturnValueOnce(afterDeleteSection),
      },
      match: {
        params: {
          questionnaireId: "1",
          sectionId: sectionId,
          pageId: currentPage.id,
        },
      },
      history,
      onAddPage,
      raiseToast,
    };

    mutate = jest.fn(() => Promise.resolve(result));
  });

  describe("createUpdater", () => {
    it("should remove the page from the cache", () => {
      const id = `Section${beforeDeleteSection.id}`;
      const readFragment = jest.fn().mockReturnValueOnce(beforeDeleteSection);
      const writeFragment = jest.fn();

      const updater = createUpdater(sectionId, deletedPage.id);
      updater({ readFragment, writeFragment }, result);

      expect(readFragment).toHaveBeenCalledWith({ id, fragment });
      expect(writeFragment).toHaveBeenCalledWith({
        id,
        fragment,
        data: afterDeleteSection,
      });
    });

    it("should update position value of all pages", () => {
      const cache = {
        section: {
          id: "1",
          pages: [
            { id: "1", position: 0 },
            deletedPage,
            { id: "3", position: 2 },
          ],
        },
      };

      const proxy = {
        writeFragment: jest.fn(({ data }) => (cache.section = data)),
        readFragment: jest.fn(() => cache.section),
      };

      const updater = createUpdater(cache.section.id, deletedPage.id);
      updater(proxy, result);

      expect(cache.section.pages).toEqual([
        { id: "1", position: 0 },
        { id: "3", position: 1 },
      ]);
    });
  });

  describe("mapMutateToProps", () => {
    let props;

    beforeEach(() => {
      props = mapMutateToProps({ ownProps, mutate });
    });

    it("should have a onDeletePage prop", () => {
      expect(props.onDeletePage).toBeInstanceOf(Function);
    });

    describe("onDeletePage", () => {
      it("should call mutate", () => {
        return props
          .onDeletePage(deletedPage.sectionId, deletedPage.id)
          .then(() => {
            expect(mutate).toHaveBeenCalledWith(
              expect.objectContaining({
                variables: {
                  input: { id: deletedPage.id },
                },
              })
            );
          });
      });

      it("should raise a toast message upon deletion of page", () => {
        return props
          .onDeletePage(deletedPage.sectionId, deletedPage.id)
          .then(() => {
            expect(raiseToast).toHaveBeenCalledWith(
              `Page${deletedPage.id}`,
              expect.stringContaining("Page"),
              expect.objectContaining({
                sectionId: deletedPage.sectionId,
                pageId: deletedPage.id,
              })
            );
          });
      });

      it("should create a page if you delete the last page in a section", () => {
        ownProps.client.readFragment = jest
          .fn()
          .mockReturnValueOnce({ ...beforeDeleteSection, pages: [deletedPage] })
          .mockReturnValueOnce({ ...afterDeleteSection, pages: [] });

        return props
          .onDeletePage(deletedPage.sectionId, deletedPage.id)
          .then(() => {
            expect(onAddPage).toHaveBeenCalledWith(deletedPage.sectionId);
          });
      });

      it("should redirect to another page in the section", () => {
        return props
          .onDeletePage(deletedPage.sectionId, deletedPage.id)
          .then(() => {
            expect(history.push).toHaveBeenCalledWith(
              "/questionnaire/1/10/1/design"
            );
          });
      });
    });
  });
});
