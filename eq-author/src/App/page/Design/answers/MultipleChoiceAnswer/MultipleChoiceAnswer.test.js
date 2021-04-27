import React from "react";
import { UnwrappedMultipleChoiceAnswer as MultipleChoiceAnswer } from "./";
import Option from "./Option";
import Reorder from "components/Reorder";

import { times } from "lodash";

import { shallow } from "enzyme";
import createMockStore from "tests/utils/createMockStore";
describe("MultipleChoiceAnswer", () => {
  let wrapper;

  let answer = {
    id: "0",
    options: [
      {
        id: "1",
        label: "",
        description: "",
        __typename: "Option",
      },
    ],
  };

  let store;

  const option = {
    id: "123",
    __typename: "Option",
  };

  const optionWithAnswer = {
    answer: {
      ...answer,
      id: "1",
      type: "TextField",
    },
    option: {
      ...option,
      id: "2",
    },
  };

  const mutuallyExclusiveOption = {
    id: "4",
    label: "I am mutually exclusive",
    description: "",
    __typename: "Option",
  };

  let mockHandlers = {};

  const createAnswer = (numberOptions) => ({
    ...answer,
    options: times(numberOptions, (id) => ({
      id: id,
      label: "",
      description: "",
    })),
  });

  const createWrapper = ({ answer, minOptions }, render = shallow) =>
    render(
      <MultipleChoiceAnswer
        {...mockHandlers}
        answer={answer}
        minOptions={minOptions}
        store={store}
      />
    );

  beforeEach(() => {
    store = createMockStore();
    mockHandlers = {
      ...mockHandlers,
      onAddOption: jest.fn(() => Promise.resolve(option)),
      onUpdate: jest.fn(),
      onAddExclusive: jest.fn(() => Promise.resolve(option)),
      onUpdateOption: jest.fn(),
      onDeleteOption: jest.fn(),
      onChange: jest.fn(),
      onMoveOption: jest.fn(),
    };

    wrapper = createWrapper({ answer });
  });

  it("should have one option by default", () => {
    const ReorderComponent = wrapper.find(Reorder);

    expect(ReorderComponent.prop("list")).toHaveLength(1);
  });

  it("should match snapshot", () => {
    expect(wrapper).toMatchSnapshot();
  });

  it("should add a new option when add button is clicked", () => {
    const preventDefault = jest.fn();
    const stopPropagation = jest.fn();
    wrapper
      .find("[dataTest='btn-add-option']")
      .simulate("primaryAction", { preventDefault, stopPropagation });

    expect(preventDefault).toHaveBeenCalled();
    expect(stopPropagation).toHaveBeenCalled();
    expect(mockHandlers.onAddOption).toHaveBeenCalledWith(answer.id, {
      hasAdditionalAnswer: false,
    });
  });

  it("should render the Options", () => {
    const extraProps = {
      canMoveDown: false,
      canMoveUp: false,
      onMoveUp: jest.fn(),
      onMoveDown: jest.fn(),
    };

    const Options = wrapper.find(Reorder).renderProp("children")(
      extraProps,
      option
    );

    expect(Options.find(Option)).toHaveLength(1);
  });

  // it("should render the Options with additional answer", () => {
  //   const extraProps = {
  //     canMoveDown: false,
  //     canMoveUp: false,
  //     onMoveUp: jest.fn(),
  //     onMoveDown: jest.fn(),
  //   };

  //   option.additionalAnswer = {
  //     id: "add1",
  //   };

  //   const Options = wrapper.find(Reorder).renderProp("children")(
  //     extraProps,
  //     option
  //   );

  //   expect(
  //     Options.find("Field__StyledField")
  //   ).toHaveLength(1);
  // });

  describe("delete button", () => {
    const minOptions = 2;

    beforeEach(() => {
      wrapper.setProps({ minOptions });
    });

    it("should not show when number options <= minOptions", () => {
      const answer = createAnswer(minOptions);
      wrapper.setProps({ answer });

      wrapper.find(Option).forEach((option) => {
        expect(option.prop("hasDeleteButton")).toBe(false);
      });
    });

    it("should show when number options > minOptions", () => {
      const answer = createAnswer(minOptions + 1);
      wrapper.setProps({ answer });

      wrapper.find(Option).forEach((option) => {
        expect(option.prop("hasDeleteButton")).toBe(true);
      });
    });

    it("should handle deleting an option", () => {
      const optionId = answer.options[0].id;
      wrapper.instance().handleOptionDelete(optionId);

      expect(mockHandlers.onDeleteOption).toHaveBeenCalledWith(
        optionId,
        answer.id
      );
    });
  });

  describe("other option and answer", () => {
    const minOptions = 2;

    let answerWithOther;
    let preventDefault;

    beforeEach(() => {
      answerWithOther = {
        ...createAnswer(minOptions),
        other: optionWithAnswer,
      };

      preventDefault = jest.fn();

      wrapper = createWrapper({ answer: answerWithOther });
    });

    it("should render other", () => {
      expect(wrapper).toMatchSnapshot();
    });

    it("should call add option with 2nd argument true on click of split button menu item", () => {
      wrapper
        .find("[data-test='btn-add-option-other']")
        .first()
        .simulate("click", { preventDefault });
      expect(mockHandlers.onAddOption).toHaveBeenCalledWith(
        answerWithOther.id,
        { hasAdditionalAnswer: true }
      );
    });

    it("should show delete button when number options + other > minOptions", () => {
      const moreThanTwoOptions = {
        ...createAnswer(2),
        other: optionWithAnswer,
      };
      wrapper = createWrapper({ answer: moreThanTwoOptions, minOptions });
      wrapper.find(Option).forEach((option) => {
        expect(option.prop("hasDeleteButton")).toBe(true);
      });
    });

    it("should not show delete button when number options + other <= minOptions", () => {
      const twoOptionsExactly = {
        ...createAnswer(1),
        other: optionWithAnswer,
      };
      wrapper = createWrapper({ answer: twoOptionsExactly, minOptions });
      wrapper.find(Option).forEach((option) => {
        expect(option.prop("hasDeleteButton")).toBe(false);
      });
    });
  });

  describe("exclusive options", () => {
    const minOptions = 1;
    let preventDefault;
    let answerWithExclusive;
    let stopPropagation;

    beforeEach(() => {
      answerWithExclusive = {
        ...createAnswer(minOptions),
        mutuallyExclusiveOption,
        type: "Checkbox",
      };

      preventDefault = jest.fn();
      stopPropagation = jest.fn();
    });

    it("should render exclusive", () => {
      wrapper = createWrapper({ answer: answerWithExclusive });
      expect(wrapper).toMatchSnapshot();
    });

    it("exclusive should always be the final option", () => {
      wrapper = createWrapper({ answer: answerWithExclusive });

      expect(wrapper.find(Option).last().props().option.label).toEqual(
        "I am mutually exclusive"
      );
    });

    it("can add Exclusive option", () => {
      wrapper = createWrapper({ answer: answerWithExclusive });

      wrapper
        .find('[data-test="btn-add-mutually-exclusive-option"]')
        .first()
        .simulate("click", { preventDefault, stopPropagation });

      expect(preventDefault).toHaveBeenCalled();
      expect(mockHandlers.onAddExclusive).toHaveBeenCalledWith(answer.id);
    });

    it("should disable add button when exclusive answer already exists", () => {
      wrapper = createWrapper({ answer: answerWithExclusive });

      expect(
        wrapper
          .find('[data-test="btn-add-mutually-exclusive-option"]')
          .first()
          .props().disabled
      ).toBe(true);
    });
  });
});
