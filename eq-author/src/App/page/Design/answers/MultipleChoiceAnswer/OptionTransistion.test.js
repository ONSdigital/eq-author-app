import React from "react";
import { render } from "tests/utils/rtl";

import OptionTransition from "./OptionTransition";

describe("components/Answer/MultipleChoiceAnswer/OptionTransition", () => {
  it("should render", () => {
    expect(
      render(
        <OptionTransition>
          <div>Content</div>
        </OptionTransition>
      ).asFragment()
    ).toMatchSnapshot();
  });
});
