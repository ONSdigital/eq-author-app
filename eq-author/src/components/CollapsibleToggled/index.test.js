import React from "react";

import { render } from "tests/utils/rtl";

import CollapsibleToggled from ".";

describe("Collapsible toggled", () => {
  it("Can render", () => {
    const { getByTestId } = render(
      <CollapsibleToggled
        title="Anakin, Chancellor Palpatine is evil!"
        onChange={jest.fn()}
      >
        <p>By my point of view the Jedi are evil!</p>
      </CollapsibleToggled>
    );

    const toggle = getByTestId("CollapsibleToggled");

    expect(toggle).toBeVisible();
  });

  it("Defaults to open when the prop is passed", () => {
    const { getByTestId } = render(
      <CollapsibleToggled
        title="Anakin? I told you were coming to this, I was right. THE JEDI ARE TAKING OVER!"
        isOpen
        onChange={jest.fn()}
      >
        <p>The opression of the Sith will never return. You have lost.</p>
      </CollapsibleToggled>
    );

    const content = getByTestId("collapsible-toggled-body-quoted");

    expect(content).toBeVisible();
  });

  it("Defaults to closed when the prop is not passed", () => {
    const { queryByTestId } = render(
      <CollapsibleToggled
        title="You were the chosen one! It was said that you would destroy the Sith, not join them!"
        onChange={jest.fn()}
      >
        <p>Bring balance to The Force! Not leave it in Darkness!</p>
      </CollapsibleToggled>
    );

    const contentQuoted = queryByTestId("collapsible-toggled-body-quoted");
    const contentUnquoted = queryByTestId("collapsible-toggled-body-unquoted");

    expect(contentQuoted).not.toBeInTheDocument();
    expect(contentUnquoted).not.toBeInTheDocument();
  });

  it("should use unquoted format when quoted is false", () => {
    const { queryByTestId } = render(
      <CollapsibleToggled
        title="You were the chosen one! It was said that you would destroy the Sith, not join them!"
        isOpen
        onChange={jest.fn()}
        quoted={false}
      >
        <p>Bring balance to The Force! Not leave it in Darkness!</p>
      </CollapsibleToggled>
    );

    const contentQuoted = queryByTestId("collapsible-toggled-body-quoted");
    const contentUnquoted = queryByTestId("collapsible-toggled-body-unquoted");

    expect(contentQuoted).not.toBeInTheDocument();
    expect(contentUnquoted).toBeInTheDocument();
  });

  it("should add margin bottom when withContentSpace is true", () => {
    const { getByTestId } = render(
      <CollapsibleToggled
        title="You were the chosen one! It was said that you would destroy the Sith, not join them!"
        isOpen
        onChange={jest.fn()}
        quoted={false}
        withContentSpace
      >
        <p>Bring balance to The Force! Not leave it in Darkness!</p>
      </CollapsibleToggled>
    );

    const header = getByTestId("CollapsibleToggled__Header");

    expect(header).toHaveStyleRule("margin-bottom: 1.5em;");
  });
});
