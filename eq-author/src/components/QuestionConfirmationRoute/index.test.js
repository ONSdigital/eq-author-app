import React from "react";
import { shallow } from "enzyme";

import { UnwrappedQuestionConfirmationRoute as QuestionConfirmationRoute } from "./";

describe("QuestionConfirmationRoute", () => {
  let mockHandlers;

  const defaultProps = {
    loading: false,
    data: {
      questionConfirmation: {
        id: "1",
        displayName: "My first displayname",
        title: "My first confirmation",
        page: {
          id: "1",
          displayName: "My question",
          answers: []
        },
        positive: {
          label: "Positive label",
          description: "Positive description"
        },
        negative: {
          label: "Negative label",
          description: "Negative description"
        }
      }
    }
  };

  const render = props => {
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
      onDeleteQuestionConfirmation: jest.fn()
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

  it("should delete the confirmation when the toolbar delete button is clicked", () => {
    const wrapper = render();
    wrapper.find(`[data-test="btn-delete"]`).simulate("click");
    expect(mockHandlers.onDeleteQuestionConfirmation).toHaveBeenCalledWith(
      defaultProps.data.questionConfirmation
    );
  });
});
