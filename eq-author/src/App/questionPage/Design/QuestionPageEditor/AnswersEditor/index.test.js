import React from "react";
import { shallow } from "enzyme";

import { UnwrappedAnswersEditor, AnswerSegment } from "./";

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
    const wrapper = shallow(<UnwrappedAnswersEditor {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it("should call moveAnswer with the new index when an answer is moved down", () => {
    const wrapper = shallow(<UnwrappedAnswersEditor {...props} />);
    wrapper
      .find("[data-test='answer-editor']")
      .at(0)
      .simulate("moveDown");
    expect(props.moveAnswer).toHaveBeenCalledWith({
      id: "1",
      position: 1,
    });
  });

  it("should call moveAnswer with the new index when an answer is moved up", () => {
    const wrapper = shallow(<UnwrappedAnswersEditor {...props} />);
    wrapper
      .find("[data-test='answer-editor']")
      .at(1)
      .simulate("moveUp");
    expect(props.moveAnswer).toHaveBeenCalledWith({
      id: "2",
      position: 0,
    });
  });

  it("should not be able to moved down if its the last in the list", () => {
    const wrapper = shallow(<UnwrappedAnswersEditor {...props} />);
    const editor = wrapper.find("[data-test='answer-editor']").at(1);
    expect(editor.prop("canMoveDown")).toEqual(false);
    expect(editor.prop("canMoveUp")).toEqual(true);
  });

  it("should not be able to moved up if its the first in the list", () => {
    const wrapper = shallow(<UnwrappedAnswersEditor {...props} />);
    const editor = wrapper.find("[data-test='answer-editor']").at(0);
    expect(editor.prop("canMoveDown")).toEqual(true);
    expect(editor.prop("canMoveUp")).toEqual(false);
  });

  it("does not blow up when the segment ref is null", () => {
    const wrapper = shallow(<UnwrappedAnswersEditor {...props} />);
    expect(() =>
      wrapper
        .find(AnswerSegment)
        .at(0)
        .props()
        .innerRef(null)
    ).not.toThrow();
  });

  it("should get the height of the element to work out how much to transition", () => {
    const wrapper = shallow(<UnwrappedAnswersEditor {...props} />);
    const getBoundingClientRect = jest.fn().mockReturnValue({ height: 1 });
    wrapper
      .find(AnswerSegment)
      .at(0)
      .props()
      .innerRef({ getBoundingClientRect });

    expect(getBoundingClientRect).toHaveBeenCalledWith();
  });
});
