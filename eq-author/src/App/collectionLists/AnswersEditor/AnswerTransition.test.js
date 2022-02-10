import React from "react";
import { shallow, mount } from "enzyme";

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
    const wrapper = mount(
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

    wrapper.find("CSSTransition").prop("onExit")()(node);
    expect(node.getBoundingClientRect).toHaveBeenCalled();
    expect(node.style.height).toEqual("10px");
  });
});
