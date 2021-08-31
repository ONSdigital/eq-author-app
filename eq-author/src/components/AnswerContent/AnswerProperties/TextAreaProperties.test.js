import React from "react";
import { render, fireEvent, flushPromises } from "tests/utils/rtl";
import TextAreaProperties from "./TextAreaProperties";
import { colors } from "constants/theme";
import { act } from "react-dom/test-utils";

const renderTextProperties = (props) => render(<TextAreaProperties {...props} />);

describe("Text Property", () => {
  let props;

  beforeEach(() => {
    props = {
      answer: {
        id: "1",
        properties: {
          required: true,
          maxLength: 2000,
        },
        type: "TextArea",
        validationErrorInfo: {
          totalCount: 0,
          errors: [],
          id: "1",
        },
      },
      updateAnswer: jest.fn(),
    };
  });

  it("should render default value as 2000", () => {
    const { getByTestId } = renderTextProperties(props);
    const inputBox = getByTestId("maxCharacterInput");
    expect(inputBox.value).toBe("2000");
  });

  it("should set input box value to 2000 when cleared", async () => {
    const { getByTestId } = renderTextProperties(props);
    const inputBox = getByTestId("maxCharacterInput");

    act(() => {
      fireEvent.change(inputBox, {
        target: { value: "" },
      });
    });

    expect(inputBox.value).toBe("");
    await act(async () => {
      fireEvent.blur(inputBox);
      await flushPromises();
    });
    expect(inputBox.value).toBe("2000");
  });

  it("when max character is out of range, box border should be errorPrimary", async () => {
    props.answer.validationErrorInfo.errors[0] = {
      errorCode: "ERR_MAX_LENGTH_TOO_SMALL",
      field: "maxLength",
    };
    const { getByTestId } = renderTextProperties(props);
    const inputBox = getByTestId("maxCharacterInput");

    expect(inputBox).toHaveStyle(`border-color: ${colors.errorPrimary};`);
  });

  it("when max character is in range, box border should be black", async () => {
    const { getByTestId } = renderTextProperties(props);
    const inputBox = getByTestId("maxCharacterInput");

    expect(inputBox).toHaveStyle(`border-color: ${colors.borders};`);
  });
});
