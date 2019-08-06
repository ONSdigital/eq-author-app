import { mapMutateToProps, handleDeletion } from "./withDeleteSection";

describe("withDeleteSection", () => {
  let history, mutate, result, ownProps, onAddSection, showToast;
  let deletedPage, currentPage, currentSection, questionnaire;

  beforeEach(() => {
    deletedPage = {
      id: "2",
      sectionId: "2",
    };

    currentPage = {
      id: "1",
      sectionId: "1",
    };

    currentSection = {
      id: currentPage.sectionId,
      pages: [currentPage, { id: "3" }],
    };

    questionnaire = {
      id: "1",
      title: "My Questionnaire",
      sections: [
        currentSection,
        {
          id: deletedPage.sectionId,
          pages: [deletedPage],
        },
      ],
    };

    history = {
      push: jest.fn(),
    };

    result = {
      data: {
        deleteSection: {
          id: "questionnaire",
          sections: [],
        },
      },
    };

    onAddSection = jest.fn();
    showToast = jest.fn();

    ownProps = {
      questionnaire,
      match: {
        params: {
          questionnaireId: questionnaire.id,
          sectionId: currentSection.id,
          pageId: currentPage.id,
        },
      },
      history,
      onAddSection,
      showToast,
      client: {
        readFragment: jest.fn(() => questionnaire),
      },
    };

    mutate = jest.fn(() => Promise.resolve(result));
  });

  describe("mapMutateToProps", () => {
    let props;

    beforeEach(() => {
      props = mapMutateToProps({ ownProps, mutate });
    });

    it("should have a onDeleteSection prop", () => {
      expect(props.onDeleteSection).toBeInstanceOf(Function);
    });

    describe("onDeleteSection", () => {
      it("should call mutate", () => {
        return props.onDeleteSection(currentSection.id).then(() => {
          expect(mutate).toHaveBeenCalledWith(
            expect.objectContaining({
              variables: {
                input: { id: currentSection.id },
              },
            })
          );
        });
      });

      it("should show a toast after invoking onDeleteSection", () => {
        return props.onDeleteSection(currentSection.id).then(() => {
          expect(showToast).toHaveBeenCalledWith(
            expect.stringContaining("Section")
          );
        });
      });

      it("should display number of deleted pages in toast", () => {
        const pages = currentSection.pages;
        currentSection.pages = [currentPage];

        return props.onDeleteSection(currentSection.id).then(() => {
          expect(showToast).toHaveBeenCalledWith(
            expect.stringContaining("1 page")
          );

          currentSection.pages = pages;
        });
      });

      it("should pluralize the number of deleted pages in toast", () => {
        return props.onDeleteSection(currentSection.id).then(() => {
          expect(showToast).toHaveBeenCalledWith(
            expect.stringContaining("2 pages")
          );
        });
      });

      it("should return promise that resolves to deleteSection result", () => {
        return expect(props.onDeleteSection(currentSection.id)).resolves.toBe(
          result
        );
      });
    });
  });

  describe("handleDeletion", () => {
    describe("when only one section in questionnaire", () => {
      it("should add new section", () => {
        handleDeletion(ownProps, result, {});
        expect(onAddSection).toHaveBeenCalled();
      });
    });

    describe("when more than one section in questionnaire", () => {
      it("should redirect to another section", () => {
        result.data.deleteSection.sections = [
          { id: "section 1", pages: [{ id: "page 1" }] },
        ];
        handleDeletion(ownProps, result, questionnaire);
        expect(history.push).toHaveBeenCalled();
      });
    });
  });
});
