import React from "react";
import { shallow } from "enzyme";

import OptionTransition from "components/Answers/MultipleChoiceAnswer/OptionTransition";

describe("components/Answer/MultipleChoiceAnswer/OptionTransition", () => {
  it("should render", () => {
    expect(
      shallow(
        <OptionTransition>
          <div>Content</div>
        </OptionTransition>
      )
    ).toMatchSnapshot();
  });
});
