import getQuestionnaireList from "graphql/getQuestionnaireList.graphql";
import { mapMutateToProps, handleUpdate } from "./withDuplicateQuestionnaire";

const nextId = previousId => `${parseInt(previousId, 10) + 1}`;

describe("withDuplicateQuestionnaire", () => {
  let ownProps,
    history,
    match,
    props,
    mutate,
    questionnaire,
    user,
    expectedResult;

  beforeEach(() => {
    ownProps = {
      history,
      match
    };

    questionnaire = {
      id: "1",
      title: "My questionnaire"
    };

    user = {
      displayName: "Foo Person"
    };

    expectedResult = {
      data: {
        duplicateQuestionnaire: {
          id: nextId(questionnaire.id)
        }
      }
    };
  });

  describe("mapMutateToProps", () => {
    let realNow;
    beforeEach(() => {
      mutate = jest.fn(() => Promise.resolve(expectedResult));
      props = mapMutateToProps({ ownProps, mutate });
      realNow = Date.now.bind(global.Date);
      global.Date.now = jest.fn(() => 1530518207007);
    });

    afterEach(() => {
      global.Date.now = realNow;
    });

    it("supplies an onDuplicateQuestionnaire prop", () => {
      expect(props.onDuplicateQuestionnaire).toBeInstanceOf(Function);
    });

    describe("onDuplicateQuestionnaire", () => {
      it("provides the necessary arguments to mutate", async () => {
        await props.onDuplicateQuestionnaire(questionnaire, user);

        expect(mutate).toHaveBeenCalledWith({
          variables: {
            input: {
              id: questionnaire.id,
              createdBy: "Foo Person"
            }
          },
          optimisticResponse: {
            duplicateQuestionnaire: {
              __typename: "Questionnaire",
              id: "dupe-1",
              title: "Copy of My questionnaire",
              createdAt: new Date(Date.now()).toISOString(),
              createdBy: {
                name: "Foo Person",
                __typename: "User"
              }
            }
          }
        });
      });

      it("should return promise that resolves to duplicateSection result", async () => {
        const result = await props.onDuplicateQuestionnaire(
          questionnaire,
          user
        );
        return expect(result).toBe(expectedResult.data.duplicateQuestionnaire);
      });
    });

    describe("handleUpdate", () => {
      it("should update the questionnaire list cache to start with the duplicate", () => {
        const proxy = {
          readQuery: jest.fn().mockReturnValue({
            questionnaires: [{ id: 1 }, { id: 2 }]
          }),
          writeQuery: jest.fn()
        };

        handleUpdate(proxy, {
          data: { duplicateQuestionnaire: { id: "dupe" } }
        });

        expect(proxy.readQuery).toHaveBeenCalledWith({
          query: getQuestionnaireList
        });
        expect(proxy.writeQuery).toHaveBeenCalledWith({
          query: getQuestionnaireList,
          data: {
            questionnaires: [{ id: "dupe" }, { id: 1 }, { id: 2 }]
          }
        });
      });
    });
  });
});
