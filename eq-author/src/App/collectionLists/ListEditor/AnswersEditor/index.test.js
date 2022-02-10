import React from "react";
import { shallow } from "enzyme";

import Reorder from "components/Reorder";

import { AnswersEditor } from "./";

describe("Answers Editor", () => {
  jest.useFakeTimers();

  let props;

  beforeEach(() => {
    props = {
      answers: [{ id: "1" }, { id: "2" }],
      onUpdate: jest.fn(),
      onAddOption: jest.fn(),
      onUpdateOption: jest.fn(),
      onDeleteOption: jest.fn(),
      onAddExclusive: jest.fn(),
      onDeleteAnswer: jest.fn(),
      moveAnswer: jest.fn(),
    };
  });

  it("should render", () => {
    const wrapper = shallow(<AnswersEditor {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it("should render the collapsible editor and additional props for the collapsible given", () => {
    const extraProps = {
      canMoveDown: false,
      canMoveUp: false,
      onMoveUp: jest.fn(),
      onMoveDown: jest.fn(),
    };
    const wrapper = shallow(<AnswersEditor {...props} />)
      .find(Reorder)
      .renderProp("children")(extraProps, props.answers[0]);

    expect(wrapper.props()).toMatchObject({
      answer: props.answers[0],
      ...extraProps,
    });
  });
});
