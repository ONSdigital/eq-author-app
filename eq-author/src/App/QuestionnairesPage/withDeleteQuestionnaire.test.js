import { mapMutateToProps, handleUpdate } from "./withDeleteQuestionnaire";
import getQuestionnaireList from "graphql/getQuestionnaireList.graphql";

describe("withDeleteQuestionnaire", () => {
  let mutate, result, ownProps, onAddPage, showToast;
  let questionnaire;

  beforeEach(() => {
    questionnaire = {
      id: "1",
    };

    result = {
      data: {
        deleteQuestionnaire: questionnaire,
      },
    };

    showToast = jest.fn(() => Promise.resolve());

    ownProps = {
      questionnaireId: questionnaire.id,
      onAddPage,
      showToast,
    };

    mutate = jest.fn(() => Promise.resolve(result));
  });

  describe("handleUpdate", () => {
    let cachedQuestionnaires = [
      {
        id: "1",
      },
      {
        id: "2",
      },
      {
        id: "3",
      },
    ];

    it("should remove the questionnaire from the cache", () => {
      const readQuery = jest.fn(() => ({
        questionnaires: cachedQuestionnaires,
      }));

      const writeQuery = jest.fn();

      const proxy = {
        readQuery,
        writeQuery,
      };

      handleUpdate(proxy, {
        data: {
          deleteQuestionnaire: {
            id: "1",
          },
        },
      });

      expect(readQuery).toHaveBeenCalledWith({
        query: getQuestionnaireList,
      });

      expect(writeQuery).toHaveBeenCalledWith({
        query: getQuestionnaireList,
        data: {
          questionnaires: [
            {
              id: "2",
            },
            {
              id: "3",
            },
          ],
        },
      });
    });
  });

  describe("mapMutateToProps", () => {
    let props;

    const questionnaireId = "1";

    beforeEach(() => {
      props = mapMutateToProps({ ownProps, mutate });
    });

    it("should have a onDeleteQuestionnaire prop", () => {
      expect(props.onDeleteQuestionnaire).toBeInstanceOf(Function);
    });

    describe("onDeleteQuestionnaire", () => {
      it("should call mutate with the questionnaire Id", () => {
        return props.onDeleteQuestionnaire(questionnaireId).then(() => {
          expect(mutate).toHaveBeenCalledWith(
            expect.objectContaining({
              variables: {
                input: { id: questionnaireId },
              },
              context: {
                headers: {
                  questionnaireId,
                },
              },
            })
          );
        });
      });

      it("should show a toast after invking onDeleteQuestionnaire", () => {
        return props.onDeleteQuestionnaire(questionnaireId).then(() => {
          expect(showToast).toHaveBeenCalledWith(
            expect.stringContaining("Questionnaire")
          );
        });
      });

      it("should provide mutate with an optimistic response", () => {
        return props.onDeleteQuestionnaire(questionnaireId).then(() => {
          expect(mutate).toHaveBeenCalledWith(
            expect.objectContaining({
              optimisticResponse: {
                deleteQuestionnaire: {
                  id: questionnaireId,
                  __typename: "Questionnaire",
                },
              },
            })
          );
        });
      });
    });
  });
});
