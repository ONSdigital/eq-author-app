import React from "react";
import { render, fireEvent } from "tests/utils/rtl";
import Accordion from "./";

describe("Accordion", () => {
  it("should render open", () => {
    const { getByTestId } = render(
      <Accordion title="foo">Accordion panel</Accordion>
    );
    expect(getByTestId("accordion-foo-body")).toBeVisible();
    expect(getByTestId("accordion-foo-button")).toBeVisible();
  });

  it("should open and close accordion", () => {
    const { getByTestId } = render(
      <Accordion title="foo">Accordion panel</Accordion>
    );
    expect(getByTestId("accordion-foo-body")).toBeVisible(); //open

    fireEvent.click(getByTestId("accordion-foo-button"));
    expect(getByTestId("accordion-foo-body")).not.toBeVisible(); //close

    fireEvent.click(getByTestId("accordion-foo-button"));
    expect(getByTestId("accordion-foo-body")).toBeVisible(); //open
  });
});
