import React from "react";
import { MockedProvider } from "@apollo/react-testing";
import { render, screen } from "tests/utils/rtl";
import SkipLogicRoute from ".";
import query from "./query";

jest.mock("./SkipLogicPage", () => () => <h1> Mock skip logic page </h1>);
jest.mock("App/shared/Logic", () => ({ children }) => <> {children} </>); // eslint-disable-line react/prop-types

jest.mock("./query", () => {
  const gql = jest.requireActual("graphql-tag");

  return gql`
    query GetSkipLogic($input: QueryInput!) {
      page(input: $input) {
        id
      }
    }
  `;
});

const defaultMatch = {
  params: {
    questionnaireId: "1",
    sectionId: "2",
    pageId: "3",
  },
};

const renderWithMocks = (match, result) => {
  const mocks = [
    {
      request: {
        query,
        variables: {
          input: match.params,
        },
      },
      result,
    },
  ];

  return render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <SkipLogicRoute match={match} />
    </MockedProvider>
  );
};

describe("Routes/SkipLogic", () => {
  it("should show loading message while graphql request in flight", () => {
    renderWithMocks(defaultMatch, null);
    expect(screen.getByTestId("loading")).toBeTruthy();
  });

  it("should show error message if page not found", async () => {
    renderWithMocks(defaultMatch, null);
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(screen.getByText("Something went wrong")).toBeTruthy();
  });

  it("should show SkipLogicPage for page if retrieved successfully", async () => {
    renderWithMocks(defaultMatch, {
      data: {
        page: {
          id: "3",
        },
      },
    });
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(screen.getByText("Mock skip logic page")).toBeTruthy();
  });
});
