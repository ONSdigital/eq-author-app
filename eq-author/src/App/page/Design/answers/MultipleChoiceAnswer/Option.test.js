import React from "react";
import WrappingInput from "components/Forms/WrappingInput";
import { shallow, mount } from "enzyme";
import { StatelessOption } from "./Option";
import { CHECKBOX, RADIO } from "constants/answer-types";
import { merge } from "lodash";
import { useMutation } from "@apollo/react-hooks";
import { props } from "lodash/fp";
import { render as rtlRender, fireEvent, screen } from "tests/utils/rtl";

jest.mock("@apollo/react-hooks", () => ({
  useMutation: jest.fn(),
}));

useMutation.mockImplementation(jest.fn(() => [jest.fn()]));

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
    },
    __typename: "Option",
  };

  const render = (method = shallow, otherProps) => {
    wrapper = method(
      <StatelessOption
        {...mockMutations}
        option={option}
        hasDeleteButton
        type={RADIO}
        {...otherProps}
      />
    );

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
    };

    render();
  });

  it("should match snapshot", () => {
    expect(wrapper).toMatchSnapshot();
  });

  it("should render a checkbox", () => {
    render(mount, { type: CHECKBOX });
    expect(wrapper).toMatchSnapshot();
  });

  it("shouldn't render delete button if not applicable", () => {
    wrapper.setProps({ hasDeleteButton: false });
    expect(wrapper).toMatchSnapshot();
  });

  it("should call onChange and onBlur correctly", () => {
    const { getByTestId } = rtlRender(( otherProps) => <StatelessOption {...mockMutations}
      option={option}
      hasDeleteButton
      type={RADIO}
      {...otherProps}
     {...props} />);

    fireEvent.change(getByTestId("option-label"), {
      target: { value: "2" },
    });
    fireEvent.blur(getByTestId("option-label"));
    expect(mockMutations.onUpdate).toHaveBeenCalledTimes(1);
  });

  it("should call onChange on input", async() => {
    render(rtlRender, { type: CHECKBOX });
    fireEvent.change(screen.getByTestId("other-answer"), {
      target: { value: "use this text" },
      });

      expect(
        screen.getByText(/use this text/)
      ).toBeInTheDocument();
  });

  it("should update label on blur", () => {
    render(rtlRender, { type: CHECKBOX });
    fireEvent.blur(screen.getByTestId("option-label"), {
      target: { value: "2" },
    });
    expect(mockMutations.onUpdate).toHaveBeenCalledTimes(1);
  });

  it("should update Other Answer on blur", () => {
    const handleSaveOtherLabel = jest.fn();
    useMutation.mockImplementation(() => [
      handleSaveOtherLabel
    ])
    render(rtlRender, { type: CHECKBOX });
    fireEvent.change(screen.getByTestId("other-answer"), {
      target: { value: "2" },
    });
    fireEvent.blur(screen.getByTestId("other-answer"),);
    expect(handleSaveOtherLabel).toHaveBeenCalledTimes(1);

  });

  it("should invoke onDelete callback when option deleted", () => {
    render(rtlRender, { type: CHECKBOX });
    fireEvent.click(screen.getByTestId("btn-delete-option"),);

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
});
