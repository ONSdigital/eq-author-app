import getQuestionnaireList from "graphql/getQuestionnaireList.graphql";
import { mapMutateToProps, handleUpdate } from "./withDuplicateQuestionnaire";

const nextId = (previousId) => `${parseInt(previousId, 10) + 1}`;

describe("withDuplicateQuestionnaire", () => {
  let ownProps,
    history,
    props,
    mutate,
    questionnaire,
    user,
    duplicationResult,
    realNow;

  beforeEach(() => {
    history = {
      push: jest.fn(),
    };

    ownProps = {
      history,
    };

    questionnaire = {
      id: "10",
      displayName: "My questionnaire",
      createdBy: {
        name: "Foo Person",
        __typename: "User",
      },
    };

    user = {
      displayName: "Foo Person",
    };

    duplicationResult = {
      data: {
        duplicateQuestionnaire: {
          id: nextId(questionnaire.id),
          sections: [
            {
              id: "2",
              folders: [
                {
                  id: "folder-1",
                  pages: [
                    {
                      id: "3",
                    },
                  ],
                },
              ],
            },
          ],
        },
      },
    };

    mutate = jest.fn(() => Promise.resolve(duplicationResult));
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
          },
        },
      });
    });

    it("should redirect to first page of first section when no introduction", async () => {
      await props.onDuplicateQuestionnaire(questionnaire, user);
      expect(ownProps.history.push).toHaveBeenCalledWith(
        "/q/11/page/3/design/settings"
      );
    });

    it("should redirect to the introduction page when there is one", async () => {
      duplicationResult.data.duplicateQuestionnaire.introduction = {
        id: "5",
      };
      await props.onDuplicateQuestionnaire(questionnaire, user);
      expect(ownProps.history.push).toHaveBeenCalledWith(
        "/q/11/introduction/5/design/settings"
      );
    });
  });

  describe("handleUpdate", () => {
    it("should update the questionnaire list cache to start with the duplicate", () => {
      const proxy = {
        readQuery: jest.fn().mockReturnValue({
          questionnaires: [{ id: 1 }, { id: 2 }],
        }),
        writeQuery: jest.fn(),
      };

      handleUpdate(proxy, {
        data: { duplicateQuestionnaire: { id: "dupe" } },
      });

      expect(proxy.readQuery).toHaveBeenCalledWith({
        query: getQuestionnaireList,
      });
      expect(proxy.writeQuery).toHaveBeenCalledWith({
        query: getQuestionnaireList,
        data: {
          questionnaires: [{ id: "dupe" }, { id: 1 }, { id: 2 }],
        },
      });
    });
  });
});
