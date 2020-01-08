import React from "react";
import { render, fireEvent } from "tests/utils/rtl";
import CommentAccordion from "./";

describe("CommentAccordion", () => {
  it("should render open", () => {
    const { getByTestId } = render(
      <CommentAccordion title="foo">Comment Accordion panel</CommentAccordion>
    );
    expect(getByTestId("accordion-foo-body")).not.toBeVisible();
    expect(getByTestId("accordion-foo-button")).toBeVisible();
  });

  it("should open and close accordion", () => {
    const { getByTestId } = render(
      <CommentAccordion title="foo">Comment Accordion panel</CommentAccordion>
    );
    expect(getByTestId("accordion-foo-body")).not.toBeVisible(); //close

    fireEvent.click(getByTestId("accordion-foo-button"));
    expect(getByTestId("accordion-foo-body")).toBeVisible(); //open

    fireEvent.click(getByTestId("accordion-foo-button"));
    expect(getByTestId("accordion-foo-body")).not.toBeVisible(); //close
  });
});
