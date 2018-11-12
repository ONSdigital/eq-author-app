import {
  mapMutateToProps,
  deleteUpdater,
  handleDeletion
} from "./withDeleteSection";
import fragment from "graphql/questionnaireFragment.graphql";

describe("withDeleteSection", () => {
  let history, mutate, result, ownProps, onAddSection, raiseToast;
  let deletedPage, currentPage, currentSection, questionnaire;

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

    questionnaire = {
      id: "1",
      title: "My Questionnaire",
      sections: [
        currentSection,
        {
          id: "2",
          pages: [deletedPage]
        }
      ]
    };

    history = {
      push: jest.fn()
    };

    result = {
      data: {
        deleteSection: deletedPage
      }
    };

    onAddSection = jest.fn();
    raiseToast = jest.fn(() => Promise.resolve());

    ownProps = {
      questionnaire,
      match: {
        params: {
          questionnaireId: questionnaire.id,
          sectionId: currentSection.id,
          pageId: currentPage.id
        }
      },
      history,
      onAddSection,
      raiseToast,
      client: {
        readFragment: jest.fn(() => questionnaire)
      }
    };

    mutate = jest.fn(() => Promise.resolve(result));
  });

  describe("deleteUpdater", () => {
    it("should remove the section from the cache", () => {
      const id = `Questionnaire${questionnaire.id}`;
      const readFragment = jest.fn(() => questionnaire);
      const writeFragment = jest.fn();

      const updater = deleteUpdater(questionnaire.id, currentSection.id);
      updater({ readFragment, writeFragment }, result);

      expect(readFragment).toHaveBeenCalledWith({ id, fragment });
      expect(writeFragment).toHaveBeenCalledWith({
        id,
        fragment,
        data: questionnaire
      });
      expect(questionnaire.sections).not.toContain(currentSection);
    });
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
                input: { id: currentSection.id }
              }
            })
          );
        });
      });

      it("should raise a toast after invoking onDeleteSection", () => {
        return props.onDeleteSection(currentSection.id).then(() => {
          expect(raiseToast).toHaveBeenCalledWith(
            `Section${currentSection.id}`,
            expect.stringContaining("Section"),
            "undeleteSection",
            expect.objectContaining({
              questionnaireId: questionnaire.id,
              sectionId: currentSection.id
            })
          );
        });
      });

      it("should display number of deleted pages in toast", () => {
        const pages = currentSection.pages;
        currentSection.pages = [currentPage];

        return props.onDeleteSection(currentSection.id).then(() => {
          expect(raiseToast).toHaveBeenCalledWith(
            `Section${currentSection.id}`,
            expect.stringContaining("1 page"),
            "undeleteSection",
            expect.objectContaining({
              questionnaireId: questionnaire.id,
              sectionId: currentSection.id
            })
          );

          currentSection.pages = pages;
        });
      });

      it("should pluralize the number of deleted pages in toast", () => {
        return props.onDeleteSection(currentSection.id).then(() => {
          expect(raiseToast).toHaveBeenCalledWith(
            `Section${currentSection.id}`,
            expect.stringContaining("2 pages"),
            "undeleteSection",
            expect.objectContaining({
              questionnaireId: questionnaire.id,
              sectionId: currentSection.id
            })
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
      beforeEach(() => {
        questionnaire.sections = [currentSection];
      });

      it("should add new section", () => {
        handleDeletion(ownProps, questionnaire);
        expect(onAddSection).toHaveBeenCalled();
      });
    });

    describe("when more than one section in questionnaire", () => {
      it("should redirect to another section", () => {
        handleDeletion(ownProps, questionnaire);
        expect(history.push).toHaveBeenCalled();
      });
    });
  });
});
