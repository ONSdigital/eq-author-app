import React from "react";
import { render, fireEvent } from "tests/utils/rtl";
import { RoutingDestinationContentPicker } from "./RoutingDestinationContentPicker";

import { useQuestionnaire, usePage } from "components/QuestionnaireContext";
import { buildQuestionnaire } from "tests/utils/createMockQuestionnaire";

jest.mock("components/QuestionnaireContext", () => ({
  useQuestionnaire: jest.fn(),
  usePage: jest.fn(),
}));

const props = {
  selected: { logical: "NextPage" },
};

const mockQuestionnaire = buildQuestionnaire({
  sectionCount: 2,
  pageCount: 2,
});

useQuestionnaire.mockImplementation(() => ({
  questionnaire: mockQuestionnaire,
}));
usePage.mockImplementation(
  () => mockQuestionnaire.sections[0].folders[0].pages[0]
);

function setup({ selected, ...extra }) {
  const onSubmit = jest.fn();

  const utils = render(
    <RoutingDestinationContentPicker
      selected={selected}
      onSubmit={onSubmit}
      {...extra}
    />
  );

  const clickOpen = () =>
    fireEvent.click(utils.getByTestId("content-picker-select"));
  const clickByText = (text) => fireEvent.click(utils.getByText(text));
  const clickSubmit = () => fireEvent.click(utils.getByText("Confirm"));

  return {
    ...utils,
    onSubmit,
    clickOpen,
    clickByText,
    clickSubmit,
  };
}

function defaultSetup() {
  const utils = setup(props);
  return { ...utils };
}

function modifiedSetup(change) {
  const utils = setup({ ...props, ...change });
  return { ...utils };
}

describe("RoutingDestinationContentPicker", () => {
  it("should render", () => {
    const { clickOpen, getByText } = defaultSetup();
    clickOpen();
    expect(getByText("Select a destination")).toBeVisible();
  });

  it("should fire onSubmit with destination when confirming", () => {
    const { clickOpen, clickByText, clickSubmit, onSubmit } = defaultSetup();
    clickOpen();
    clickByText("Page 1.1.2");
    clickSubmit();
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "routingDestination",
        value: expect.objectContaining({
          id: "1.1.2",
          displayName: "Page 1.1.2",
          section: expect.objectContaining({
            id: "1",
            displayName: "Section 1",
          }),
        }),
      })
    );
  });

  it("should close content picker", () => {
    const { clickOpen, clickByText, queryByText } = defaultSetup();
    clickOpen();
    expect(queryByText("Select a destination")).toBeVisible();
    clickByText("Cancel");
    expect(queryByText("Select a destination")).not.toBeVisible();
  });

  it("should not render 'Later sections' when else destination selector", () => {
    const { clickOpen, queryByText } = modifiedSetup({
      id: "else",
    });
    clickOpen();
    expect(queryByText("Later sections")).toBeNull();
  });

  describe("displayName", () => {
    it("should correctly render page display name", () => {
      const { getByText } = modifiedSetup({
        selected: { page: { id: "1", displayName: "page name" } },
      });
      expect(getByText("page name")).toBeVisible();
    });

    it("should correctly render section display name", () => {
      const { getByText } = modifiedSetup({
        selected: { section: { id: "1", displayName: "section name" } },
      });
      expect(getByText("section name")).toBeVisible();
    });

    it("should correctly render logicalDestination EndOfQuestionnaire", () => {
      const { getByText } = modifiedSetup({
        selected: { logical: "EndOfQuestionnaire" },
      });

      expect(getByText("End of questionnaire")).toBeVisible();
    });

    it("should correctly render logicalDestination NextPage", () => {
      const { getByText } = modifiedSetup({
        selected: { logical: "NextPage" },
      });

      expect(getByText("Next page")).toBeVisible();
    });

    it("should correctly render logicalDestination Default", () => {
      const { getByText } = modifiedSetup({
        selected: { logical: "Default" },
      });

      expect(getByText("Select a destination")).toBeVisible();
    });

    it("should display the default destination if everything is null", () => {
      const { getByText } = modifiedSetup({ selected: { logical: null } });

      expect(getByText("Select a destination")).toBeVisible();
    });
  });
});
