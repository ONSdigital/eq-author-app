import React from "react";
import { shallow } from "enzyme";
import { UnwrappedNavigationSidebar as NavigationSidebar } from "./";
import { SynchronousPromise } from "synchronous-promise";

describe("NavigationSidebar", () => {
  let wrapper,
    handleAddSection,
    handleAddQuestionPage,
    handleUpdateQuestionnaire,
    handleAddQuestionConfirmation;

  const page = { id: "2", title: "Page", position: 0 };
  const section = { id: "3", title: "Section", pages: [page] };
  const questionnaire = {
    id: "1",
    title: "Questionnaire",
    sections: [section],
  };

  beforeEach(() => {
    handleAddSection = jest.fn(() => SynchronousPromise.resolve(questionnaire));
    handleAddQuestionPage = jest.fn(() =>
      SynchronousPromise.resolve({ section })
    );
    handleUpdateQuestionnaire = jest.fn();
    handleAddQuestionConfirmation = jest.fn();

    wrapper = shallow(
      <NavigationSidebar
        questionnaire={questionnaire}
        onAddQuestionPage={handleAddQuestionPage}
        onAddSection={handleAddSection}
        onUpdateQuestionnaire={handleUpdateQuestionnaire}
        onAddQuestionConfirmation={handleAddQuestionConfirmation}
        loading={false}
        canAddQuestionConfirmation
      />
    );
  });

  it("should render", () => {
    expect(wrapper).toMatchSnapshot();
  });

  it("should only render container if loading", () => {
    wrapper.setProps({ loading: true });
    expect(wrapper).toMatchSnapshot();
  });

  it("should allow sections to be added", () => {
    wrapper.find("[data-test='nav-section-header']").simulate("addSection");
    expect(handleAddSection).toHaveBeenCalledWith(questionnaire.id);
  });

  it("should allow pages to be added", () => {
    wrapper
      .find("[data-test='nav-section-header']")
      .simulate("addQuestionPage");

    expect(handleAddQuestionPage).toHaveBeenCalledWith();
  });
});
