import React from "react";
import { shallow } from "enzyme";
import { render, fireEvent } from "tests/utils/rtl";
import {
  UnwrappedNavigationSidebar as NavigationSidebar,
  sidebarActionTypes,
  sidebarReducer,
  accordionActionTypes,
  accordionGroupReducer,
} from "./";
import { SynchronousPromise } from "synchronous-promise";

describe("NavigationSidebar", () => {
  let props;
  beforeEach(() => {
    const page = {
      id: "2",
      title: "Page",
      position: 0,
      validationErrorInfo: {
        totalCount: 5,
      },
    };
    const section = {
      id: "3",
      title: "Section",
      pages: [page],
      validationErrorInfo: { totalCount: 0 },
    };
    const questionnaire = {
      id: "1",
      title: "Questionnaire",
      sections: [section],
    };
    props = {
      questionnaire,
      onAddSection: jest.fn(() => SynchronousPromise.resolve(questionnaire)),
      onAddQuestionPage: jest.fn(() => SynchronousPromise.resolve({ section })),
      canAddQuestionPage: true,
      onAddCalculatedSummaryPage: jest.fn(),
      canAddCalculatedSummaryPage: true,
      onUpdateQuestionnaire: jest.fn(),
      onAddQuestionConfirmation: jest.fn(),
      canAddQuestionConfirmation: true,
      loading: false,
    };
  });

  it("should render", () => {
    const wrapper = shallow(<NavigationSidebar {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it("should only render container if loading", () => {
    const wrapper = shallow(<NavigationSidebar {...props} loading />);
    expect(wrapper).toMatchSnapshot();
  });

  it("should allow sections to be added", () => {
    const wrapper = shallow(<NavigationSidebar {...props} />);
    wrapper.find("[data-test='nav-section-header']").simulate("addSection");
    expect(props.onAddSection).toHaveBeenCalledWith(props.questionnaire.id);
  });

  it("should allow pages to be added", () => {
    const wrapper = shallow(<NavigationSidebar {...props} />);
    wrapper
      .find("[data-test='nav-section-header']")
      .simulate("addQuestionPage");

    expect(props.onAddQuestionPage).toHaveBeenCalledWith();
  });

  it("should render an introduction nav item when the questionnaire has one", () => {
    props.questionnaire.introduction = {
      id: "1",
    };
    const wrapper = shallow(<NavigationSidebar {...props} />);
    expect(wrapper.find("[data-test='nav-introduction']")).toHaveLength(1);
  });

  it("should have all accordions open on default and then close them", () => {
    const extraSection = {
      id: "3",
      title: "Section",
      pages: [{ id: "4", title: "Page", position: 0 }],
    };
    props.questionnaire.sections.concat(extraSection);
    const wrapper = shallow(<NavigationSidebar {...props} />);
    const toggleAll = wrapper.find("[data-test='toggle-all-accordions']");

    expect(toggleAll.text()).toEqual("Close all");
    expect(toggleAll).toHaveLength(1);

    wrapper.find("[data-test='toggle-all-accordions']").simulate("click");
    expect(wrapper.find("[data-test='toggle-all-accordions']").text()).toEqual(
      "Open all"
    );
  });

  it("should handle accordions opening/closing", () => {
    // using this to temp disable proptype errors from nested components
    jest.spyOn(console, "error").mockImplementation(() => jest.fn());
    const { queryAllByTestId } = render(<NavigationSidebar {...props} />);

    const firstAccordion = queryAllByTestId("accordion-undefined-button")[0];

    expect(firstAccordion.getAttribute("aria-expanded")).toBe("true");
    fireEvent.click(firstAccordion);
    expect(firstAccordion.getAttribute("aria-expanded")).toBe("false");
  });

  describe("Sidebar sidebarReducer function", () => {
    let state;
    beforeEach(() => {
      state = {
        label: true,
        isOpen: { open: true },
      };
    });

    it("it should throw", () => {
      const reducerWrapper = () => sidebarReducer(state, { type: "dummy" });
      expect(reducerWrapper).toThrow();
    });

    it("it should handleClick", () => {
      const updatedState = sidebarReducer(state, {
        type: sidebarActionTypes.handleClick,
      });

      expect(updatedState.isOpen).toEqual({ open: false });
      expect(updatedState.label).toEqual(false);

      state.label = false;
      const alternateState = sidebarReducer(state, {
        type: sidebarActionTypes.handleClick,
      });

      expect(alternateState.isOpen).toEqual({ open: true });
      expect(alternateState.label).toEqual(true);
    });

    it("it should toggle label", () => {
      const updatedState = sidebarReducer(state, {
        type: sidebarActionTypes.toggleLabel,
      });

      expect(updatedState.isOpen).toEqual({ open: true });
      expect(updatedState.label).toEqual(false);
    });
  });

  describe("Accordion group sidebarReducer function", () => {
    let array;
    beforeEach(() => {
      array = [
        { id: 0, isOpen: true },
        { id: 1, isOpen: true },
        { id: 2, isOpen: true },
      ];
    });

    it("should throw", () => {
      const reducerWrapper = () =>
        accordionGroupReducer(array, { type: "dummy" });
      expect(reducerWrapper).toThrow();
    });

    it("should create a new array", () => {
      const testArray = [1, 2, 3, 4, 5];
      const newArray = accordionGroupReducer(testArray, {
        type: "create",
        payload: { isOpen: false },
      });

      expect(newArray.length).toBe(testArray.length);
      expect(newArray.every(item => item.isOpen === false)).toBeTruthy();
    });
    it("should update an existing array", () => {
      const updatedArray = accordionGroupReducer(array, {
        type: accordionActionTypes.update,
        payload: { event: { id: 0, isOpen: false } },
      });

      expect(updatedArray.length).toEqual(array.length);
      expect(updatedArray.find(item => item.id === 0).isOpen).toBeFalsy();
    });
    it("should create and update an array of values", () => {
      const testArray = [1, 2];
      const newArray = accordionGroupReducer(testArray, {
        type: accordionActionTypes.createAndUpdate,
        payload: { isOpen: true, event: { id: 0, isOpen: false } },
      });

      expect(newArray.length).toBe(testArray.length);
      expect(newArray.find(item => item.id === 0).isOpen).toBeFalsy();
      expect(newArray).toEqual([
        { id: 1, isOpen: true },
        { id: 0, isOpen: false },
      ]);
    });
  });
});
