import React from "react";
import { shallow } from "enzyme";
import { render } from "tests/utils/rtl";

import { CHECKBOX, RADIO, MUTUALLY_EXCLUSIVE } from "constants/answer-types";

import MultipleChoiceAnswer, {
  Option,
  OptionItem,
  Input,
} from "./MultipleChoiceAnswer";

describe("MultipleChoiceAnswer", () => {
  let answer;

  beforeEach(() => {
    answer = {
      label: "Foo",
      options: [{ id: "1" }],
    };
  });

  it("should render checkboxes", () => {
    answer.type = CHECKBOX;
    expect(shallow(<MultipleChoiceAnswer answer={answer} />)).toMatchSnapshot();
  });

  it("should render radio", () => {
    answer.type = RADIO;
    expect(shallow(<MultipleChoiceAnswer answer={answer} />)).toMatchSnapshot();
  });

  it("should render other when it has one", () => {
    answer.type = RADIO;
    answer.options[1] = {
      id: "2",
      additionalAnswer: {
        id: 2,
        type: "TextField",
      },
    };
    expect(shallow(<MultipleChoiceAnswer answer={answer} />)).toMatchSnapshot();
  });

  it("should render mutually exclusive when it has one", () => {
    answer.type = CHECKBOX;
    answer.mutuallyExclusiveOption = {
      id: "3",
    };
    expect(shallow(<MultipleChoiceAnswer answer={answer} />)).toMatchSnapshot();
  });

  it("should render Input", () => {
    expect(shallow(<Input />)).toMatchSnapshot();
  });

  it("should render Input with radio and error", () => {
    expect(shallow(<Input type={RADIO} error />)).toMatchSnapshot();
  });

  it("should render OptionItem", () => {
    expect(shallow(<OptionItem />)).toMatchSnapshot();
  });

  it("should render OptionItem with error", () => {
    expect(shallow(<OptionItem error />)).toMatchSnapshot();
  });

  describe("Option", () => {
    let option;

    beforeEach(() => {
      option = {
        id: "1",
      };
    });

    it("should render radio options", () => {
      expect(
        shallow(<Option option={option} type={RADIO} />)
      ).toMatchSnapshot();
    });

    it("should render checkbox options", () => {
      expect(
        shallow(<Option option={option} type={CHECKBOX} />)
      ).toMatchSnapshot();
    });

    it("should render mutually exclusive with multiple options", () => {
      const answerOptions = [
        { id: "1", label: "test" },
        { id: "2", label: "test2" },
      ];
      answer = { type: CHECKBOX };
      const { getByTestId } = render(
        <Option
          option={option}
          type={MUTUALLY_EXCLUSIVE}
          answerOptions={answerOptions}
        />
      );

      expect(getByTestId("MutuallyExclusive-input")).toHaveStyle({
        "border-radius": "100px",
      });
    });

    it("should render label when it has one", () => {
      option.label = "Option label";
      expect(
        shallow(<Option option={option} type={CHECKBOX} />)
      ).toMatchSnapshot();
    });

    it("should render answer when it has one", () => {
      answer = {
        id: "1",
      };
      expect(
        shallow(<Option option={option} type={CHECKBOX} answer={answer} />)
      ).toMatchSnapshot();
    });
  });
});
