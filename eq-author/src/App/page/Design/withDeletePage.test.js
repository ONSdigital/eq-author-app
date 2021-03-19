import { mapMutateToProps } from "./withDeletePage";
import { buildQuestionnaire } from "tests/utils/createMockQuestionnaire";

describe("withDeletePage", () => {
  let history, mutate, result, ownProps, onAddQuestionPage, showToast;
  let deletedPage, currentPage, questionnaire;

  beforeEach(() => {
    questionnaire = buildQuestionnaire({ folderCount: 2, pageCount: 2 });

    const section = questionnaire.sections[0];
    currentPage = section.folders[0].pages[0];
    deletedPage = section.folders[1].pages[0];

    history = { push: jest.fn() };

    result = {
      data: {
        deletePage: {
          ...section,
          folders: [
            { ...section.folders[0] },
            {
              ...section.folders[1],
              pages: [{ ...section.folders[1].pages[1] }],
            },
          ],
        },
      },
    };

    onAddQuestionPage = jest.fn(() => Promise.resolve());
    showToast = jest.fn();

    ownProps = {
      client: {
        readFragment: jest.fn().mockReturnValueOnce(section),
      },
      match: {
        params: {
          questionnaireId: questionnaire.id,
          sectionId: section.id,
          pageId: currentPage.id,
        },
      },
      history,
      onAddQuestionPage,
      showToast,
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

      it("should show a toast message upon deletion of page", () => {
        return props.onDeletePage(deletedPage).then(() => {
          expect(showToast).toHaveBeenCalledWith(
            expect.stringContaining("Page")
          );
        });
      });

      it("should redirect to another page in the section", () => {
        return props.onDeletePage(deletedPage).then(() => {
          expect(history.push).toHaveBeenCalledWith(
            `/q/${questionnaire.id}/page/1.1.2/design`
          );
        });
      });
    });
  });
});
