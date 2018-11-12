import React from "react";
import { shallow } from "enzyme";

import AnswerTransition from "components/QuestionPageEditor/AnswerTransition";

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
});
