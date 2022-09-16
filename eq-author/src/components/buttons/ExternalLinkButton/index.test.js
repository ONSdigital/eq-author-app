import React from "react";
import { render } from "tests/utils/rtl";

import ExternalLinkButton from "components/buttons/ExternalLinkButton";

describe("LinkButtonWithIcon", () => {
  it("should render", () => {
    expect(
      render(
        <ExternalLinkButton href="/test">
          <div>Content</div>
        </ExternalLinkButton>
      ).asFragment()
    ).toMatchSnapshot();
  });
});
