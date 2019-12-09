import React from "react";
import { render } from "tests/utils/rtl";

import LinkButton from "components/buttons/Button/LinkButton";

describe("components/Button/LinkButton", () => {
  it("should render", () => {
    expect(
      render(
        <LinkButton href="/test">
          <div>Content</div>
        </LinkButton>
      ).asFragment()
    ).toMatchSnapshot();
  });
});
