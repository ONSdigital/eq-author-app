import React from "react";
import Button from "components/buttons/Button";
import { render } from "tests/utils/rtl";

describe("components/Button", () => {
  it("renders according to variant", () => {
    render(<Button variant="primary">Primary Button</Button>).getByText(
      "Primary Button"
    );
    render(<Button variant="secondary">Secondary Button</Button>).getByText(
      "Secondary Button"
    );
    render(<Button variant="tertiary">Tertiary Button</Button>).getByText(
      "Tertiary Button"
    );
    render(
      <Button variant="tertiary-light">tertiary-light Button</Button>
    ).getByText("tertiary-light Button");
    render(<Button medium>medium Button</Button>).getByText("medium Button");
    render(<Button small>small Button</Button>).getByText("small Button");
    render(<Button variant="greyed">Button</Button>).getByText("Button");
  });

  it("renders as disabled", () => {
    const { getByText } = render(<Button disabled>Button</Button>);
    expect(getByText("Button")).toHaveAttribute("disabled");
  });
});
