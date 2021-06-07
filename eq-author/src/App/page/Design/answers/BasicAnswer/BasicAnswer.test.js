import React from "react";
import { shallow, mount } from "enzyme";
import { render as rtlRender, fireEvent, screen } from "tests/utils/rtl";

import { StatelessBasicAnswer } from "./";
import WrappingInput from "components/Forms/WrappingInput";
import { MISSING_LABEL, buildLabelError } from "constants/validationMessages";
import { lowerCase } from "lodash";

const mockUseMutation = jest.fn();

jest.mock("@apollo/react-hooks", () => ({
  useMutation: () => [mockUseMutation],
}));

describe("BasicAnswer", () => {
  let answer;
  let onChange;
  let onUpdate;
  let children;
  let props;
  let multipleAnswers;

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
      options: [
        {
          id: "option-1",
          label: "option-label",
          mutuallyExclusive: false,
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

  it("should render Or option toggle ", async () => {
    rtlRender(() => <StatelessBasicAnswer {...props} type="Percentage" />);

    screen.getByRole("switch");
  });

  it("should NOT render Or option toggle if ans type === Checkbox ", async () => {
    rtlRender(() => <StatelessBasicAnswer {...props} type="Checkbox" />);

    expect(screen.queryByRole("switch")).not.toBeInTheDocument();
  });

  it("should NOT render Or option toggle if ans type === Radio ", async () => {
    rtlRender(() => <StatelessBasicAnswer {...props} type="Radio" />);

    expect(screen.queryByRole("switch")).not.toBeInTheDocument();
  });

  it("should disable Or option toggle if multipleAnswers = true", async () => {
    const { getByTestId } = rtlRender(() => (
      <StatelessBasicAnswer {...props} type="Percentage" multipleAnswers />
    ));

    expect(getByTestId("toggle-wrapper")).toHaveAttribute("disabled");
  });

  it("should show Option label if toggle is on", async () => {
    props.answer.options[0].mutuallyExclusive = true;

    const { getByTestId } = rtlRender(() => (
      <StatelessBasicAnswer {...props} type="Percentage" />
    ));
    fireEvent.click(getByTestId("toggle-or-option-input"), {
      target: { type: "checkbox", checked: true },
    });

    expect(getByTestId("option-label")).toBeInTheDocument();
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
