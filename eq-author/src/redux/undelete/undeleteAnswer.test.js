import {
  undeleteAnswer,
  createUndelete,
  createUpdate
} from "redux/undelete/undeleteAnswer";
import fragment from "graphql/pageFragment.graphql";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";

describe("undeleteAnswer", () => {
  let id;
  let context;

  let dispatch, getState, client, mutate, proxy, result;

  beforeEach(() => {
    id = "Answer1";
    context = {
      pageId: 1,
      answerId: 1
    };

    dispatch = jest.fn();
    getState = jest.fn();
    mutate = jest.fn(() => Promise.resolve());

    client = {
      mutate
    };

    result = {
      data: {
        undeleteAnswer: {
          id: 1
        }
      }
    };

    proxy = {
      readFragment: jest.fn(() => {
        return {
          answers: []
        };
      }),
      writeFragment: jest.fn()
    };
  });

  it("should return a thunk function", () => {
    expect(undeleteAnswer(id, context)).toEqual(expect.any(Function));
  });

  it("should call dispatch asynchronously when thunk is invoked", () => {
    const thunk = undeleteAnswer(id, context);
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
      expect(proxy.readFragment).toHaveBeenCalledWith({
        id: "QuestionPage1",
        fragment
      });
    });

    it("should write data back to the proxy", () => {
      createUpdate(context)(proxy, result);
      expect(proxy.writeFragment).toHaveBeenCalledWith({
        id: "QuestionPage1",
        fragment,
        data: {
          answers: [{ id: 1 }]
        }
      });
    });
  });

  describe("undeleteAnswer integration tests", () => {
    let middleware;
    let mockStore;
    let store;

    beforeEach(() => {
      middleware = [thunk.withExtraArgument({ client })];
      mockStore = configureStore(middleware);
      store = mockStore({});
    });

    it("should send a request then a success action", () => {
      return store.dispatch(undeleteAnswer(id, context)).then(() => {
        expect(store.getActions()).toEqual([
          {
            type: "UNDELETE_ANSWER_REQUEST"
          },
          {
            type: "UNDELETE_ANSWER_SUCCESS"
          }
        ]);
      });
    });

    it("should send a request then an error action", () => {
      client.mutate = jest.fn(() => Promise.reject());
      return store.dispatch(undeleteAnswer(id, context)).then(() => {
        expect(store.getActions()).toEqual([
          {
            type: "UNDELETE_ANSWER_REQUEST"
          },
          {
            type: "UNDELETE_ANSWER_FAILURE"
          }
        ]);
      });
    });
  });
});
