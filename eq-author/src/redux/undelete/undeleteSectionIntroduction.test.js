import {
  createUndelete,
  undeleteSectionIntroduction,
  createUpdate,
} from "./undeleteSectionIntroduction";
import thunk from "redux-thunk";
import configureStore from "redux-mock-store";
import fragment from "graphql/fragments/section.graphql";

describe("undelete Section Introduction", () => {
  let introduction;
  let dispatch, getState, client, mutate, proxy, result, context;

  beforeEach(() => {
    dispatch = jest.fn();
    getState = jest.fn();
    mutate = jest.fn(() => Promise.resolve());

    client = {
      mutate,
    };
    introduction = {
      id: "1",
      introductionTitle: "Foo",
      introductionContent: "Bar",
    };

    context = {
      sectionId: 1,
      introductionTitle: "Foo",
      introductionContent: "Bar",
    };

    result = {
      data: {
        createSectionIntroduction: {
          id: 1,
          introductionTitle: "Foo",
          introductionContent: "Bar",
        },
      },
    };

    proxy = {
      readFragment: jest.fn(() => ({ introduction: null })),
      writeFragment: jest.fn(),
    };
  });

  it("should return a thunk function", () => {
    expect(undeleteSectionIntroduction("Section1", introduction)).toEqual(
      expect.any(Function)
    );
  });

  it("should call dispatch asynchronously when thunk is invoked", () => {
    const thunk = undeleteSectionIntroduction("Section1", introduction);
    thunk(dispatch, getState, { client }).then(() => {
      expect(dispatch).toHaveBeenCalledTimes(2);
    });
  });

  it("should pass section to mutate", () => {
    createUndelete(mutate)(introduction);
    expect(mutate).toHaveBeenCalledWith({
      update: expect.any(Function),
      variables: {
        input: {
          sectionId: introduction.id,
          introductionContent: introduction.introductionContent,
          introductionTitle: introduction.introductionTitle,
        },
      },
    });
  });

  describe("createUpdate", () => {
    it("should call the correct query on the proxy", () => {
      createUpdate(context)(proxy, result);
      expect(proxy.readFragment).toHaveBeenCalledWith({
        id: "Section1",
        fragment,
      });
    });

    it("should write data back to the proxy", () => {
      createUpdate(context)(proxy, result);
      expect(proxy.writeFragment).toHaveBeenCalledWith({
        id: "Section1",
        fragment,
        data: {
          introduction: {
            id: 1,
            introductionTitle: "Foo",
            introductionContent: "Bar",
          },
        },
      });
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
      return store
        .dispatch(undeleteSectionIntroduction("Section1", introduction))
        .then(() => {
          expect(store.getActions()).toEqual([
            {
              type: "UNDELETE_SECTION_INTRODUCTION_REQUEST",
            },
            {
              type: "UNDELETE_SECTION_INTRODUCTION_SUCCESS",
            },
          ]);
        });
    });

    it("should send a request then an error action", () => {
      client.mutate = jest.fn(() => Promise.reject());
      return store
        .dispatch(undeleteSectionIntroduction("Section1", introduction))
        .then(() => {
          expect(store.getActions()).toEqual([
            {
              type: "UNDELETE_SECTION_INTRODUCTION_REQUEST",
            },
            {
              type: "UNDELETE_SECTION_INTRODUCTION_FAILURE",
            },
          ]);
        });
    });
  });
});
