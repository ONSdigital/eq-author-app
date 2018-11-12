import React from "react";

import WrappingInput from "components/WrappingInput";
import { StatelessOption } from "./Option";
import DeleteButton from "components/DeleteButton";
import { CHECKBOX, RADIO } from "constants/answer-types";

import { shallow, mount } from "enzyme";
import { merge } from "lodash";
import createMockStore from "tests/utils/createMockStore";

describe("Option", () => {
  let mockMutations;
  let mockEvent;
  let wrapper;
  let store;

  const option = {
    id: "1",
    label: "",
    description: "",
    __typename: "Option"
  };

  const render = (method = shallow, otherProps) => {
    wrapper = method(
      <StatelessOption
        {...mockMutations}
        option={option}
        hasDeleteButton
        type={RADIO}
        store={store}
        {...otherProps}
      />
    );

    return wrapper;
  };

  beforeEach(() => {
    mockEvent = {
      stopPropagation: jest.fn(),
      preventDefault: jest.fn()
    };

    store = createMockStore();

    mockMutations = {
      onChange: jest.fn(),
      onUpdate: jest.fn(),
      onFocus: jest.fn(),
      onDelete: jest.fn(),
      onEnterKey: jest.fn()
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

  it("should call onChange on input", () => {
    wrapper.find("[data-test='option-label']").simulate("change");
    wrapper.find("[data-test='option-description']").simulate("change");

    expect(mockMutations.onChange).toHaveBeenCalledTimes(2);
  });

  it("should update label on blur", () => {
    wrapper.find("[data-test='option-label']").simulate("blur", mockEvent);

    expect(mockMutations.onUpdate).toHaveBeenCalled();
  });

  it("should update description on blur", () => {
    wrapper
      .find("[data-test='option-description']")
      .simulate("blur", mockEvent);

    expect(mockMutations.onUpdate).toHaveBeenCalled();
  });

  it("should invoke onDelete callback when option deleted", () => {
    wrapper.find(DeleteButton).simulate("click", mockEvent);

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
