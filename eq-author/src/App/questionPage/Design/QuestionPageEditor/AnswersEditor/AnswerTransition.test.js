import React from "react";
import { shallow } from "enzyme";

import AnswerTransition from "./AnswerTransition";

describe("components/QuestionPageEditor/AnswerTransition", () => {
  it("should render", () => {
    expect(
      shallow(
        <AnswerTransition>
          <div>Content</div>
        </AnswerTransition>
      )
    ).toMatchSnapshot();
  });

  it("should set the final height of the element to the height of the element at the end of transition", () => {
    const wrapper = shallow(
      <AnswerTransition>
        <div>Content</div>
      </AnswerTransition>
    );
    const node = {
      getBoundingClientRect: jest.fn().mockReturnValue({ height: 10 }),
      style: {
        height: null,
      },
    };
    wrapper.props().onExit(node);
    expect(node.style.height).toEqual("10px");
  });
});
