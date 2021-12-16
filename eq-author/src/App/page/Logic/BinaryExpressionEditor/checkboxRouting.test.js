import React from "react";
import { render, fireEvent, act, flushPromises } from "tests/utils/rtl";
import { UnwrappedBinaryExpressionEditor } from "./";

describe("Checkbox routing", () => {
  let props, mockHandlers, options, expression, expressionGroup, match;

  mockHandlers = {
    updateLeftSide: jest.fn(),
    deleteBinaryExpression: jest.fn(),
    createBinaryExpression: jest.fn(),
    updateBinaryExpression: jest.fn(),
    updateRightSide: jest.fn(),
  };

  options = [
    {
      id: "Option1",
      label: "Option 1",
      __typename: "Option",
    },
    {
      id: "Option2",
      label: "Option 2",
      __typename: "Option",
    },
    {
      id: "Option3",
      label: "Option 3",
      __typename: "Option",
    },
    {
      id: "Option4",
      label: "Option 4",
      __typename: "Option",
    },
    {
      id: "Option5",
      label: "Option 5",
      __typename: "Option",
    },
  ];

  expression = {
    expressionGroup: {
      id: "1",
      validationErrorInfo: {
        id: "1",
        errors: [],
        totalCount: 0,
      },
    },
    id: "1",
    left: {
      id: "Answer1",
      displayName: "answer 1",
      type: "Checkbox",
      mutuallyExclusiveOption: {
        id: "OrOption",
        label: "OrOption",
      },
      options,
    },
    condition: "AnyOf",
    secondaryCondition: null,
    right: {
      options: [
        {
          id: "Option1",
          label: "Option 1",
        },
        {
          id: "Option2",
          label: "Option 2",
        },
      ],
    },
    validationErrorInfo: {
      id: "6dd",
      errors: [],
      totalCount: 0,
    },
  };

  expressionGroup = {
    id: "1",
    expressions: [expression],
  };

  match = {
    params: {
      questionnaireId: "1",
    },
  };

  props = { expression, expressionGroup, match, expressionIndex: 0 };

  const renderRouting = () =>
    render(
      <UnwrappedBinaryExpressionEditor
        isOnlyExpression
        isLastExpression
        canAddCondition
        {...mockHandlers}
        {...props}
      />,
      {
        route: "/q/1/page/2",
        urlParamMatcher: "/q/:questionnaireId/page/:pageId",
      }
    );

  it("should display the list of selected options", async () => {
    const { getByText } = renderRouting();
    await act(async () => {
      await flushPromises();
    });
    expect(getByText("Option 1")).toBeTruthy();
    expect(getByText("Option 2")).toBeTruthy();
  });

  it("should add to the list of selected options", async () => {
    const { getByText, getByLabelText } = renderRouting();
    await act(async () => {
      await flushPromises();
    });

    fireEvent.click(getByText("Choose"));
    fireEvent.click(getByLabelText("Option 3"));
    fireEvent.click(getByLabelText("Option 4"));
    fireEvent.click(getByText("Done"));

    expect(mockHandlers.updateRightSide).toHaveBeenCalledWith(expression, {
      selectedOptions: ["Option1", "Option2", "Option3", "Option4"],
    });
  });

  it("should remove from to the list of selected options", async () => {
    const { getAllByTestId } = renderRouting();
    await act(async () => {
      await flushPromises();
    });

    fireEvent.click(getAllByTestId("remove-chip")[0]);

    expect(mockHandlers.updateRightSide).toHaveBeenCalledWith(expression, {
      selectedOptions: ["Option2"],
    });
  });

  it("can change the match condition", async () => {
    const { getByTestId } = renderRouting();
    await act(async () => {
      await flushPromises();
    });
    fireEvent.change(getByTestId("condition-dropdown"), {
      target: { value: "AnyOf" },
    });

    expect(mockHandlers.updateBinaryExpression).toHaveBeenCalledWith(
      expression,
      "AnyOf",
      undefined
    );
  });

  it("does not render 'choose' button or selected options when match condition is unanswered", async () => {
    const { queryByText } = renderRouting();
    await act(async () => {
      await flushPromises();
    });
    expect(queryByText("Choose")).toBeTruthy();

    props.expression.condition = "Unanswered";

    expect(queryByText("Choose").updateBinaryExpression).toBeFalsy();
    expect(queryByText("Option 1").updateBinaryExpression).toBeFalsy();
    expect(queryByText("Option 2").updateBinaryExpression).toBeFalsy();
  });
});
