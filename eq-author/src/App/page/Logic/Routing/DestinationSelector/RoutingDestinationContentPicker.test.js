import React from "react";
import { render, fireEvent } from "tests/utils/rtl";
import { UnwrappedRoutingDestinationContentPicker as DestinationContentPicker } from "./RoutingDestinationContentPicker";

const props = {
  selected: { logical: "NextPage" },
  loading: false,
  data: () => ({
    page: {
      id: "5",
      availableRoutingDestinations: {
        logicalDestinations: [
          {
            id: "NextPage",
            logicalDestination: "NextPage",
            __typename: "LogicalDestination",
          },
          {
            id: "EndOfQuestionnaire",
            logicalDestination: "EndOfQuestionnaire",
            __typename: "LogicalDestination",
          },
        ],
        pages: [
          {
            id: "c9d80752-daba-4f31-9bd9-9f199182334c",
            displayName: "s1q3",
            section: {
              id: "a1563df9-a671-4ac8-9958-4544eb9d6a64",
              displayName: "section1",
              __typename: "Section",
            },
            __typename: "QuestionPage",
          },
          {
            id: "04c776d3-24ea-4630-ad2d-30b6a0c0e5f4",
            displayName: "s1q4",
            section: {
              id: "a1563df9-a671-4ac8-9958-4544eb9d6a64",
              displayName: "section1",
              __typename: "Section",
            },
            __typename: "QuestionPage",
          },
        ],
        sections: [
          {
            id: "0f6cfdcf-7876-41f6-80e9-143fb6b85e69",
            displayName: "section2",
            pages: [
              {
                id: "0f6cfdcf-7876-41f6-80e9-143fb6b85e69",
                displayName: "s2q1",
                __typename: "Section",
              },
            ],
            __typename: "Section",
          },
          {
            id: "d3ea428b-a30e-497f-aff3-6895560a1282",
            displayName: "section3",
            pages: [
              {
                id: "d3ea428b-a30e-497f-aff3-6895560a1282",
                displayName: "s3q1",
                __typename: "Section",
              },
            ],
            __typename: "Section",
          },
        ],
        __typename: "AvailableRoutingDestinations",
      },
    },
  }),
};

function setup({ data, loading, selected, ...extra }) {
  const onSubmit = jest.fn();

  const utils = render(
    <DestinationContentPicker
      data={data()}
      loading={loading}
      selected={selected}
      onSubmit={onSubmit}
      {...extra}
    />
  );

  const clickOpen = () =>
    fireEvent.click(utils.getByTestId("content-picker-select"));
  const clickByText = text => fireEvent.click(utils.getByText(text));
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
    const utils = defaultSetup();
    utils.clickOpen();
    expect(utils.getByText("Select a destination")).toBeVisible();
  });

  it("should fire onSubmit with destination when confirming", () => {
    const utils = defaultSetup();
    utils.clickOpen();
    utils.clickByText("s1q4");
    utils.clickSubmit();
    expect(utils.onSubmit).toHaveBeenCalledWith({
      name: "routingDestination",
      value: {
        id: "04c776d3-24ea-4630-ad2d-30b6a0c0e5f4",
        displayName: "s1q4",
        section: {
          id: "a1563df9-a671-4ac8-9958-4544eb9d6a64",
          displayName: "section1",
          __typename: "Section",
        },
        __typename: "QuestionPage",
      },
    });
  });

  describe("displayName", () => {
    it("should correctly render page display name", () => {
      const utils = modifiedSetup({
        selected: { page: { id: "1", displayName: "page name" } },
      });
      expect(utils.getByText("page name")).toBeVisible();
    });

    it("should correctly render section display name", () => {
      const utils = modifiedSetup({
        selected: { section: { id: "1", displayName: "section name" } },
      });
      expect(utils.getByText("section name")).toBeVisible();
    });

    it("should correctly render logicalDestination EndOfQuestionnaire", () => {
      const utils = modifiedSetup({
        selected: { logical: "EndOfQuestionnaire" },
      });

      expect(utils.getByText("End of questionnaire")).toBeVisible();
    });

    it("should correctly render logicalDestination NextPage", () => {
      const utils = modifiedSetup({
        selected: { logical: "NextPage" },
      });

      expect(utils.getByText("Next page")).toBeVisible();
    });

    it("should correctly render logicalDestination Default", () => {
      const utils = modifiedSetup({
        selected: { logical: "Default" },
      });

      expect(utils.getByText("Select a destination")).toBeVisible();
    });

    it("should render with no display name if loading and next page selected", () => {
      const utils = modifiedSetup({
        loading: true,
      });
      // utils.debug();
      expect(utils.getByTestId("content-picker-select")).toHaveAttribute(
        "disabled"
      );
    });
  });
});
