import React from "react";
import {
  render as rtlRender,
  act,
  flushPromises,
  fireEvent,
} from "tests/utils/rtl";

import RepeatingSection from "../RepeatingSection";

import suppressConsoleMessage from "tests/utils/supressConsol";

/*
 * @description Suppresses specific messages from being logged in the Console.
 */
suppressConsoleMessage(
  "Failed prop type: Invalid prop `children` supplied to `Provider`",
  "error"
);
const mockUseQuery = jest.fn();
const mockUseMutation = jest.fn();

jest.mock("@apollo/react-hooks", () => ({
  useQuery: () => [mockUseQuery],
  useMutation: () => [mockUseMutation],
}));

describe("Repeating Section", () => {
  let props;

  beforeEach(() => {
    props = {
      section: {
        id: "section-1",
        title: "Section 1",
        alias: "alias",
        introductionTitle: "Intro title",
        introductionContent: "Intro content",
        requiredCompleted: true,
        showOnHub: true,
        sectionSummary: false,
        collapsibleSummary: false,
        repeatingSection: false,
        repeatingSectionListId: null,
        questionnaire: {
          id: "2",
          navigation: true,
          hub: false,
          collapsibleSummary: false,
        },
        validationErrorInfo: {
          id: "3",
          totalCount: 0,
          errors: [],
        },
        comments: [],
      },
      handleUpdate: jest.fn(),
    };
  });

  afterEach(async () => {
    await act(async () => {
      await flushPromises();
    });
  });

  describe("Repeating section toggle", () => {
    it("should render repeating section toggle ", async () => {
      const { getByTestId } = rtlRender(() => <RepeatingSection {...props} />);
      expect(getByTestId("repeatingSection-input")).toBeInTheDocument();
      expect(getByTestId("repeatingSection-input").checked).toBe(false);
    });

    it("Should enable and disable repeating section when toggled", async () => {
      const { getByTestId } = rtlRender(() => <RepeatingSection {...props} />);
      const repeatingSectionToggle = getByTestId("repeatingSection-input");
      expect(getByTestId("repeatingSection-input").checked).toBe(false);
      fireEvent.change(repeatingSectionToggle, {
        target: { checked: true },
      });
      expect(repeatingSectionToggle.checked).toBe(true);
    });
  });
});
