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
      },
      updateAnswer,
    };
  });

  it("should set input box value to 8 when the textbox is cleared", async () => {
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
    expect(inputBox.value).toBe("8");
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
});
