import React from "react";
import { render, fireEvent, act } from "tests/utils/rtl";
import CommentAccordion from "./";

describe("CommentAccordion", () => {
  it("should render accordion expanded", () => {
    const { getByTestId } = render(
      <CommentAccordion title="1">Comment Accordion panel</CommentAccordion>
    );
    expect(getByTestId("accordion-1-body")).not.toBeVisible();
    expect(getByTestId("accordion-1-button")).toBeVisible();
  });

  it("should open and close accordion", async () => {
    const { getByTestId } = render(
      <CommentAccordion title="1">Comment Accordion panel</CommentAccordion>
    );

    await act(async () => {
      await fireEvent.click(getByTestId("accordion-1-button"));
    });
    expect(getByTestId("accordion-1-body")).toBeVisible();

    await act(async () => {
      await fireEvent.click(getByTestId("accordion-1-button"));
    });
    expect(getByTestId("accordion-1-body")).not.toBeVisible();
  });
});
