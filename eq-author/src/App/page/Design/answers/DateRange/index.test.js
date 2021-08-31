import React from "react";
import { shallow } from "enzyme";
import DateRange from "./";
import { DATE_LABEL_REQUIRED } from "constants/validationMessages";
import { render as rtlRender } from "tests/utils/rtl";

const mockUseMutation = jest.fn();

jest.mock("@apollo/react-hooks", () => ({
  useMutation: () => [mockUseMutation],
}));

describe("DateRange", () => {
  let handleChange, handleUpdate, props;

  beforeEach(() => {
    handleChange = jest.fn();
    handleUpdate = jest.fn();

    props = {
      answer: {
        id: "1",
        label: "",
        type: "DateRange",
        description: "test",
        guidance: "",
        secondaryLabel: "",
        secondaryLabelDefault: "",
        properties: { required: false },
        displayName: "Untitled answer",
        advancedProperties: true,
        qCode: "yuky",
        validationErrorInfo: {
          errors: [],
        },
      },
      metadata: [],
    };
  });

  it("should render", () => {
    const wrapper = shallow(
      <DateRange
        onChange={handleChange}
        onUpdate={handleUpdate}
        answer={props.answer}
        metadata={props.metadata}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("should render an error message when date label input is empty", () => {
    const error = [
      {
        errorCode: "ERR_VALID_REQUIRED",
        field: "label",
        id: "71b5f8a2-5de1-4a9a-8923-acd7fd3b7080",
        type: "answer",
        __typename: "ValidationError",
      },
    ];
    props.answer.validationErrorInfo.errors = error;

    const { getByText } = rtlRender(
      <DateRange onUpdate={handleUpdate} {...props} />
    );

    expect(getByText(DATE_LABEL_REQUIRED)).toBeTruthy();
  });

  it("should render an error message when date secondarylabel input is empty", () => {
    const error = [
      {
        errorCode: "ERR_VALID_REQUIRED",
        field: "secondaryLabel",
        id: "71b5f8a2-5de1-4a9a-8923-acd7fd3b7081",
        type: "answer",
        __typename: "ValidationError",
      },
    ];
    props.answer.validationErrorInfo.errors = error;

    const { getByText } = rtlRender(
      <DateRange onUpdate={handleUpdate} {...props} />
    );

    expect(getByText(DATE_LABEL_REQUIRED)).toBeTruthy();
  });

  it("Does not have a mutually exclusive option toggle", () => {
    const { queryByTestId } = rtlRender(
      <DateRange onUpdate={handleUpdate} {...props} />
    );

    expect(queryByTestId("toggle-or-option-date")).not.toBeInTheDocument();
  });
});
