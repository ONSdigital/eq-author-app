import React from "react";
import { render, fireEvent } from "tests/utils/rtl";
import { useMutation } from "@apollo/react-hooks";

import MetadataTextSelector from "./MetadataTextSelector";

import { colors } from "constants/theme";
import { rightSideErrors } from "constants/validationMessages";

jest.mock("@apollo/react-hooks", () => ({
  useMutation: jest.fn(() => [() => null]),
}));

const renderMetadataTextSelector = (props) => {
  return render(<MetadataTextSelector {...props} />);
};

describe("MetadataTextSelector", () => {
  let props;
  beforeEach(() => {
    props = {
      expression: {
        id: "expression-1",
        left: {
          id: "expression-left-1",
        },
        validationErrorInfo: { id: "expression-validation", errors: [] },
      },
    };
  });

  it("should render", () => {
    const { getByTestId } = renderMetadataTextSelector(props);

    expect(getByTestId("metadata-match-input")).toBeInTheDocument();
  });

  it("should apply error styling when selector has error", () => {
    props.expression.validationErrorInfo.errors.push({ id: "error-1" });

    const { getByTestId } = renderMetadataTextSelector(props);
    expect(getByTestId("routing-selector-container-metadata")).toHaveStyleRule(
      "border-color",
      colors.errorPrimary
    );
  });

  it("should render error message when metadata value text is empty", () => {
    props.expression.validationErrorInfo.errors.push({
      id: "error-1",
      errorCode: "ERR_RIGHTSIDE_NO_VALUE",
    });

    const { getByText } = renderMetadataTextSelector(props);

    expect(
      getByText(rightSideErrors.ERR_RIGHTSIDE_TEXT_NO_VALUE.message)
    ).toBeInTheDocument();
  });

  it("should call onChange function", () => {
    const { getByTestId } = renderMetadataTextSelector(props);

    const metadataMatchInput = getByTestId("metadata-match-input");
    fireEvent.change(metadataMatchInput, {
      target: { value: "Metadata text" },
    });

    expect(metadataMatchInput.value).toBe("Metadata text");
  });

  it("should call onBlur mutation", () => {
    const updateRightSide = jest.fn();
    useMutation.mockImplementation(jest.fn(() => [updateRightSide]));

    const { getByTestId } = renderMetadataTextSelector(props);

    const metadataMatchInput = getByTestId("metadata-match-input");

    fireEvent.change(metadataMatchInput, {
      target: { value: "Metadata text" },
    });

    fireEvent.blur(metadataMatchInput);

    expect(updateRightSide).toHaveBeenCalledWith({
      variables: {
        input: {
          expressionId: props.expression.id,
          customValue: { text: "Metadata text" },
        },
      },
    });
  });
});
