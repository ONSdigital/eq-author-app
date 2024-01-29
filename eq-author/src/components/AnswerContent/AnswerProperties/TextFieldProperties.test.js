import React from "react";
import { render, fireEvent, flushPromises } from "tests/utils/rtl";
import TextFieldProperties from "./TextFieldProperties";
import { act } from "react-dom/test-utils";
import { useMutation } from "@apollo/react-hooks";

jest.mock("@apollo/react-hooks", () => ({
  useMutation: jest.fn(() => [() => null]),
}));

const renderTextProperties = (props) =>
  render(<TextFieldProperties {...props} />);

describe("TextField Property", () => {
  let props;
  const updateAnswer = jest.fn();
  beforeEach(() => {
    props = {
      answer: {
        id: "1",
        properties: {
          required: false,
          maxLength: 8,
        },
        limitCharacter: true,
        type: "TextField",
        validationErrorInfo: {
          errors: [],
        },
      },
      updateAnswer,
    };
  });

  it("should set input box value to 100 when the textbox is cleared", async () => {
    const { getByTestId } = renderTextProperties(props);
    const inputBox = getByTestId("limitCharacterInput");

    act(() => {
      fireEvent.change(inputBox, {
        target: { value: null },
      });
    });

    expect(inputBox.value).toBe("");
    await act(async () => {
      fireEvent.blur(inputBox);
      await flushPromises();
    });
    expect(inputBox.value).toBe("100");
  });

  it("should set input box value to 8", async () => {
    const { getByTestId } = renderTextProperties(props);
    const inputBox = getByTestId("limitCharacterInput");

    act(() => {
      fireEvent.change(inputBox, {
        target: { value: "8" },
      });
    });

    expect(inputBox.value).toBe("8");
    await act(async () => {
      fireEvent.blur(inputBox);
      await flushPromises();
    });
    expect(inputBox.value).toBe("8");
  });

  it("should update limitCharacter when toggle-switch is clicked", () => {
    const { getByTestId } = renderTextProperties(props);
    useMutation.mockImplementation(jest.fn(() => [updateAnswer]));

    fireEvent.click(getByTestId("character-length-input"));
    expect(updateAnswer).toHaveBeenCalled();
  });

  it("should render minimum value message when there is ERR_MAX_LENGTH_TOO_SMALL error", () => {
    props.answer.validationErrorInfo.errors[0] = {
      errorCode: "ERR_MAX_LENGTH_TOO_SMALL",
      field: "maxLength",
    };
    props.answer.properties.maxLength = 5;
    const { getByText } = renderTextProperties(props);

    expect(
      getByText(/Enter a character limit greater than or equal to 8/)
    ).toBeInTheDocument();
  });

  it("should render maximum value message when there is ERR_MAX_LENGTH_TOO_LARGE error", () => {
    props.answer.validationErrorInfo.errors[0] = {
      errorCode: "ERR_MAX_LENGTH_TOO_LARGE",
      field: "maxLength",
    };
    props.answer.properties.maxLength = 105;
    const { getByText } = renderTextProperties(props);

    expect(
      getByText(/Enter a character limit less than or equal to 100/)
    ).toBeInTheDocument();
  });
});
