import React from "react";
import { shallow } from "enzyme";

import IconButtonDelete from "components/buttons/IconButtonDelete";
import DeleteModal from "components-themed/Modal";
import { UnwrappedQuestionConfirmationRoute as QuestionConfirmationRoute } from "./";

jest.mock("components/NavigationCallbacks", () => ({
  useSetNavigationCallbacksForPage: () => null,
}));

describe("QuestionConfirmationRoute", () => {
  let mockHandlers;

  const defaultProps = {
    loading: false,
    data: {
      questionConfirmation: {
        id: "1",
        displayName: "My first displayname",
        title: "My first confirmation",
        qCode: "",
        page: {
          id: "1",
          displayName: "My question",
          answers: [],
        },
        positive: {
          id: "1",
          label: "Positive label",
          description: "Positive description",
          validationErrorInfo: [],
        },
        negative: {
          id: "2",
          label: "Negative label",
          description: "Negative description",
          validationErrorInfo: [],
        },
      },
    },
  };

  const render = (props) => {
    return shallow(
      <QuestionConfirmationRoute
        {...mockHandlers}
        {...defaultProps}
        {...props}
      />
    );
  };

  beforeEach(() => {
    mockHandlers = {
      onUpdateQuestionConfirmation: jest.fn(),
      onDeleteQuestionConfirmation: jest.fn(),
      getValidationError: jest.fn(),
    };
  });

  it("should render", () => {
    expect(render()).toMatchSnapshot();
  });

  it("should show loading info when loading", () => {
    expect(render({ loading: true })).toMatchSnapshot();
  });

  it("should show error info when there is an error", () => {
    expect(render({ error: { message: "some error" } })).toMatchSnapshot();
  });

  it("should update the confirmation page when requested to", () => {
    const wrapper = render();
    wrapper
      .find(`[data-test="editor"]`)
      .simulate("update", "Updated question confirmation");
    expect(mockHandlers.onUpdateQuestionConfirmation).toHaveBeenCalledWith(
      "Updated question confirmation"
    );
  });

  it("should open delete confirm dialog when the toolbar delete button is clicked", () => {
    const wrapper = render();
    expect(wrapper.find(DeleteModal).prop("isOpen")).toBeFalsy();
    wrapper.find(IconButtonDelete).simulate("click");
    expect(wrapper.find(DeleteModal).prop("isOpen")).toBeTruthy();
  });

  it("should delete question confirmation when modal confirm clicked", () => {
    const wrapper = render();
    wrapper.find(DeleteModal).simulate("confirm");
    expect(mockHandlers.onDeleteQuestionConfirmation).toHaveBeenCalledWith(
      defaultProps.data.questionConfirmation
    );
  });

  it("should close modal when modal cancel clicked", () => {
    const wrapper = render();

    expect(wrapper.find(DeleteModal).prop("isOpen")).toBeFalsy();
    wrapper.find(IconButtonDelete).simulate("click");
    expect(wrapper.find(DeleteModal).prop("isOpen")).toBeTruthy();

    wrapper.find(DeleteModal).simulate("close");
    expect(wrapper.find(DeleteModal).prop("isOpen")).toBeFalsy();
  });
});
