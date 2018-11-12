import {
  createUndelete,
  undeleteSectionIntroduction
} from "./undeleteSectionIntroduction";
import thunk from "redux-thunk";
import configureStore from "redux-mock-store";

describe("undelete Section Introduction", () => {
  let section;
  let dispatch, getState, client, mutate;

  beforeEach(() => {
    dispatch = jest.fn();
    getState = jest.fn();
    mutate = jest.fn(() => Promise.resolve());

    client = {
      mutate
    };
    section = {
      id: 1,
      introductionTitle: "Foo",
      introductionContent: "Bar",
      introductionEnabled: true
    };
  });

  it("should return a thunk function", () => {
    expect(undeleteSectionIntroduction(section)).toEqual(expect.any(Function));
  });

  it("should call dispatch asynchronously when thunk is invoked", () => {
    const thunk = undeleteSectionIntroduction(section);
    thunk(dispatch, getState, { client }).then(() => {
      expect(dispatch).toHaveBeenCalledTimes(2);
    });
  });
  it("should pass section to mutate", () => {
    createUndelete(mutate)(section);
    expect(mutate).toHaveBeenCalledWith({
      update: expect.any(Function),
      variables: {
        input: {
          id: 1,
          introductionContent: "Bar",
          introductionEnabled: true,
          introductionTitle: "Foo"
        }
      }
    });
  });

  describe("undelete section introduction intergration test", () => {
    let middleware;
    let mockStore;
    let store;

    beforeEach(() => {
      middleware = [thunk.withExtraArgument({ client })];
      mockStore = configureStore(middleware);
      store = mockStore({});
    });

    it("should send a request then a success action", () => {
      return store.dispatch(undeleteSectionIntroduction(section)).then(() => {
        expect(store.getActions()).toEqual([
          {
            type: "UNDELETE_SECTION_INTRODUCTION_REQUEST"
          },
          {
            type: "UNDELETE_SECTION_INTRODUCTION_SUCCESS"
          }
        ]);
      });
    });

    it("should send a request then an error action", () => {
      client.mutate = jest.fn(() => Promise.reject());
      return store.dispatch(undeleteSectionIntroduction(section)).then(() => {
        expect(store.getActions()).toEqual([
          {
            type: "UNDELETE_SECTION_INTRODUCTION_REQUEST"
          },
          {
            type: "UNDELETE_SECTION_INTRODUCTION_FAILURE"
          }
        ]);
      });
    });
  });
});
