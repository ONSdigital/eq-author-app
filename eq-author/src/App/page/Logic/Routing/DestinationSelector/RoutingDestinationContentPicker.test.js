import React from "react";
import { render, fireEvent } from "tests/utils/rtl";
import { UnwrappedRoutingDestinationContentPicker as DestinationContentPicker } from "./RoutingDestinationContentPicker";

/*
TODO:
[ ] - Try and tidy these tests up
[ ] - Fix all false positives
[ ] - DRY
[ ] - AHA
[ ] - Try and eliminate beforeEach
[ ] - Avoid reassignment
[ ] - Stop the component rendering multiple times


*/

/*

test requirements
- 5 tests modifying selected

*/

const selected = { logical: "NextPage" };
const loading = false;
const data = {
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
};

function setup({ selected, loading, data }) {
  // any mocks go here
  const onSubmit = jest.fn();
  // component
  const utils = render(
    <DestinationContentPicker
      data={data}
      loading={loading}
      selected={selected}
      onSubmit={onSubmit}
    />
  );
  // functions
  const clickOpen = () =>
    fireEvent.click(utils.getByTestId("content-picker-select"));
  const clickByText = text => fireEvent.click(utils.getByText(text));
  const clickSubmit = () => fireEvent.click(utils.getByText("Confirm"));

  return {
    ...utils,
    onSubmit,
    selected,
    loading,
    data,
    clickOpen,
    clickByText,
    clickSubmit,
  };
}

function defaultSetup() {
  const utils = setup({ selected, loading, data });
  return { ...utils };
}

function selectedSetup(select) {
  const utils = setup({ selected: select, loading, data });
  return { ...utils };
}

describe("RoutingDestinationContentPicker", () => {
  it("should render", () => {
    const utils = defaultSetup();
    utils.clickOpen();
    expect(utils.getByText("Select a question")).toBeVisible();
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
      const utils = selectedSetup({
        page: { id: "1", displayName: "page name" },
      });
      expect(utils.getByText("page name")).toBeVisible();
    });

    it("should correctly render section display name", () => {
      const utils = selectedSetup({
        section: { id: "1", displayName: "section name" },
      });
      expect(utils.getByText("section name")).toBeVisible();
    });

    it("should correctly render logicalDestination EndOfQuestionnaire", () => {
      const utils = selectedSetup({
        logical: "EndOfQuestionnaire",
      });

      expect(utils.getByText("End of questionnaire")).toBeVisible();
    });

    it("should correctly render logicalDestination NextPage", () => {
      const utils = selectedSetup({
        logical: "NextPage",
      });

      expect(utils.getByText("Next page")).toBeVisible();
    });

    it("should correctly render logicalDestination Default", () => {
      const utils = selectedSetup({
        logical: "Default",
      });

      expect(utils.getByText("Select a destination")).toBeVisible();
    });

    //   it("should render with no display name if loading and next page selected", () => {
    //     props.loading = true;
    //     const { getByTestId } = render(
    //       <UnwrappedRoutingDestinationContentPicker {...props} />
    //     );
    //     const button = getByTestId("content-picker-select");
    //     expect(button).toHaveAttribute("disabled");
    //   });
  });

  describe("displaying destinations", () => {
    it("should only display questions after the current question in the section", () => {
      const utils = defaultSetup();
      utils.clickOpen();
      expect(utils.queryByText("s1q1")).toBeFalsy();

      expect(utils.getByText("s1q3")).toBeVisible();
      expect(utils.getByText("s1q4")).toBeVisible();
    });

    it("should only display first question in other sections", () => {
      const utils = defaultSetup();
      utils.clickOpen();

      utils.clickByText("section2");
      expect(utils.getByText("s2q1")).toBeVisible();
      expect(utils.queryByText("s2q2")).toBeFalsy();

      utils.clickByText("section3");
      expect(utils.getByText("s3q1")).toBeVisible();
      expect(utils.queryByText("s3q2")).toBeFalsy();
    });

    it("should not display any questions from same section when on last question", () => {
      props.data.page.availableRoutingDestinations.pages = [];
      const { getAllByText, queryByText, getByTestId } = render(
        <UnwrappedRoutingDestinationContentPicker {...props} />
      );
      const openButton = getByTestId("content-picker-select");
      fireEvent.click(openButton);

      expect(queryByText(/s1/)).toBeFalsy();
      getAllByText("s2q1");
    });
  });

  // describe("displaying destinations", () => {

  // it("should not display any questions from same section when on last question", () => {
  //   props.data.page.availableRoutingDestinations.pages = [];
  //   const { getAllByText, queryByText, getByTestId } = render(
  //     <UnwrappedRoutingDestinationContentPicker {...props} />
  //   );
  //   const openButton = getByTestId("content-picker-select");
  //   fireEvent.click(openButton);

  //   expect(queryByText(/s1/)).toBeFalsy();
  //   getAllByText("s2q1");
  // });

  //   it("should not display items outside of the current section within the content picker for an else destination", () => {
  //     props.id = "else";
  //     const { queryByText, getByTestId, debug } = render(
  //       <UnwrappedRoutingDestinationContentPicker {...props} />
  //     );
  //     debug();
  //     const openButton = getByTestId("content-picker-select");
  //     fireEvent.click(openButton);

  //     expect(queryByText(/section1/)).toBeTruthy();
  //     expect(queryByText(/section2/)).toBeFalsy();
  //     expect(queryByText(/section3/)).toBeFalsy();
  //   });
  // });
});
