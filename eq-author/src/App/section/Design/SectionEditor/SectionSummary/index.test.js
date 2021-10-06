import React from "react";
import {
  render as rtlRender,
  act,
  flushPromises,
  fireEvent,
} from "tests/utils/rtl";

import SectionSummary from "../SectionSummary";

const mockUseMutation = jest.fn();

jest.mock("@apollo/react-hooks", () => ({
  useMutation: () => [mockUseMutation],
}));

describe("Section Summary", () => {
  let props;

  beforeEach(() => {
    props = {
      id: "testID1",
      sectionSummary: false,
      collapsibleSummary: false,
    };
  });

  afterEach(async () => {
    await act(async () => {
      await flushPromises();
    });
  });

  describe("section summary toggle", () => {
    it("should render section summary toggle ", async () => {
      const { getByText } = rtlRender(() => <SectionSummary {...props} />);

      expect(getByText("Section summary")).toBeInTheDocument();
    });

    it("Should enable and disable section summary when toggled", async () => {
      const { getByTestId } = rtlRender(() => <SectionSummary {...props} />);

      const preToggle = getByTestId("section-summary");

      const toggle = Object.values(preToggle.children).reduce((child) =>
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
            sectionSummary: true,
            collapsibleSummary: false,
          },
        },
      });
    });
  });

  describe("Collapsible summary toggle", () => {
    it("should render section summary toggle ", async () => {
      const { getByText } = rtlRender(() => <SectionSummary {...props} />);

      expect(getByText("Collapsible summary")).toBeInTheDocument();
    });

    it("Should enable and disable section summary when toggled", async () => {
      const { getByTestId } = rtlRender(() => <SectionSummary {...props} />);

      const preToggle = getByTestId("collapsible-summary");

      const toggle = Object.values(preToggle.children).reduce((child) =>
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
            collapsibleSummary: true,
          },
        },
      });
    });

    it("Should disable collapsible summary toggle when section summary off", async () => {
      const { getByTestId } = rtlRender(() => <SectionSummary {...props} />);

      const preToggle = getByTestId("collapsible-summary-wrapper");
      expect(preToggle).toHaveAttribute("disabled");
    });
  });
});
