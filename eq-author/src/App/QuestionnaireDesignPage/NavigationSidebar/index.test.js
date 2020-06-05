import React from "react";
import { shallow } from "enzyme";
// import { render, fireEvent } from "tests/utils/rtl";
import { UnwrappedNavigationSidebar as NavigationSidebar } from "./";
import { SynchronousPromise } from "synchronous-promise";

describe("NavigationSidebar", () => {
  let props;
  beforeEach(() => {
    const page = { id: "2", title: "Page", position: 0 };
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
});
