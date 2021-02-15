import React from "react";
import { render, fireEvent } from "tests/utils/rtl";
import { RoutingDestinationContentPicker as DestinationContentPicker } from "./RoutingDestinationContentPicker";
import { useQuery } from "@apollo/react-hooks";

const props = {
  selected: { logical: "NextPage" },
};

const queryResult = {
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

jest.mock("@apollo/react-hooks", () => ({
  __esModule: true,
  useQuery: jest.fn(),
}));

useQuery.mockImplementation(() => ({
  data: queryResult.data(),
  loading: queryResult.loading,
}));

function setup({ selected, ...extra }) {
  const onSubmit = jest.fn();

  const utils = render(
    <DestinationContentPicker
      pageId={"2"}
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
    clickByText("s1q4");
    clickSubmit();
    expect(onSubmit).toHaveBeenCalledWith({
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

  it("should render with no display name if loading and next page selected", () => {
    useQuery.mockImplementationOnce(() => ({
      data: queryResult.data(),
      loading: !queryResult.loading,
    }));

    const { getByTestId } = defaultSetup();

    expect(getByTestId("content-picker-select")).toHaveAttribute("disabled");
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
