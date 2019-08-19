import React from "react";
import { render } from "tests/utils/rtl";
import NavLink, { activeClassName } from "./NavLink";

describe("NavLink", () => {
  const props = {
    to: "/page-1",
    title: "Page 1",
    icon: () => <svg />,
    isActive: () => true,
  };

  it("should have the active class name when on current page", () => {
    const { getByTestId } = render(
      <NavLink {...props} isActive={() => true}>
        Page 1
      </NavLink>
    );
    expect(getByTestId("nav-link")).toHaveClass(activeClassName);
  });

  it("should not have the active class when not on the current page", () => {
    const { getByTestId } = render(
      <NavLink {...props} isActive={() => false}>
        Page 1
      </NavLink>
    );
    expect(getByTestId("nav-link")).not.toHaveClass(activeClassName);
  });

  it("should show a badge when it has errors", () => {
    const { getByTestId } = render(
      <NavLink {...props} errorCount={9999}>
        Page 1
      </NavLink>
    );

    expect(getByTestId("nav-link")).toHaveTextContent(9999);
  });
});
