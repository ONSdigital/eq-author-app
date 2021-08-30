import React from "react";
import { render, fireEvent } from "tests/utils/rtl";
import userEvent from "@testing-library/user-event";
import { keyCodes } from "constants/keyCodes";

import { CENTIMETRES, KILOJOULES } from "constants/unit-types";

import UnitProperties from "./UnitProperties";

const { ArrowDown } = keyCodes;
const inputId = "autocomplete-input";
const renderUnitProperties = (props) => {
  return render(<UnitProperties {...props} />);
};

describe("Required Property", () => {
  let props;

  beforeEach(() => {
    props = {
      answer: {
        id: "1",
        label: "test label",
        properties: {
          required: false,
          decimals: 0,
          unit: CENTIMETRES,
        },
        validationErrorInfo: {
          totalCount: 0,
          errors: [],
          id: "1",
        },
      },
      page: {
        id: 1,
      },
      updateAnswer: jest.fn(),
      updateAnswerOfType: jest.fn(),
    };
  });

  it("should render", () => {
    const { getByTestId } = renderUnitProperties(props);
    const autocomplete = getByTestId(inputId);
    expect(autocomplete.value).toBe("Centimetres (cm)");
  });

  it("should handle change event for input", () => {
    const { getByTestId } = renderUnitProperties(props);
    getByTestId(inputId).focus();
    fireEvent.change(getByTestId(inputId), { target: { value: KILOJOULES } });
    fireEvent.keyDown(getByTestId(inputId), {
      key: ArrowDown,
      code: ArrowDown,
    });
    userEvent.type(getByTestId(inputId), `{enter}`);
    expect(props.updateAnswerOfType).toHaveBeenCalledTimes(1);
  });
});
