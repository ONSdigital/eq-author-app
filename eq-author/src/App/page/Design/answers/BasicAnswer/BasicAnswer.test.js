import React from "react";
import { shallow, mount } from "enzyme";

import { StatelessBasicAnswer } from "./";
import WrappingInput from "components/Forms/WrappingInput";
import { MISSING_LABEL, buildLabelError } from "constants/validationMessages";
import { lowerCase } from "lodash";

const mockUseMutation = jest.fn();

jest.mock("@apollo/react-hooks", () => ({
  useMutation: () => [mockUseMutation],
}));

describe("BasicAnswer", () => {
  let answer, onChange, onUpdate, children, props, multipleAnswers;

  const createWrapper = (props, render = shallow) => {
    return render(<StatelessBasicAnswer {...props} />);
  };

  beforeEach(() => {
    answer = {
      id: "ansID1",
      title: "Answer title",
      description: "Answer description",
      label: "",
      type: "TextField",
      advancedProperties: true,
      properties: {
        required: false,
      },
      options: [
        {
          id: "option-1",
          label: "option-label",
          mutuallyExclusive: false,
          description: "option description",
        },
      ],
    };
    onChange = jest.fn();
    onUpdate = jest.fn();
    multipleAnswers = false;

    props = {
      id: "1",
      answer,
      onChange,
      onUpdate,
      multipleAnswers,
      type: "text field",
      children: <div>This is the child component</div>,
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

  it("shows missing label error", () => {
    expect(
      buildLabelError(MISSING_LABEL, `${lowerCase(props.type)}`, 8, 7)
    ).toEqual("Enter a text field label");
  });

  it("shows default label error if missing buildLabelError props", () => {
    expect(buildLabelError(MISSING_LABEL, `${lowerCase(props.type)}`)).toEqual(
      "Label error"
    );
  });

  it("shows default label error if missing buildLabelError insert props", () => {
    expect(buildLabelError(MISSING_LABEL, 8, 7)).toEqual("Label error");
  });

  describe("event handling behaviour", () => {
    let wrapper;

    beforeEach(() => {
      wrapper = createWrapper(props, children, mount);
    });

    it("should invoke update callback onBlur", () => {
      const inputFields = wrapper.find(WrappingInput);
      inputFields.forEach((input) => input.simulate("blur"));

      expect(onUpdate).toHaveBeenCalledTimes(inputFields.length);
    });

    it("should invoke change callback onChange", () => {
      const inputFields = wrapper.find(WrappingInput);
      inputFields.forEach((input) => input.simulate("change"));

      expect(onChange).toHaveBeenCalledTimes(inputFields.length);
    });
  });
});
