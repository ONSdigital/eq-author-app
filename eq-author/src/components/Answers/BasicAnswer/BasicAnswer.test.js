import React from "react";
import { shallow, mount } from "enzyme";
import { StatelessBasicAnswer } from "components/Answers/BasicAnswer";
import WrappingInput from "components/WrappingInput";

describe("BasicAnswer", () => {
  let answer;
  let onChange;
  let onUpdate;
  let children;
  let props;

  const createWrapper = (props, render = shallow) => {
    return render(<StatelessBasicAnswer {...props} />);
  };

  beforeEach(() => {
    answer = {
      title: "Answer title",
      description: "Answer description",
      label: "",
      type: "TextField"
    };
    onChange = jest.fn();
    onUpdate = jest.fn();

    props = {
      id: "1",
      answer,
      onChange,
      onUpdate,
      children: <div>This is the child component</div>
    };
  });

  it("should render without description", () => {
    expect(createWrapper(props, children)).toMatchSnapshot();
  });

  it("should render with description", () => {
    expect(
      createWrapper({ ...props, showDescription: true }, children)
    ).toMatchSnapshot();
  });

  it("can turn off auto-focus", () => {
    let wrapper = createWrapper({ ...props, autoFocus: false }, mount);
    const input = wrapper
      .find(`[data-test="txt-answer-label"]`)
      .first()
      .getDOMNode();

    expect(input.hasAttribute("data-autofocus")).toBe(false);
  });

  describe("event handling behaviour", () => {
    let wrapper;

    beforeEach(() => {
      wrapper = createWrapper(props, children, mount);
    });

    it("should invoke update callback onBlur", () => {
      const inputFields = wrapper.find(WrappingInput);
      inputFields.forEach(input => input.simulate("blur"));

      expect(onUpdate).toHaveBeenCalledTimes(inputFields.length);
    });

    it("should invoke change callback onChange", () => {
      const inputFields = wrapper.find(WrappingInput);
      inputFields.forEach(input => input.simulate("change"));

      expect(onChange).toHaveBeenCalledTimes(inputFields.length);
    });
  });
});
