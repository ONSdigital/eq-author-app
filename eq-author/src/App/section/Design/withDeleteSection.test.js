import { mapMutateToProps, handleDeletion } from "./withDeleteSection";
import {
  buildQuestionnaire,
  buildFolders,
} from "tests/utils/createMockQuestionnaire";

describe("withDeleteSection", () => {
  let history, mutate, result, ownProps, onAddSection, showToast;
  let currentPage, currentSection, questionnaire, defaultOptions;

  beforeEach(() => {
    questionnaire = buildQuestionnaire({ sectionCount: 2 });
    currentSection = questionnaire.sections[0];
    currentPage = currentSection.folders[0].pages[0];

    history = {
      push: jest.fn(),
    };

    result = {
      data: {
        deleteSection: {
          ...questionnaire,
          sections: [questionnaire.sections[1]],
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

    defaultOptions = {
      variables: {
        input: {
          id: currentSection.id,
        },
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
        return props.onDeleteSection(currentSection.id).then(() => {
          expect(showToast).toHaveBeenCalledWith(
            expect.stringContaining("1 page")
          );
        });
      });

      it("should pluralize the number of deleted pages in toast", () => {
        currentSection.folders = buildFolders({ folderCount: 2 });

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

      it("should refetch questionnaire after deleting a section", async () => {
        await props.onDeleteSection(currentSection.id);
        expect(mutate).toHaveBeenCalledWith({
          ...defaultOptions,
          refetchQueries: ["GetQuestionnaire"],
        });
      });
    });
  });

  describe("handleDeletion", () => {
    it("should redirect to another section", () => {
      handleDeletion(ownProps, result, questionnaire);
      expect(history.push).toHaveBeenCalled();
    });
  });
});
