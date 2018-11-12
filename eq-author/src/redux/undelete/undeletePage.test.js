import {
  undeletePage,
  createUndelete,
  createUpdate
} from "redux/undelete/undeletePage";
import fragment from "graphql/sectionFragment.graphql";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";

describe("undeletePage", () => {
  let id;
  let context;

  let dispatch, getState, client, mutate, proxy, result;

  beforeEach(() => {
    id = "Page1";
    context = {
      sectionId: 1,
      pageId: 1
    };

    dispatch = jest.fn();
    getState = jest.fn();
    mutate = jest.fn(() => Promise.resolve());

    client = {
      mutate
    };

    result = {
      data: {
        undeleteQuestionPage: {
          id: 1,
          position: 1
        }
      }
    };

    proxy = {
      readFragment: jest.fn(() => {
        return {
          pages: [{ id: 2, position: 0 }, { id: 3, position: 2 }]
        };
      }),
      writeFragment: jest.fn()
    };
  });

  it("should return a thunk function", () => {
    expect(undeletePage(id, context)).toEqual(expect.any(Function));
  });

  it("should call dispatch asynchronously when thunk is invoked", () => {
    const thunk = undeletePage(id, context);
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
    it("should insert the page at the correct position", () => {
      createUpdate(context)(proxy, result);

      expect(proxy.readFragment).toHaveBeenCalledWith({
        id: "Section1",
        fragment
      });

      expect(proxy.writeFragment).toHaveBeenCalledWith({
        id: "Section1",
        fragment,
        data: {
          pages: [
            { id: 2, position: 0 },
            { id: 1, position: 1 },
            { id: 3, position: 2 }
          ]
        }
      });
    });
  });

  describe("undeletePage integration tests", () => {
    let middleware;
    let mockStore;
    let store;

    beforeEach(() => {
      middleware = [thunk.withExtraArgument({ client })];
      mockStore = configureStore(middleware);
      store = mockStore({});
    });

    it("should send a request then a success action", () => {
      return store.dispatch(undeletePage(id, context)).then(() => {
        expect(store.getActions()).toEqual([
          {
            type: "UNDELETE_PAGE_REQUEST"
          },
          {
            type: "UNDELETE_PAGE_SUCCESS"
          }
        ]);
      });
    });

    it("should send a request then an error action", () => {
      client.mutate = jest.fn(() => Promise.reject());
      return store.dispatch(undeletePage(id, context)).then(() => {
        expect(store.getActions()).toEqual([
          {
            type: "UNDELETE_PAGE_REQUEST"
          },
          {
            type: "UNDELETE_PAGE_FAILURE"
          }
        ]);
      });
    });
  });
});
