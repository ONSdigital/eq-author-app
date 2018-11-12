import React from "react";
import { shallow } from "enzyme";

import ExpansionTransition from "components/ExpansionTransition";

describe("components/ExpansionTransition", () => {
  it("should render", () => {
    expect(
      shallow(
        <ExpansionTransition>
          <div>Content</div>
        </ExpansionTransition>
      )
    ).toMatchSnapshot();
  });
});
