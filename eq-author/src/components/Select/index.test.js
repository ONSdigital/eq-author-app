import React from "react";
import { render } from "tests/utils/rtl";
import { colors } from "constants/theme";

import Select from ".";

const renderSelect = (props) => {
  return render(<Select {...props} />);
};

describe("Select component", () => {
  it("should render without error styling", () => {
    const { getByTestId } = renderSelect({
      name: "select-1",
      dataTest: "select-1",
      options: [],
      value: "select-value-1",
      hasError: false,
      handleChange: jest.fn(),
    });

    expect(getByTestId("select-1")).toBeInTheDocument();
    expect(getByTestId("select-1")).not.toHaveStyleRule(
      "border-color",
      `${colors.errorPrimary}`
    );
  });

  it("should render options", () => {
    const { getByText } = renderSelect({
      name: "select-1",
      dataTest: "select-1",
      options: [
        { id: "option-1", displayName: "Option 1" },
        { id: "option-2", displayName: "Option 2" },
      ],
      value: "select-value-1",
      handleChange: jest.fn(),
    });

    expect(getByText(/Option 1/)).toBeInTheDocument();
    expect(getByText(/Option 2/)).toBeInTheDocument();
  });

  it("should render default option value", () => {
    const { getByText } = renderSelect({
      name: "select-1",
      dataTest: "select-1",
      defaultValue: "Select an option",
      options: [
        { id: "option-1", displayName: "Option 1" },
        { id: "option-2", displayName: "Option 2" },
      ],
      value: "select-value-1",
      handleChange: jest.fn(),
    });

    expect(getByText(/Select an option/)).toBeInTheDocument();
    expect(getByText(/Option 1/)).toBeInTheDocument();
    expect(getByText(/Option 2/)).toBeInTheDocument();
  });

  it("should render additional option", () => {
    const { getByText } = renderSelect({
      name: "select-1",
      dataTest: "select-1",
      options: [
        { id: "option-1", displayName: "Option 1" },
        { id: "option-2", displayName: "Option 2" },
      ],
      additionalOption: {
        value: "additional-option",
        displayName: "Add new option",
      },
      value: "select-value-1",
      handleChange: jest.fn(),
    });

    expect(getByText(/Option 1/)).toBeInTheDocument();
    expect(getByText(/Option 2/)).toBeInTheDocument();
    expect(getByText(/Add new option/)).toBeInTheDocument();
  });

  it("should render error styling when select has error", () => {
    const { getByTestId } = renderSelect({
      name: "select-1",
      dataTest: "select-1",
      options: [
        { id: "option-1", displayName: "Option 1" },
        { id: "option-2", displayName: "Option 2" },
      ],
      additionalOption: {
        value: "additional-option",
        displayName: "Add new option",
      },
      value: "select-value-1",
      hasError: true,
      handleChange: jest.fn(),
    });

    expect(getByTestId("select-1")).toHaveStyleRule(
      "border-color",
      `${colors.errorPrimary}`
    );
  });
});
