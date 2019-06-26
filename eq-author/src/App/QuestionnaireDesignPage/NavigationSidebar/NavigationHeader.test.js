import React from "react";
import { shallow } from "enzyme";
import MetadataModal from "App/MetadataModal";
import { NavigationHeader } from "./NavigationHeader";

describe("NavigationHeader", () => {
  let mockHandlers = {
    onAddQuestionPage: jest.fn(),
    onAddSection: jest.fn(),
    onAddQuestionConfirmation: jest.fn(),
    onAddCalculatedSummaryPage: jest.fn(),
  };

  const createWrapper = props =>
    shallow(
      <NavigationHeader
        questionnaire={{}}
        canAddQuestionPage
        canAddCalculatedSummaryPage
        canAddQuestionConfirmation
        onUpdateQuestionnaire={jest.fn()}
        match={{ params: {} }}
        {...mockHandlers}
        {...props}
      />
    );

  it("should render", () => {
    expect(createWrapper()).toMatchSnapshot();
  });

  it("allows metadata Modals to be open and closed", () => {
    const wrapper = createWrapper();

    wrapper.find(`[data-test="metadata-btn"]`).simulate("click");
    expect(wrapper.find(MetadataModal).prop("isOpen")).toBe(true);

    wrapper.find(MetadataModal).simulate("close");
    expect(wrapper.find(MetadataModal).prop("isOpen")).toBe(false);
  });

  it("should allow a page to be added", () => {
    const wrapper = createWrapper();
    wrapper.find('[data-test="add-menu"]').simulate("addQuestionPage");

    expect(mockHandlers.onAddQuestionPage).toHaveBeenCalled();
  });

  it("should allow a section to be added", () => {
    const wrapper = createWrapper();
    wrapper.find('[data-test="add-menu"]').simulate("addSection");

    expect(mockHandlers.onAddSection).toHaveBeenCalled();
  });

  it("should allow a calculated summary to be added", () => {
    const wrapper = createWrapper();
    wrapper.find('[data-test="add-menu"]').simulate("addCalculatedSummaryPage");
    expect(mockHandlers.onAddCalculatedSummaryPage).toHaveBeenCalled();
  });

  it("should allow a question confirmation to be added", () => {
    const wrapper = createWrapper();
    wrapper.find('[data-test="add-menu"]').simulate("addQuestionConfirmation");

    expect(mockHandlers.onAddQuestionConfirmation).toHaveBeenCalled();
  });
});
