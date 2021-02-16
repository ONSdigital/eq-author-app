import React from "react";
import { shallow } from "enzyme";

import withValidationError from "./withValidationError";
import VALIDATION_MESSAGES from "constants/validationMessages";

const EnhancedComponent = withValidationError("page")("div");

const createWrapper = (props, render = shallow) =>
  render(<EnhancedComponent {...props} />);

describe("withValidationError", () => {
  const props = {
    page: {
      id: 1,
      title: "page title",
      alias: "alias",
      description: "",
      descriptionEnabled: true,
      guidance: "",
      guidanceEnabled: true,
      definitionLabel: "",
      definitionContent: "",
      definitionEnabled: true,
      additionalInfoLabel: "",
      additionalInfoContent: "",
      additionalInfoEnabled: true,
    },
  };

  const createErrorProps = (validationErrorInfo) => {
    return {
      ...props,
      page: {
        ...props.page,
        validationErrorInfo,
      },
    };
  };

  it("should not return any error if no errors defined", () => {
    const wrapper = createWrapper(props);

    const getValidationError = wrapper.prop("getValidationError");

    const errorString = getValidationError({
      field: "fieldName",
      label: "field name label",
    });

    expect(errorString).toBeNull();
  });

  it("should return the error code if no error template found", () => {
    const errorProps = createErrorProps({
      errors: [{ field: "fieldName", errorCode: "ERRCODE" }],
    });

    const wrapper = createWrapper(errorProps);

    const getValidationError = wrapper.prop("getValidationError");

    const errorString = getValidationError({
      field: "fieldName",
      label: "field name label",
    });

    expect(errorString).toEqual("ERRCODE");
  });

  it("should return the error message if error template found", () => {
    const errorProps = createErrorProps({
      errors: [{ field: "fieldName", errorCode: "ERR_VALID_REQUIRED" }],
    });

    const wrapper = createWrapper(errorProps);

    const getValidationError = wrapper.prop("getValidationError");

    const label = "field name label";

    const errorString = getValidationError({
      field: "fieldName",
      label,
    });

    const expectedErrorString = VALIDATION_MESSAGES.ERR_VALID_REQUIRED({
      label,
    });

    expect(errorString).toEqual(expectedErrorString);
  });
});
