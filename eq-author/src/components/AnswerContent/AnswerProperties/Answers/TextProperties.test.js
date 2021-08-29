import React from "react";
import { render, fireEvent, flushPromises } from "tests/utils/rtl";
import TextFieldProperties from "./TextFieldProperties";
import UPDATE_ANSWERS_OF_TYPE from "./updateAnswersOfTypeMutation.graphql";
import { colors } from "constants/theme";
import { act } from "react-dom/test-utils";

const renderTextProperties = (props, mocks) => {
  return render(<TextFieldProperties {...props} />, { mocks });
};

describe("Text Property", () => {
  let queryWasCalled, props, mocks;

  beforeEach(() => {
    queryWasCalled = false;
    props = {
      pageId: "2",
      maxLength: 2000,
      invalid: false,
    };
    mocks = [
      {
        request: {
          query: UPDATE_ANSWERS_OF_TYPE,
          variables: {
            input: {
              questionPageId: "2",
              type: "TextArea",
              properties: {
                maxLength: 2000,
              },
            },
          },
        },
        result: () => {
          queryWasCalled = true;
          return {
            data: {
              updateAnswersOfType: [
                {
                  id: "2",
                  displayName: "aaaa",
                  label: "Vale 46",
                  type: "TextArea",
                  properties: {
                    required: false,
                    maxLength: 2000,
                  },
                  validationErrorInfo: {
                    id: "c0c7ebe7-4345-41cc-b248-b5d72c25fd9b",
                    errors: [],
                    totalCount: 0,
                    __typename: "ValidationErrorInfo",
                  },
                  __typename: "BasicAnswer",
                },
              ],
            },
          };
        },
      },
    ];
  });

  it("should render default value as 2000", () => {
    const { getByTestId } = renderTextProperties(props);
    const inputBox = getByTestId("maxCharacterInput");
    expect(inputBox.value).toBe("2000");
  });

  it("should set input box value to 2000 when cleared", async () => {
    const { getByTestId } = renderTextProperties(props, mocks);
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
    props = {
      pageId: "2",
      maxLength: 9,
      invalid: true,
    };
    const { getByTestId } = renderTextProperties(props, mocks);
    const inputBox = getByTestId("maxCharacterInput");

    expect(inputBox).toHaveStyle(`border-color: ${colors.errorPrimary};`);
  });

  it("when max character is in range, box border should be black", async () => {
    const { getByTestId } = renderTextProperties(props, mocks);
    const inputBox = getByTestId("maxCharacterInput");

    expect(inputBox).toHaveStyle(`border-color: ${colors.borders};`);
  });

  it("calls the database on blur", async () => {
    const { getByTestId } = renderTextProperties(props, mocks);
    const inputBox = getByTestId("maxCharacterInput");
    act(() => {
      fireEvent.change(inputBox, {
        target: { value: 2000 },
      });
    });
    expect(queryWasCalled).toBeFalsy();
    await act(async () => {
      fireEvent.blur(inputBox);
      await flushPromises();
    });
    expect(queryWasCalled).toBeTruthy();
  });
});
