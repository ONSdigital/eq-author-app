import React from "react";

import { render } from "tests/utils/rtl";

import CollapsibleToggled from ".";

describe("Collapsible toggled", () => {
  it("Can render", () => {
    const { getByTestId } = render(
      <CollapsibleToggled title="Anakin, Chancellor Palpatine is evil!">
        <p>By my point of view the Jedi are evil!</p>
      </CollapsibleToggled>
    );

    const toggle = getByTestId("CollapsibleToggled");

    expect(toggle).toBeVisible();
  });

  it("Defaults to open when the prop is passed", () => {
    const { getByTestId } = render(
      <CollapsibleToggled
        title="Anakin, Chancellor Palpatine is evil!"
        defaultOpen
      >
        <p>By my point of view the Jedi are evil!</p>
      </CollapsibleToggled>
    );

    const content = getByTestId("CollapsibleToggled__Body");

    expect(content).toBeVisible();
  });

  it("Defaults to closed when the prop is not passed", () => {
    const { queryByTestId, debug } = render(
      <CollapsibleToggled title="Anakin, Chancellor Palpatine is evil!">
        <p>By my point of view the Jedi are evil!</p>
      </CollapsibleToggled>
    );

    const content = queryByTestId("CollapsibleToggled__Body");

    expect(content).not.toBeVisible();
  });
});
