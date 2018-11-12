import {
  undeleteQuestionnaire,
  createUndelete,
  createUpdate
} from "redux/undelete/undeleteQuestionnaire";
import GetQuestionnaireList from "graphql/getQuestionnaireList.graphql";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";

describe("undeleteQuestionnaire", () => {
  let id;
  let context;

  let dispatch, getState, client, mutate, proxy, result;

  beforeEach(() => {
    id = "Questionnaire1";
    context = {
      questionnaireId: 1
    };

    dispatch = jest.fn();
    getState = jest.fn();
    mutate = jest.fn(() => Promise.resolve());

    client = {
      mutate
    };

    result = {
      data: {
        undeleteQuestionnaire: {
          id: 2,
          createdAt: "2018-04-02"
        }
      }
    };

    proxy = {
      readQuery: jest.fn(() => {
        return {
          questionnaires: [
            {
              id: 3,
              createdAt: "2018-04-03"
            },
            {
              id: 1,
              createdAt: "2018-04-01"
            }
          ]
        };
      }),
      writeQuery: jest.fn()
    };
  });

  it("should return a thunk function", () => {
    expect(undeleteQuestionnaire(id, context)).toEqual(expect.any(Function));
  });

  it("should call dispatch asynchronously when thunk is invoked", () => {
    const thunk = undeleteQuestionnaire(id, context);
    thunk(dispatch, getState, { client }).then(() => {
      expect(dispatch).toHaveBeenCalledTimes(2);
    });
  });

  describe("createUndelete", () => {
    it("should pass the id to mutate", () => {
      createUndelete(mutate)(id, context);
      expect(mutate).toHaveBeenCalledWith({
        update: expect.any(Function),
        variables: { input: { id } }
      });
    });
  });

  describe("createUpdate", () => {
    it("should call the correct query on the proxy", () => {
      createUpdate(context)(proxy, result);
    });

    it("should insert the questionnaire at the correct position", () => {
      createUpdate(context)(proxy, result);

      expect(proxy.readQuery).toHaveBeenCalledWith({
        query: GetQuestionnaireList
      });

      expect(proxy.writeQuery).toHaveBeenCalledWith({
        query: GetQuestionnaireList,
        data: {
          questionnaires: [
            {
              id: 3,
              createdAt: "2018-04-03"
            },
            {
              id: 2,
              createdAt: "2018-04-02"
            },
            {
              id: 1,
              createdAt: "2018-04-01"
            }
          ]
        }
      });
    });
  });

  describe("undeleteQuestionnaire integration tests", () => {
    let middleware;
    let mockStore;
    let store;

    beforeEach(() => {
      middleware = [thunk.withExtraArgument({ client })];
      mockStore = configureStore(middleware);
      store = mockStore({});
    });

    it("should send a request then a success action", () => {
      return store.dispatch(undeleteQuestionnaire(id, context)).then(() => {
        expect(store.getActions()).toEqual([
          {
            type: "UNDELETE_QUESTIONNAIRE_REQUEST"
          },
          {
            type: "UNDELETE_QUESTIONNAIRE_SUCCESS"
          }
        ]);
      });
    });

    it("should send a request then an error action", () => {
      client.mutate = jest.fn(() => Promise.reject());
      return store.dispatch(undeleteQuestionnaire(id, context)).then(() => {
        expect(store.getActions()).toEqual([
          {
            type: "UNDELETE_QUESTIONNAIRE_REQUEST"
          },
          {
            type: "UNDELETE_QUESTIONNAIRE_FAILURE"
          }
        ]);
      });
    });
  });
});
