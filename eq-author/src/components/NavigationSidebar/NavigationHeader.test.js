import React from "react";
import { shallow } from "enzyme";
import NavigationHeader from "components/NavigationSidebar/NavigationHeader";
import QuestionnaireSettingsModal from "components/QuestionnaireSettingsModal";
import MetadataModal from "components/MetadataModal";

describe("NavigationHeader", () => {
  let mockHandlers = {
    onAddPage: jest.fn(),
    onAddSection: jest.fn()
  };

  const createWrapper = props =>
    shallow(
      <NavigationHeader
        questionnaire={{}}
        onUpdateQuestionnaire={jest.fn()}
        {...mockHandlers}
        {...props}
      />
    );

  it("should render", () => {
    expect(createWrapper()).toMatchSnapshot();
  });

  it("allows settings modal to be open and closed", () => {
    const wrapper = createWrapper();

    wrapper.find(`[data-test="settings-btn"]`).simulate("click");
    expect(wrapper.find(QuestionnaireSettingsModal).prop("isOpen")).toBe(true);

    wrapper.find(QuestionnaireSettingsModal).simulate("close");
    expect(wrapper.find(QuestionnaireSettingsModal).prop("isOpen")).toBe(false);
  });

  it("allows metadata modal to be open and closed", () => {
    const wrapper = createWrapper();

    wrapper.find(`[data-test="metadata-btn"]`).simulate("click");
    expect(wrapper.find(MetadataModal).prop("isOpen")).toBe(true);

    wrapper.find(MetadataModal).simulate("close");
    expect(wrapper.find(MetadataModal).prop("isOpen")).toBe(false);
  });

  it("updates questionnaire after submission", () => {
    const onUpdateQuestionnaire = jest.fn();
    const wrapper = createWrapper({ onUpdateQuestionnaire });

    wrapper.find(QuestionnaireSettingsModal).simulate("submit");

    expect(onUpdateQuestionnaire).toHaveBeenCalled();
  });

  it("should allow a page to be added", () => {
    const wrapper = createWrapper();
    wrapper.find('[data-test="add-menu"]').simulate("addPage");

    expect(mockHandlers.onAddPage).toHaveBeenCalled();
  });

  it("should allow a section to be added", () => {
    const wrapper = createWrapper();
    wrapper.find('[data-test="add-menu"]').simulate("addSection");

    expect(mockHandlers.onAddSection).toHaveBeenCalled();
  });
});
