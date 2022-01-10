import React from "react";
import { MockedProvider } from "@apollo/react-testing";
import { render, screen, waitFor } from "tests/utils/rtl";
import SkipLogicRoute from ".";
import SKIPLOGIC_QUERY from "./fragment.graphql";

import suppressConsoleMessage from "tests/utils/supressConsol";

/*
 * @description Suppresses specific messages from being logged in the Console.
 */
suppressConsoleMessage("You are using the simple", "error");
suppressConsoleMessage("heuristic fragment matching going on", "error");

// eslint-disable-next-line no-console
console.log(
  `Warn: there are manually suppressed warnings or errors in this test file due to dependencies needing updates - See EAR-1095`
);

jest.mock("./SkipLogicPage", () => () => <h1> Mock skip logic page </h1>);
jest.mock("App/shared/Logic", () => ({ children }) => <> {children} </>); // eslint-disable-line react/prop-types

const defaultMatch = {
  params: {
    questionnaireId: "1",
    sectionId: "2",
    pageId: "3",
  },
};

const renderWithMocks = (match, data = null) => {
  const mocks = [
    {
      request: {
        query: SKIPLOGIC_QUERY,
        variables: {
          input: {
            id: match.params.confirmationId || match.params.pageId,
          },
        },
      },
      result: {
        data: {
          skippable: data,
        },
      },
    },
  ];

  return render(
    <MockedProvider mocks={mocks}>
      <SkipLogicRoute match={match} />
    </MockedProvider>
  );
};

describe("Routes/SkipLogic", () => {
  it("should show loading message while graphql request in flight", () => {
    renderWithMocks(defaultMatch);
    expect(screen.getByTestId("loading")).toBeTruthy();
  });

  it("should show error message if page not found", async () => {
    renderWithMocks(defaultMatch);
    await waitFor(() =>
      expect(screen.getByText("Something went wrong")).toBeTruthy()
    );
  });

  it("should show SkipLogicPage for page if retrieved successfully", async () => {
    renderWithMocks(defaultMatch, {
      __typename: "QuestionPage",
      displayName: "Profound questions",
      pageType: "QuestionPage",
      id: "3",
      position: 0,
      skipConditions: null,
      section: {
        __typename: "Section",
        id: "section-1",
        position: 0,
      },
      folder: {
        __typename: "Folder",
        id: "folder-1",
        position: 0,
      },
      validationErrorInfo: {
        __typename: "ValidationErrorInfo",
        id: "valid-1",
        errors: [],
        totalCount: 0,
      },
    });
    await waitFor(() =>
      expect(screen.getByText("Mock skip logic page")).toBeTruthy()
    );
  });
});
