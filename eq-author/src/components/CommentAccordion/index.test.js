import React from "react";
import { render, fireEvent, screen } from "tests/utils/rtl";
import CommentAccordion, { replyInProgress } from "./";

const setAccordionOpen = jest.fn(() => true);

describe("CommentAccordion", () => {
  it("should render accordion expanded", () => {
    const { getByTestId } = render(
      <CommentAccordion
        title="1"
        isOpen
        setIsOpen={setAccordionOpen}
        inProgress={false}
      >
        Comment Accordion panel
      </CommentAccordion>
    );

    expect(getByTestId("accordion-1-body")).toBeVisible();
    expect(getByTestId("accordion-1-button")).toBeVisible();
  });

  it("should render accordion closed", () => {
    const { getByTestId } = render(
      <CommentAccordion
        title="1"
        isOpen={false}
        setIsOpen={setAccordionOpen}
        inProgress={false}
      >
        Comment Accordion panel
      </CommentAccordion>
    );

    expect(getByTestId("accordion-1-body")).not.toBeVisible();
    expect(getByTestId("accordion-1-button")).toBeVisible();
  });

  it("should render accordion closed with in Progress", () => {
    const { getByTestId, getByText } = render(
      <CommentAccordion
        title="1"
        isOpen={false}
        setIsOpen={setAccordionOpen}
        inProgress
      >
        Comment Accordion panel
      </CommentAccordion>
    );

    expect(getByTestId("accordion-1-body")).not.toBeVisible();
    expect(getByTestId("accordion-1-button")).toBeVisible();
    expect(getByText(replyInProgress)).toBeVisible();
  });

  it("should open or close accordion", () => {
    const { getByTestId, rerender } = render(
      <CommentAccordion
        title="1"
        isOpen={false}
        setIsOpen={setAccordionOpen}
        inProgress={false}
      >
        Comment Accordion panel
      </CommentAccordion>
    );

    fireEvent.click(getByTestId("accordion-1-button"));
    expect(setAccordionOpen).toHaveBeenCalledWith(true);

    rerender(
      <CommentAccordion
        title="1"
        isOpen
        setIsOpen={setAccordionOpen}
        inProgress={false}
      >
        Comment Accordion panel
      </CommentAccordion>
    );

    expect(screen.getByTestId("accordion-1-body")).toBeVisible();

    fireEvent.click(getByTestId("accordion-1-button"));
    expect(setAccordionOpen).toHaveBeenCalledWith(false);

    rerender(
      <CommentAccordion
        title="1"
        isOpen={false}
        setIsOpen={setAccordionOpen}
        inProgress={false}
      >
        Comment Accordion panel
      </CommentAccordion>
    );

    expect(getByTestId("accordion-1-body")).not.toBeVisible();
  });
});
