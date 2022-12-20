import React from "react";
import { render, screen, fireEvent, act, waitFor } from "tests/utils/rtl";
import userEvent from "@testing-library/user-event";

import PageTitleContainer from ".";
import PageTitleInput from "./PageTitleInput";

describe("Page Title container block", () => {
  it("should render without a collapsible", () => {
    render(
      <PageTitleContainer
        pageDescription="Test page title"
        onChange={jest.fn()}
        onUpdate={jest.fn()}
      />
    );
    expect(
      screen.queryByTestId("page-title-collapsible")
    ).not.toBeInTheDocument();
  });
  it("should render with a collapsible", () => {
    render(
      <PageTitleContainer
        inCollapsible
        pageDescription="Test page title"
        onChange={jest.fn()}
        onUpdate={jest.fn()}
      />
    );
    expect(screen.queryByTestId("page-title-collapsible")).toBeInTheDocument();
    // screen.debug();
  });
});

describe("Page title input block", () => {
  it("should render as expected", () => {
    render(
      <PageTitleInput
        pageDescription="Test page title"
        onUpdate={jest.fn()}
        onChange={jest.fn()}
      />
    );
    expect(screen.getByTestId("page-title-input-heading")).toHaveTextContent(
      "Descriptions and definitions"
    );
    expect(
      screen.getByTestId("page-title-input-field-label")
    ).toHaveTextContent("Page description");
    expect(
      screen.getByText("Why do I need a page description?")
    ).toBeInTheDocument();
  });
  it("should render an error when passed error=true", () => {
    render(
      <PageTitleInput
        pageDescription=""
        error
        onUpdate={jest.fn()}
        onChange={jest.fn()}
      />
    );
    expect(screen.getByTestId("page-title-missing-error")).toHaveTextContent(
      "Page description required"
    );
    expect(screen.getByTestId("txt-page-description")).toHaveAttribute(
      "value",
      ""
    );
  });
  it("should render change input id and name when given altFieldName", () => {
    render(
      <PageTitleInput
        pageDescription=""
        altFieldName="alt-field-name"
        onUpdate={jest.fn()}
        onChange={jest.fn()}
      />
    );
    expect(screen.getByTestId("txt-page-description")).toHaveAttribute(
      "id",
      "alt-field-name"
    );
    expect(screen.getByTestId("txt-page-description")).toHaveAttribute(
      "name",
      "alt-field-name"
    );
    // screen.debug();
  });
});

const mockMutations = {
  handleBlur: jest.fn(),
  handleChange: jest.fn(),
  handleUpdate: jest.fn(),
  handleFocus: jest.fn(),
  handleDelete: jest.fn(),
  handleEnterKey: jest.fn(),
  handleSubmit: jest.fn(),
};

const setup = (props) =>
  render(
    <PageTitleInput
      pageDescription="Initial page title"
      onUpdate={mockMutations.handleUpdate}
      onChange={mockMutations.handleChange}
      {...props}
    />
  );

describe("Page title text field", () => {
  it("Should call Change and Update correctly", async () => {
    setup();

    const renderedPageTitleInput = screen.getByLabelText("Page description");

    expect(renderedPageTitleInput.value).toBe("Initial page title");

    userEvent.type(renderedPageTitleInput, "Updated page title");

    await waitFor(() => {
      expect(mockMutations.handleChange).toHaveBeenCalledTimes(18);
      expect(mockMutations.handleUpdate).toHaveBeenCalledTimes(0);
    });

    fireEvent.blur(renderedPageTitleInput);

    await waitFor(() => {
      expect(mockMutations.handleChange).toHaveBeenCalledTimes(18);
      expect(mockMutations.handleUpdate).toHaveBeenCalledTimes(1);
    });
  });
});
