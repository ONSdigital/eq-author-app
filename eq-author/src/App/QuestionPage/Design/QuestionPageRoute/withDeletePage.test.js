import {
  mapMutateToProps,
  createUpdater,
  handleDeletion
} from "./withDeletePage";
import fragment from "graphql/sectionFragment.graphql";

describe("withDeletePage", () => {
  let history, mutate, result, ownProps, onAddPage, raiseToast;
  let deletedPage, currentPage, currentSection;

  beforeEach(() => {
    deletedPage = {
      id: "2",
      sectionId: "2"
    };

    currentPage = {
      id: "1",
      sectionId: "1"
    };

    currentSection = {
      id: "1",
      pages: [currentPage, { id: "3" }]
    };

    history = {
      push: jest.fn()
    };

    result = {
      data: {
        deletePage: currentPage
      }
    };

    onAddPage = jest.fn(() => Promise.resolve());
    raiseToast = jest.fn(() => Promise.resolve());

    ownProps = {
      client: {
        readFragment: jest.fn(() => currentSection)
      },
      match: {
        params: {
          questionnaireId: "1",
          sectionId: currentSection.id,
          pageId: currentPage.id
        }
      },
      history,
      onAddPage,
      raiseToast
    };

    mutate = jest.fn(() => Promise.resolve(result));
  });

  describe("createUpdater", () => {
    it("should remove the page from the cache", () => {
      const id = `Section${currentSection.id}`;
      const readFragment = jest.fn(() => currentSection);
      const writeFragment = jest.fn();

      const updater = createUpdater(currentSection.id, deletedPage.id);
      updater({ readFragment, writeFragment }, result);

      expect(readFragment).toHaveBeenCalledWith({ id, fragment });
      expect(writeFragment).toHaveBeenCalledWith({
        id,
        fragment,
        data: currentSection
      });
      expect(currentSection.pages).not.toContain(deletedPage);
    });

    it("should update position value of all pages", () => {
      const cache = {
        section: {
          id: "1",
          pages: [
            { id: "1", position: 0 },
            deletedPage,
            { id: "3", position: 2 }
          ]
        }
      };

      const proxy = {
        writeFragment: jest.fn(({ data }) => (cache.section = data)),
        readFragment: jest.fn(() => cache.section)
      };

      const updater = createUpdater(cache.section.id, deletedPage.id);
      updater(proxy, result);

      expect(cache.section.pages).toEqual([
        { id: "1", position: 0 },
        { id: "3", position: 1 }
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
                  input: { id: deletedPage.id }
                }
              })
            );
          });
      });

      it("should return promise that resolves to deletePage result", () => {
        return expect(
          props.onDeletePage(deletedPage.sectionId, deletedPage.id)
        ).resolves.toBe(result);
      });

      it("should raise a toast message upon deletion of page", () => {
        return props
          .onDeletePage(deletedPage.sectionId, deletedPage.id)
          .then(() => {
            expect(raiseToast).toHaveBeenCalledWith(
              `Page${deletedPage.id}`,
              expect.stringContaining("Page"),
              "undeletePage",
              expect.objectContaining({
                sectionId: deletedPage.sectionId,
                pageId: deletedPage.id
              })
            );
          });
      });
    });
  });

  describe("handleDeletion", () => {
    describe("when only one page in section", () => {
      it("should add new page", () => {
        const section = {
          ...currentSection,
          pages: [currentPage]
        };

        return handleDeletion(ownProps, section).then(() => {
          expect(onAddPage).toHaveBeenCalledWith(section.id);
        });
      });
    });

    describe("when more than one page in section", () => {
      it("should redirect to another page", () => {
        return handleDeletion(ownProps, currentSection).then(() => {
          expect(history.push).toHaveBeenCalled();
        });
      });
    });
  });
});
