import React from "react";
import { render, fireEvent } from "tests/utils/rtl";
import { UnwrappedBinaryExpressionEditor } from "./";

describe("Checkbox routing", () => {
  // this is just a little hack to silence a warning that we'll get until we
  // upgrade to 16.9: https://github.com/facebook/react/pull/14853
  // https://github.com/testing-library/react-testing-library#suppressing-unnecessary-warnings-on-react-dom-168
  /* eslint-disable no-console, import/unambiguous */
  const originalError = console.error;
  beforeAll(() => {
    console.error = (...args) => {
      if (/Warning.*not wrapped in act/.test(args[0])) {
        return;
      }
      originalError.call(console, ...args);
    };
  });

  afterAll(() => {
    console.error = originalError;
  });
  // End hack to silence warning
  let props, mockHandlers, options, expression, match;

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
  };

  match = {
    params: {
      questionnaireId: "1",
    },
  };

  props = { expression, expressionGroupId: "1", match };

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

  it("should display the list of selected options", () => {
    const { getByText } = renderRouting();

    expect(getByText("Option 1")).toBeTruthy();
    expect(getByText("Option 2")).toBeTruthy();
  });

  it("should add to the list of selected options", () => {
    const { getByText, getByLabelText } = renderRouting();

    fireEvent.click(getByText("CHOOSE"));
    fireEvent.click(getByLabelText("Option 3"));
    fireEvent.click(getByLabelText("Option 4"));
    fireEvent.click(getByText("DONE"));

    expect(mockHandlers.updateRightSide).toHaveBeenCalledWith(expression, {
      selectedOptions: ["Option1", "Option2", "Option3", "Option4"],
    });
  });

  it("should remove from to the list of selected options", () => {
    const { getAllByTestId } = renderRouting();

    fireEvent.click(getAllByTestId("remove-chip")[0]);

    expect(mockHandlers.updateRightSide).toHaveBeenCalledWith(expression, {
      selectedOptions: ["Option2"],
    });
  });

  it("can change the match condition", () => {
    const { getByTestId } = renderRouting();

    fireEvent.change(getByTestId("condition-dropdown"), {
      target: { value: "AnyOf" },
    });

    expect(mockHandlers.updateBinaryExpression).toHaveBeenCalledWith(
      expression,
      "AnyOf"
    );
  });

  it("does not render 'choose' button or selected options when match condition is unanswered", () => {
    const { queryByText } = renderRouting();

    expect(queryByText("CHOOSE")).toBeTruthy();

    props.expression.condition = "Unanswered";

    expect(queryByText("CHOOSE").updateBinaryExpression).toBeFalsy();
    expect(queryByText("Option 1").updateBinaryExpression).toBeFalsy();
    expect(queryByText("Option 2").updateBinaryExpression).toBeFalsy();
  });
});
