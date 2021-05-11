import React from "react";
import { render, screen, fireEvent } from "tests/utils/rtl";
import { Fallback } from "./Fallback";
import { buildAnswers } from "tests/utils/createMockQuestionnaire";

const answer = (properties) => ({
  ...buildAnswers({ answerCount: 1 })[0],
  type: "DateRange",
  properties: { required: false, fallback: { enabled: false } },
  ...properties,
});

describe("Fallback", () => {
  let onChange;
  const metadata = [
    {
      id: "1",
      displayName: "metadata one",
      key: "metadata-one",
      dateValue: "2016-05-10",
      type: "Date",
    },
    {
      id: "2",
      displayName: "metadata two",
      key: "metadata-two",
      dateValue: "2016-05-11",
      type: "Date",
    },
  ];

  describe("Fallback not set", () => {
    it("should be disabled when property not set", () => {
      render(
        <Fallback
          metadata={metadata}
          onChange={jest.fn()}
          answer={answer({ properties: {} })}
        />
      );
      expect(screen.getByTestId("fallback-label-input").checked).toBe(false);
    });
  });

  describe("Fallback disabled", () => {
    beforeEach(() => {
      onChange = jest.fn();

      render(
        <Fallback metadata={metadata} onChange={onChange} answer={answer()} />
      );
    });
    it("should render", () => {
      expect(screen.getByText(/Fallback/)).toBeVisible();
    });

    it("should fire onChange when toggling fallback", () => {
      fireEvent.click(screen.getByTestId("fallback-label-input"));
      expect(onChange).toHaveBeenCalledWith("DateRange", {
        fallback: { enabled: true },
      });
    });
  });

  describe("Fallback enabled", () => {
    let onChange;
    beforeEach(() => {
      onChange = jest.fn();
      render(
        <Fallback
          metadata={metadata}
          onChange={onChange}
          answer={answer({
            properties: { required: false, fallback: { enabled: true } },
            label: "Start",
            secondaryLabel: "End",
          })}
        />
      );
    });

    it("should show labels instead of untitled answer", () => {
      expect(screen.getByText("Start")).toBeVisible();
      expect(screen.getByText("End")).toBeVisible();
    });

    it("should fire onChange when selecting option", () => {
      fireEvent.change(screen.getAllByTestId("fallback-select")[0], {
        target: { value: "metadata-one" },
      });

      expect(onChange).toHaveBeenCalledWith("DateRange", {
        fallback: expect.objectContaining({
          start: "metadata-one",
        }),
      });
    });
  });
});
