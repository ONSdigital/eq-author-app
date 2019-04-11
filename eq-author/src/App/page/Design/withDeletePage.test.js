import { mapMutateToProps } from "./withDeletePage";

describe("withDeletePage", () => {
  let history, mutate, result, ownProps, onAddQuestionPage, raiseToast;
  let deletedPage, currentPage, sectionId, questionnaireId, beforeDeleteSection;

  beforeEach(() => {
    sectionId = "9";
    questionnaireId = "1";
    currentPage = {
      id: "1",
      sectionId,
      position: 0,
    };

    deletedPage = {
      id: "2",
      section: {
        id: sectionId,
      },
      position: 1,
    };

    beforeDeleteSection = {
      id: sectionId,
      pages: [currentPage, deletedPage, { id: "3", position: 2 }],
    };

    history = {
      push: jest.fn(),
    };

    result = {
      data: {
        deletePage: {
          id: sectionId,
          pages: [currentPage, { id: "3", position: 2 }],
        },
      },
    };

    onAddQuestionPage = jest.fn(() => Promise.resolve());
    raiseToast = jest.fn(() => Promise.resolve());

    ownProps = {
      client: {
        readFragment: jest.fn().mockReturnValueOnce(beforeDeleteSection),
      },
      match: {
        params: {
          questionnaireId,
          sectionId,
          pageId: currentPage.id,
        },
      },
      history,
      onAddQuestionPage,
      raiseToast,
    };

    mutate = jest.fn(() => Promise.resolve(result));
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
        return props.onDeletePage(deletedPage).then(() => {
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
        return props.onDeletePage(deletedPage).then(() => {
          expect(raiseToast).toHaveBeenCalledWith(
            `Page${deletedPage.id}`,
            expect.stringContaining("Page"),
            expect.objectContaining({
              sectionId: deletedPage.section.id,
              pageId: deletedPage.id,
            })
          );
        });
      });

      it("should create a page if you delete the last page in a section", () => {
        result.data.deletePage.pages = [];
        ownProps.client.readFragment = jest.fn().mockReturnValueOnce({
          ...beforeDeleteSection,
          pages: [deletedPage],
        });

        return props.onDeletePage(deletedPage).then(() => {
          expect(onAddQuestionPage).toHaveBeenCalledWith(
            deletedPage.section.id
          );
        });
      });

      it("should redirect to another page in the section", () => {
        return props.onDeletePage(deletedPage).then(() => {
          expect(history.push).toHaveBeenCalledWith(
            `/q/${questionnaireId}/page/${currentPage.id}/design`
          );
        });
      });
    });
  });
});
