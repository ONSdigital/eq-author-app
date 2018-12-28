import React from "react";
import { shallow } from "enzyme";

import RouteButton from "components/Buttons/Button/RouteButton";

describe("components/Button/RouteButton", () => {
  it("should render", () => {
    expect(
      shallow(
        <RouteButton to="destination">
          <div>Content</div>
        </RouteButton>
      )
    ).toMatchSnapshot();
  });
});
