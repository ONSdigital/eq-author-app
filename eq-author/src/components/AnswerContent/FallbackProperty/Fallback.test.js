import React from "react";
import { render, screen, fireEvent } from "tests/utils/rtl";
import Fallback from "./Fallback";
import { buildAnswers } from "tests/utils/createMockQuestionnaire";

const answer = (properties) => ({
  ...buildAnswers({ answerCount: 1 })[0],
  type: "DateRange",
  properties: { required: false, fallback: { enabled: false } },
  ...properties,
});

describe("Fallback", () => {
  let updateAnswer;
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
          updateAnswer={jest.fn()}
          answer={answer({ properties: {} })}
        />
      );
      expect(screen.getByTestId("fallback-label-input").checked).toBe(false);
    });
  });

  describe("Fallback disabled", () => {
    beforeEach(() => {
      updateAnswer = jest.fn();

      render(
        <Fallback
          metadata={metadata}
          updateAnswer={updateAnswer}
          answer={answer()}
        />
      );
    });
    it("should render", () => {
      expect(screen.getByText(/Fallback/)).toBeVisible();
    });

    it("should fire onChange when toggling fallback", () => {
      fireEvent.click(screen.getByTestId("fallback-label-input"));
      expect(updateAnswer).toHaveBeenCalledWith({
        variables: {
          input: {
            id: "1.1.1.1",
            properties: {
              fallback: { enabled: true },
              required: false,
            },
          },
        },
      });
    });
  });

  describe("Fallback enabled", () => {
    let updateAnswer;
    beforeEach(() => {
      updateAnswer = jest.fn();
      render(
        <Fallback
          metadata={metadata}
          updateAnswer={updateAnswer}
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

      expect(updateAnswer).toHaveBeenCalledWith({
        variables: {
          input: {
            id: "1.1.1.1",
            properties: {
              fallback: { enabled: true, start: "metadata-one" },
              required: false,
            },
          },
        },
      });
    });
  });
});
