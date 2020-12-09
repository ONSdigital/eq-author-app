import React from "react";
import { render, fireEvent } from "tests/utils/rtl";
import { UnwrappedRoutingDestinationContentPicker } from "./RoutingDestinationContentPicker";

describe("RoutingDestinationContentPicker", () => {
  let props;
  beforeEach(() => {
    props = {
      data: {
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
                folders: [
                  {
                    id: "folder-1",
                    pages: [
                      {
                        id: "0f6cfdcf-7876-41f6-80e9-143fb6b85e69",
                        displayName: "s2q1",
                        __typename: "QuestionPage",
                      },
                    ],
                    __typename: "Folder",
                  },
                ],
                __typename: "Section",
              },
              {
                id: "d3ea428b-a30e-497f-aff3-6895560a1282",
                displayName: "section3",
                folders: [
                  {
                    id: "folder-2",
                    pages: [
                      {
                        id: "d3ea428b-a30e-497f-aff3-6895560a1282",
                        displayName: "s3q1",
                        __typename: "QuestionPage",
                      },
                    ],
                    __typename: "Folder",
                  },
                ],
                __typename: "Section",
              },
            ],
            __typename: "AvailableRoutingDestinations",
          },
        },
      },
      onSubmit: jest.fn(),
      selected: {
        logical: "NextPage",
      },
      loading: false,
    };
  });

  it("should render", () => {
    const { getByText, getByTestId } = render(
      <UnwrappedRoutingDestinationContentPicker {...props} />
    );
    const openButton = getByTestId("content-picker-select");
    fireEvent.click(openButton);
    getByText("Select a question");
  });

  it("should fire onSubmit with destination when confirming", () => {
    const { getByText, getByTestId } = render(
      <UnwrappedRoutingDestinationContentPicker {...props} />
    );
    const openButton = getByTestId("content-picker-select");
    fireEvent.click(openButton);
    const questionButton = getByText("s1q4");
    fireEvent.click(questionButton);
    const submitButton = getByText("Confirm");
    fireEvent.click(submitButton);
    expect(props.onSubmit).toHaveBeenCalledWith({
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
      props.selected = {
        page: {
          id: "1",
          displayName: "page name",
        },
      };
      const { getByText } = render(
        <UnwrappedRoutingDestinationContentPicker {...props} />
      );
      getByText("page name");
    });

    it("should correctly render section display name", () => {
      props.selected = {
        section: {
          id: "1",
          displayName: "section name",
        },
      };

      const { getByText } = render(
        <UnwrappedRoutingDestinationContentPicker {...props} />
      );
      getByText("section name");
    });

    it("should correctly render logicalDestination EndOfQuestionnaire", () => {
      props.selected = {
        logical: "EndOfQuestionnaire",
      };
      const { getByText } = render(
        <UnwrappedRoutingDestinationContentPicker {...props} />
      );
      getByText("End of questionnaire");
    });

    it("should correctly render logicalDestination NextPage", () => {
      props.selected = {
        logical: "NextPage",
      };
      const { getByText } = render(
        <UnwrappedRoutingDestinationContentPicker {...props} />
      );
      getByText("Next page");
    });

    it("should correctly render logicalDestination Default", () => {
      props.selected = {
        logical: "Default",
      };
      const { getByText } = render(
        <UnwrappedRoutingDestinationContentPicker {...props} />
      );
      getByText("Select a destination");
    });

    it("should render with no display name if loading and next page selected", () => {
      props.loading = true;
      const { getByTestId } = render(
        <UnwrappedRoutingDestinationContentPicker {...props} />
      );
      const button = getByTestId("content-picker-select");
      expect(button).toHaveAttribute("disabled");
    });
  });

  describe("displaying destinations", () => {
    let openButton, destinationPicker;
    beforeEach(() => {
      destinationPicker = render(
        <UnwrappedRoutingDestinationContentPicker {...props} />
      );
      openButton = destinationPicker.getByTestId("content-picker-select");
    });

    it("should only display questions after the current question in the section", () => {
      const openButton = destinationPicker.getByTestId("content-picker-select");
      fireEvent.click(openButton);
      expect(destinationPicker.queryByText("s1q1")).toBeFalsy();

      destinationPicker.getAllByText("s1q3");
      destinationPicker.getAllByText("s1q4");
    });

    it("should only display first question in other sections", () => {
      const { getAllByText, queryByText, getByText } = destinationPicker;
      fireEvent.click(openButton);

      const section2Button = getByText("section2");
      fireEvent.click(section2Button);
      getAllByText("s2q1");
      expect(queryByText("s2q2")).toBeFalsy();

      const section3Button = getByText("section3");
      fireEvent.click(section3Button);
      getAllByText("s3q1");
      expect(queryByText("s3q2")).toBeFalsy();
    });

    it("should not display any questions from same section when on last question", () => {
      props.data.page.availableRoutingDestinations.pages = [];
      const { getAllByText, queryByText } = destinationPicker;
      fireEvent.click(openButton);

      expect(queryByText(/s1/)).toBeFalsy();
      getAllByText("s2q1");
    });

    it("should not display items outside of the current section within the content picker for an else destination", () => {
      const { unmount } = destinationPicker;
      unmount();
      props.id = "else";
      const { queryByText } = render(
        <UnwrappedRoutingDestinationContentPicker {...props} />
      );
      const newOpenButton = destinationPicker.getByTestId(
        "content-picker-select"
      );
      fireEvent.click(newOpenButton);

      expect(queryByText(/section1/)).toBeTruthy();
      expect(queryByText(/section2/)).toBeFalsy();
      expect(queryByText(/section3/)).toBeFalsy();
    });
  });
});
