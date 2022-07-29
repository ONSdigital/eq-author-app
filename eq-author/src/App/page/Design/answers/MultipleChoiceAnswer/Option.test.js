import React from "react";
import WrappingInput from "components/Forms/WrappingInput";
import { shallow, mount } from "enzyme";
import { StatelessOption } from "./Option";
import { CHECKBOX, RADIO } from "constants/answer-types";
import { merge } from "lodash";
import { useMutation } from "@apollo/react-hooks";
import { useCurrentPageId } from "components/RouterContext";
import {
  render as rtlRender,
  fireEvent,
  waitFor,
  screen,
} from "tests/utils/rtl";
import messageTemplate, {
  dynamicAnswer,
  MISSING_LABEL,
  ADDITIONAL_LABEL_MISSING,
  buildLabelError,
} from "constants/validationMessages";

jest.mock("@apollo/react-hooks", () => ({
  useMutation: jest.fn(),
}));

useMutation.mockImplementation(jest.fn(() => [jest.fn()]));

jest.mock("components/RouterContext", () => ({
  useCurrentPageId: jest.fn(),
}));
useCurrentPageId.mockImplementation(() => "1.1.2");

describe("Option", () => {
  let mockMutations;
  let mockEvent;
  let wrapper;

  const option = {
    id: "1",
    label: "",
    description: "",
    additionalAnswer: {
      id: "additional1",
      label: "",
      type: "TextField",
      validationErrorInfo: {
        errors: [],
        totalCount: 0,
      },
    },
    dynamicAnswer: false,
    dynamicAnswerID: "",
    validationErrorInfo: {
      errors: [],
      totalCount: 0,
    },
    __typename: "Option",
  };

  const render = (method = shallow, otherProps) => {
    const props = {
      ...mockMutations,
      option: option,
      hasDeleteButton: true,
      type: RADIO,
      ...otherProps,
    };
    wrapper = method(<StatelessOption {...props} />);

    return wrapper;
  };

  beforeEach(() => {
    mockEvent = {
      stopPropagation: jest.fn(),
      preventDefault: jest.fn(),
    };

    mockMutations = {
      onBlur: jest.fn(),
      onChange: jest.fn(),
      onUpdate: jest.fn(),
      onFocus: jest.fn(),
      onDelete: jest.fn(),
      onEnterKey: jest.fn(),
      onSubmit: jest.fn(),
    };

    render();
  });

  it("should render a radio button with dummy radio styling", () => {
    render(rtlRender);
    expect(screen.queryByTestId("dummy-multiple-choice")).toHaveStyle({
      "border-radius": "100%",
    });
  });

  it("should render a checkbox with dummy checkbox styling", () => {
    render(rtlRender, { type: CHECKBOX });
    expect(screen.queryByTestId("dummy-multiple-choice")).toHaveStyle({
      "border-radius": "4px",
    });
  });

  it("shouldn't render delete button if not applicable", () => {
    wrapper.setProps({ hasDeleteButton: false });
    expect(wrapper).toMatchSnapshot();
  });

  it("should call onChange and onBlur correctly", async () => {
    const otherProps = {
      option: option,
      hasDeleteButton: true,
      type: RADIO,
      ...mockMutations,
    };
    const { getByTestId } = rtlRender(<StatelessOption {...otherProps} />);

    fireEvent.change(getByTestId("option-label"), {
      target: { value: "2" },
    });
    fireEvent.blur(getByTestId("option-label"));
    await waitFor(() =>
      expect(mockMutations.onUpdate).toHaveBeenCalledTimes(1)
    );
  });

  it("should call onChange on input", async () => {
    render(rtlRender, { type: CHECKBOX });
    fireEvent.change(screen.getByTestId("other-answer"), {
      target: { value: "use this text" },
    });

    expect(screen.getByText(/use this text/)).toBeInTheDocument();
  });

  it("should update label on blur", async () => {
    render(rtlRender, { type: CHECKBOX });
    fireEvent.blur(screen.getByTestId("option-label"), {
      target: { value: "2" },
    });
    await waitFor(() =>
      expect(mockMutations.onUpdate).toHaveBeenCalledTimes(1)
    );
  });

  it("should update Other Answer on blur", () => {
    const handleSaveOtherLabel = jest.fn();
    useMutation.mockImplementation(() => [handleSaveOtherLabel]);
    render(rtlRender, { type: CHECKBOX });
    fireEvent.change(screen.getByTestId("other-answer"), {
      target: { value: "2" },
    });
    fireEvent.blur(screen.getByTestId("other-answer"));
    expect(handleSaveOtherLabel).toHaveBeenCalledTimes(1);
  });

  it("should invoke onDelete callback when option deleted", () => {
    render(rtlRender, { type: CHECKBOX });
    fireEvent.click(screen.getByTestId("btn-delete-option"));

    expect(mockMutations.onDelete).toHaveBeenCalledWith(option.id);
  });

  it("should call onEnterKey when Enter key pressed", () => {
    wrapper
      .find(WrappingInput)
      .first()
      .simulate("keyDown", merge(mockEvent, { keyCode: 13 }));

    expect(mockMutations.onEnterKey).toHaveBeenCalledWith(mockEvent);
  });

  it("should not call onEnterKey when other keys are pressed", () => {
    wrapper
      .find(WrappingInput)
      .first()
      .simulate("keyDown", merge(mockEvent, { keyCode: 27 }));

    expect(mockMutations.onEnterKey).not.toHaveBeenCalled();
  });

  it("can turn off auto-focus", () => {
    wrapper = render(mount, { autoFocus: false });
    const input = wrapper
      .find(`[data-test="option-label"]`)
      .first()
      .getDOMNode();

    expect(input.hasAttribute("data-autofocus")).toBe(false);
  });

  it("it should invoke onChange when the dynamic answer togggle switch is clicked", () => {
    const option = {
      id: "1",
      label: "",
      description: "",
      dynamicAnswer: false,
      dynamicAnswerID: "",
      __typename: "Option",
    };

    const otherProps = {
      option: option,
      hasDeleteButton: true,
      type: RADIO,
      ...mockMutations,
    };
    const { getByTestId } = rtlRender(<StatelessOption {...otherProps} />);
    fireEvent.change(getByTestId("option-toggle-switch-1"), {
      target: true,
    });
  });

  it("it should display dynamic answer content picker the dynamic answer togggle switch is true", () => {
    const option = {
      id: "1",
      label: "",
      description: "",
      dynamicAnswer: true,
      dynamicAnswerID: "",
      __typename: "Option",
    };

    const otherProps = {
      option: option,
      hasDeleteButton: true,
      type: RADIO,
      ...mockMutations,
    };
    const { getByTestId } = rtlRender(<StatelessOption {...otherProps} />);
    expect(getByTestId("dynamic-answer-picker")).toBeInTheDocument();
  });

  // it("should update dynamic answer ID", () => {
  //   const option = {
  //     id: "1",
  //     label: "",
  //     description: "",
  //     dynamicAnswer: true,
  //     dynamicAnswerID: "",
  //     __typename: "Option",
  //   };

  //   const otherProps = {
  //     option: option,
  //     hasDeleteButton: true,
  //     type: RADIO,
  //     ...mockMutations,
  //   };

  //   const { getByTestId } = rtlRender(<StatelessOption {...otherProps} />);
  //   const f = screen.getByTestId("dynamic-answer-picker")
  //   fireEvent.submit(f, { item: "3"});
  //   // .simulate("submit", { id: "1", dynamicAnswerID: "3" });

  //   expect(mockMutations.onSubmit).toHaveBeenCalledTimes(1);
  // });

  it("it should display a validation message when a dynamic answer hasn't been selected", () => {
    const option = {
      id: "1",
      label: "",
      description: "",
      dynamicAnswer: true,
      dynamicAnswerID: "",
      validationErrorInfo: {
        errors: [
          {
            id: "1",
            errorCode: "ERR_VALID_REQUIRED",
            field: "dynamicAnswerID",
            type: "option",
          },
        ],
        totalCount: 1,
      },
      __typename: "Option",
    };

    const otherProps = {
      option: option,
      hasDeleteButton: true,
      type: RADIO,
      ...mockMutations,
    };
    rtlRender(<StatelessOption {...otherProps} />);
    expect(screen.getByText(dynamicAnswer.ERR_VALID_REQUIRED)).toBeTruthy();
  });

  it("it should display a validation message when a label hasn't been entered", () => {
    const errorCode = [
      {
        id: "1",
        errorCode: "ERR_VALID_REQUIRED",
        field: "label",
        type: "option",
      },
    ];
    option.validationErrorInfo.errors = errorCode;

    const otherProps = {
      option: option,
      hasDeleteButton: true,
      type: RADIO,
      ...mockMutations,
    };
    const error = buildLabelError(MISSING_LABEL, `radio`, 8, 7);

    rtlRender(<StatelessOption {...otherProps} />);
    expect(screen.getByText(error)).toBeTruthy();
  });

  it("it should display a validation message when an other label hasn't been entered", () => {
    const errorCode = [
      {
        id: "1",
        errorCode: "ADDITIONAL_LABEL_MISSING",
        field: "label",
        type: "option",
      },
    ];
    option.additionalAnswer.validationErrorInfo.errors = errorCode;

    const otherProps = {
      option: option,
      hasDeleteButton: true,
      type: RADIO,
      ...mockMutations,
    };

    rtlRender(<StatelessOption {...otherProps} />);
    expect(screen.getByText(ADDITIONAL_LABEL_MISSING)).toBeTruthy();
  });

  it("it should display a validation message when two labels are not unique", () => {
    const error = [
      {
        id: "1",
        errorCode: "ERR_UNIQUE_REQUIRED",
        field: "label",
        type: "option",
      },
    ];
    option.validationErrorInfo.errors = error;

    const otherProps = {
      option: option,
      hasDeleteButton: true,
      type: RADIO,
      ...mockMutations,
    };

    const { ERR_UNIQUE_REQUIRED } = messageTemplate;
    const uniqueErrorMsg = ERR_UNIQUE_REQUIRED({ label: "Option label" });

    rtlRender(<StatelessOption {...otherProps} />);
    expect(screen.getByText(uniqueErrorMsg)).toBeTruthy();
  });

  it("it should display a validation message when the answer chosen in the dynamic answer picker has been deleted", () => {
    const option = {
      id: "1",
      label: "",
      description: "",
      dynamicAnswer: true,
      dynamicAnswerID: "",
      validationErrorInfo: {
        errors: [
          {
            id: "1",
            errorCode: "ERR_REFERENCE_DELETED",
            field: "dynamicAnswerID",
            type: "option",
          },
        ],
        totalCount: 1,
      },
      __typename: "Option",
    };

    const otherProps = {
      option: option,
      hasDeleteButton: true,
      type: RADIO,
      ...mockMutations,
    };

    rtlRender(<StatelessOption {...otherProps} />);
    expect(screen.getByText(dynamicAnswer.ERR_REFERENCE_DELETED)).toBeTruthy();
  });

  it("it should display a validation message when the answer chosen in the dynamic answer picker has been moved to a position after the question page", () => {
    const option = {
      id: "1",
      label: "",
      description: "",
      dynamicAnswer: true,
      dynamicAnswerID: "",
      validationErrorInfo: {
        errors: [
          {
            id: "1",
            errorCode: "ERR_REFERENCE_MOVED",
            field: "dynamicAnswerID",
            type: "option",
          },
        ],
        totalCount: 1,
      },
      __typename: "Option",
    };

    const otherProps = {
      option: option,
      hasDeleteButton: true,
      type: RADIO,
      ...mockMutations,
    };

    rtlRender(<StatelessOption {...otherProps} />);
    expect(screen.getByText(dynamicAnswer.ERR_REFERENCE_MOVED)).toBeTruthy();
  });
});
