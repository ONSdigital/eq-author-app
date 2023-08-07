import React from "react";
import { render, screen, fireEvent, waitFor } from "tests/utils/rtl";
import userEvent from "@testing-library/user-event";

import PageTitleContainer from ".";
import PageTitleInput from "./PageTitleInput";

describe("Page Title container block", () => {
  it("should render as expected", () => {
    render(
      <PageTitleContainer
        pageDescription="Test page title"
        onChange={jest.fn()}
        onUpdate={jest.fn()}
      />
    );

    expect(screen.queryByTestId("page-title-container")).toBeInTheDocument();
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
      "Page title and description"
    );
    expect(
      screen.getByTestId("page-title-input-field-label")
    ).toHaveTextContent("Page description");
  });

  it("should render an error when passed errorMessage", () => {
    render(
      <PageTitleInput
        pageDescription=""
        errorMessage="Test page description error message"
        onUpdate={jest.fn()}
        onChange={jest.fn()}
      />
    );

    expect(screen.getByTestId("page-title-missing-error")).toHaveTextContent(
      "Test page description error message"
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
  });

  it("should render page title input with prefix", () => {
    render(
      <PageTitleInput
        pageDescription="Test page title"
        inputTitlePrefix={"Section"}
        onUpdate={jest.fn()}
        onChange={jest.fn()}
      />
    );

    expect(screen.getByTestId("page-title-input-heading")).toHaveTextContent(
      "Page title and description"
    );
    expect(
      screen.getByTestId("page-title-input-field-label")
    ).toHaveTextContent("Section page description");
  });

  it("should render custom input heading", () => {
    render(
      <PageTitleInput
        pageDescription="Test page title"
        heading="Test page description"
        onUpdate={jest.fn()}
        onChange={jest.fn()}
      />
    );

    expect(
      screen.getByTestId("page-title-input-heading")
    ).not.toHaveTextContent("Descriptions and definitions");

    expect(screen.getByTestId("page-title-input-heading")).toHaveTextContent(
      "Test page description"
    );

    expect(
      screen.getByTestId("page-title-input-field-label")
    ).toHaveTextContent("Page description");
  });
});

const mockMutations = {
  handleChange: jest.fn(),
  handleUpdate: jest.fn(),
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
