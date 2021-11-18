import React from "react";
import Theme from "contexts/themeContext";
import Button from "components-themed/buttons";
import { render, screen } from "tests/utils/rtl";

describe("components/Button", () => {
  it("renders according to variant", () => {
    render(
      <Theme>
        <Button variant="primary">Primary Button</Button>
      </Theme>
    ).getByText("Primary Button");
    render(
      <Theme>
        <Button variant="secondary">Secondary Button</Button>
      </Theme>
    ).getByText("Secondary Button");
    render(
      <Theme>
        <Button variant="ghost">Ghost Button</Button>
      </Theme>
    ).getByText("Ghost Button");
    render(
      <Theme>
        <Button variant="ghost-primary">Ghost Primary Button</Button>
      </Theme>
    ).getByText("Ghost Primary Button");
    render(
      <Theme>
        <Button variant="ghost-white">Ghost White Button</Button>
      </Theme>
    ).getByText("Ghost White Button");
    render(
      <Theme>
        <Button small>small Button</Button>
      </Theme>
    ).getByText("small Button");
    render(
      <Theme>
        <Button narrow>narrow Button</Button>
      </Theme>
    ).getByText("narrow Button");
    render(
      <Theme themeName={"default"}>
        <Button noBorders>noBorders Button</Button>
      </Theme>
    ).getByText("noBorders Button");
  });

  it("renders as disabled", () => {
    render(
      <Theme>
        <Button data-test="button" variant="primary" disabled>
          Button
        </Button>
      </Theme>
    );
    expect(screen.getByTestId("button")).toHaveAttribute("disabled");
  });
});
