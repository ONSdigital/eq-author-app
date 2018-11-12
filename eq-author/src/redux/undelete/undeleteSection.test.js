import {
  undeleteSection,
  createUndelete,
  createUpdate
} from "redux/undelete/undeleteSection";
import fragment from "graphql/questionnaireFragment.graphql";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";

describe("undeleteSection", () => {
  let id;
  let context;

  let dispatch, getState, client, mutate, proxy, result;

  beforeEach(() => {
    id = "Section1";
    context = {
      questionnaireId: 1,
      sectionId: 1
    };

    dispatch = jest.fn();
    getState = jest.fn();
    mutate = jest.fn(() => Promise.resolve());

    client = {
      mutate
    };

    result = {
      data: {
        undeleteSection: {
          id: 1
        }
      }
    };

    proxy = {
      readFragment: jest.fn(() => {
        return {
          sections: []
        };
      }),
      writeFragment: jest.fn()
    };
  });

  it("should return a thunk function", () => {
    expect(undeleteSection(id, context)).toEqual(expect.any(Function));
  });

  it("should call dispatch asynchronously when thunk is invoked", () => {
    const thunk = undeleteSection(id, context);
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
        id: "Questionnaire1",
        fragment
      });
    });

    it("should write data back to the proxy", () => {
      createUpdate(context)(proxy, result);
      expect(proxy.writeFragment).toHaveBeenCalledWith({
        id: "Questionnaire1",
        fragment,
        data: {
          sections: [{ id: 1 }]
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
      return store.dispatch(undeleteSection(id, context)).then(() => {
        expect(store.getActions()).toEqual([
          {
            type: "UNDELETE_SECTION_REQUEST"
          },
          {
            type: "UNDELETE_SECTION_SUCCESS"
          }
        ]);
      });
    });

    it("should send a request then an error action", () => {
      client.mutate = jest.fn(() => Promise.reject());
      return store.dispatch(undeleteSection(id, context)).then(() => {
        expect(store.getActions()).toEqual([
          {
            type: "UNDELETE_SECTION_REQUEST"
          },
          {
            type: "UNDELETE_SECTION_FAILURE"
          }
        ]);
      });
    });
  });
});
