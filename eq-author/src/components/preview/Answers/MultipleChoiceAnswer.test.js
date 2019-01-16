import React from "react";
import { shallow } from "enzyme";

import { CHECKBOX, RADIO } from "constants/answer-types";

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
