import React from "react";
import { shallow } from "enzyme";
import { UnwrappedNavigationSidebar as NavigationSidebar } from "components/NavigationSidebar";
import { SynchronousPromise } from "synchronous-promise";

describe("NavigationSidebar", () => {
  let wrapper, handleAddSection, handleAddPage, handleUpdateQuestionnaire;

  const page = { id: "2", title: "Page", position: 0 };
  const section = { id: "3", title: "Section", pages: [page] };
  const questionnaire = {
    id: "1",
    title: "Questionnaire",
    sections: [section]
  };

  beforeEach(() => {
    handleAddSection = jest.fn(() => SynchronousPromise.resolve(questionnaire));
    handleAddPage = jest.fn(() => SynchronousPromise.resolve({ section }));
    handleUpdateQuestionnaire = jest.fn();

    wrapper = shallow(
      <NavigationSidebar
        questionnaire={questionnaire}
        onAddPage={handleAddPage}
        onAddSection={handleAddSection}
        onUpdateQuestionnaire={handleUpdateQuestionnaire}
        loading={false}
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
    wrapper.find("[data-test='nav-section-header']").simulate("addPage");

    expect(handleAddPage).toHaveBeenCalledWith();
  });
});
