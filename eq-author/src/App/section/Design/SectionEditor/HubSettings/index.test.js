import React from "react";
import {
  render as rtlRender,
  act,
  flushPromises,
  fireEvent,
} from "tests/utils/rtl";

import HubSettings from "../HubSettings";

import suppressConsoleMessage from "tests/utils/supressConsol";

/*
 * @description Suppresses specific messages from being logged in the Console.
 */
suppressConsoleMessage(
  "Failed prop type: Invalid prop `children` supplied to `Provider`",
  "error"
);

// eslint-disable-next-line no-console
console.log(
  `Warn: there are manually suppressed warnings or errors in this test file due to dependencies needing updates - See EAR-1095`
);

const mockUseMutation = jest.fn();

jest.mock("@apollo/react-hooks", () => ({
  useMutation: () => [mockUseMutation],
}));

describe("Section HubSettings", () => {
  let props;

  beforeEach(() => {
    props = {
      id: "testID1",
      requiredCompleted: false,
      showOnHub: false,
    };
  });

  afterEach(async () => {
    await act(async () => {
      await flushPromises();
    });
  });

  describe("Pre-hub section toggle", () => {
    it("should render Pre-hub toggle ", async () => {
      const { getByText } = rtlRender(() => <HubSettings {...props} />);

      expect(getByText("Pre-hub section")).toBeInTheDocument();
    });

    it("Should enable and disable Pre-hub section when toggled", async () => {
      const { getByTestId } = rtlRender(() => <HubSettings {...props} />);

      const preHubToggle = getByTestId("required-completed");

      const toggle = Object.values(preHubToggle.children).reduce((child) =>
        child.type === "checkbox" ? child : null
      );

      await act(async () => {
        await fireEvent.click(toggle);
        flushPromises();
      });

      expect(mockUseMutation.mock.calls.length).toBe(1);
      expect(mockUseMutation).toBeCalledWith({
        variables: {
          input: {
            id: props.id,
            requiredCompleted: true,
            showOnHub: true,
          },
        },
      });
    });
  });

  describe("Display section in hub", () => {
    it("should render Display section toggle ", async () => {
      const { getByText } = rtlRender(() => <HubSettings {...props} />);

      expect(
        getByText("Show section on hub and summary pages")
      ).toBeInTheDocument();
    });

    it("should render Display section toggle as disabled IF Pre-Hub toggle is OFF ", async () => {
      const { getByTestId } = rtlRender(() => <HubSettings {...props} />);

      expect(getByTestId("toggle-wrapper")).toHaveAttribute("disabled");
    });

    it("Should enable and disable 'Display section in hub' when toggled", async () => {
      const { getByTestId } = rtlRender(() => <HubSettings {...props} />);

      const preHubToggle = getByTestId("show-onHub");

      const toggle = Object.values(preHubToggle.children).reduce((child) =>
        child.type === "checkbox" ? child : null
      );

      await act(async () => {
        await fireEvent.click(toggle);
        flushPromises();
      });

      expect(mockUseMutation.mock.calls.length).toBe(2);
      expect(mockUseMutation).toBeCalledWith({
        variables: {
          input: {
            id: props.id,
            showOnHub: true,
          },
        },
      });
    });
  });
});
