import React from "react";
import { useQuery } from "@apollo/react-hooks";

import { render, screen } from "@testing-library/react";

import PublishHistory from "./GetPublishHistory";

jest.mock("@apollo/react-hooks", () => ({
  ...jest.requireActual("@apollo/react-hooks"),
  useQuery: jest.fn(),
}));

describe("Test empty return", () => {
  useQuery.mockImplementationOnce(() => ({
    loading: false,
    error: false,
    data: undefined,
  }));

  it("Should return no data text", async () => {
    render(<PublishHistory />);
    const text = await screen.findByTestId("no-published-versions-text");
    expect(text.textContent).toBe(
      "No versions of this questionnaire have been published"
    );
  });
});

describe("Loading in call to publish history", () => {
  useQuery.mockImplementationOnce(() => ({
    loading: true,
    error: false,
    data: undefined,
  }));

  it("Should return loading message", async () => {
    const { getByTestId } = render(<PublishHistory />);
    expect(getByTestId("loading")).toBeInTheDocument();
  });
});

describe("Error in call to publish history", () => {
  useQuery.mockImplementationOnce(() => ({
    loading: false,
    error: true,
    data: undefined,
  }));

  it("Should return error message", async () => {
    render(<PublishHistory />);
    const error = await screen.findByTestId("error");
    expect(error.textContent).toBe("Error fetching publishing history");
  });
});

describe("Test valid return", () => {
  useQuery.mockImplementation(() => ({
    loading: false,
    error: false,
    data: {
      publishHistory: [
        {
          id: "cb0bb329-6d54-4779-a9a7-e4a43055cd82",
          surveyId: "134",
          formType: "0005",
          publishDate: "2023-05-18T13:33:16.465Z",
          success: false,
          errorMessage: "Error message",
          displayErrorMessage: "Publish error, please try later",
        },
        {
          id: "459f73a5-5522-454f-8bda-dfa97ad65376",
          surveyId: "134",
          formType: "0005",
          publishDate: "2023-05-19T09:48:37.281Z",
          cirId: "c56afe93-63c6-47d6-8583-edb36596827b",
          version: "1",
          success: true,
        },
        {
          id: "45f8ac6c-1b7f-4e56-8adc-252bf624e4d6",
          surveyId: "134",
          formType: "0005",
          publishDate: "2023-05-22T13:01:19.654Z",
          cirId: "6c63549f-27bb-4ff8-aebe-d386e9046b80",
          version: "1",
          success: true,
        },
        {
          id: "5f4b236c-ef28-4db4-ba50-65c457e540a3",
          surveyId: "134",
          formType: "0005",
          publishDate: "2023-05-17T13:35:07.205Z",
          cirId: "d737af81-b596-430d-92b6-aad12ab4c630",
          version: "1",
          success: true,
        },
      ],
    },
  }));

  it("Should return history table and not no data message", async () => {
    render(<PublishHistory />);
    const table = await screen.findByTestId("history-table");
    expect(table).toBeTruthy();

    const text = screen.queryByTestId("no-published-versions-text");
    expect(text).not.toBeInTheDocument();
  });

  it("Should return history table and have 4 rows", async () => {
    render(<PublishHistory />);
    const trElements = screen.getAllByRole("row");
    expect(trElements).toHaveLength(5);
  });

  it("Should return history table and be in date order, most recent first", async () => {
    render(<PublishHistory />);
    expect(screen.getAllByRole("row")[1]).toHaveTextContent("22/05/2023");
    expect(screen.getAllByRole("row")[2]).toHaveTextContent("19/05/2023");
    expect(screen.getAllByRole("row")[3]).toHaveTextContent("18/05/2023");
    expect(screen.getAllByRole("row")[4]).toHaveTextContent("17/05/2023");
  });

  it("Should return history table with success or failure message", async () => {
    render(<PublishHistory />);
    expect(screen.getAllByRole("row")[1]).toHaveTextContent("Success");
    expect(screen.getAllByRole("row")[2]).toHaveTextContent("Success");
    expect(screen.getAllByRole("row")[3]).toHaveTextContent(
      "Failed: Publish error, please try later"
    );
    expect(screen.getAllByRole("row")[4]).toHaveTextContent("Success");
  });
});
