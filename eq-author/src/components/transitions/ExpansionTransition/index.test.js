import React from "react";
import { render } from "tests/utils/rtl";
import ExpansionTransition from "components/MainCanvas";

describe("ExpansionTransition", () => {
  it("should render", () => {
    const { asFragment } = render(
      <ExpansionTransition>
        <div>Content</div>
      </ExpansionTransition>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
