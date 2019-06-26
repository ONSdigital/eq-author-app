import React from "react";

import { render, flushPromises } from "tests/utils/rtl";
import { WRITE } from "constants/questionnaire-permissions";

import QuestionnairesPage, { QUESTIONNAIRES_QUERY } from "./";

describe("QuestionnairesPage", () => {
  afterEach(async () => {
    // clear all running queries
    await flushPromises();
  });

  it("should not render table whilst data is loading", () => {
    const { getByTestId } = render(<QuestionnairesPage />);
    expect(getByTestId("loading")).toBeTruthy();
  });

  it("should render error message when there is an error", async () => {
    const { getByText } = render(<QuestionnairesPage />, {
      mocks: [
        {
          request: {
            query: QUESTIONNAIRES_QUERY,
          },
          result: {
            error: {
              message: "Something went wrong",
            },
          },
        },
      ],
    });
    await flushPromises();
    expect(getByText(/oops/i)).toBeTruthy();
  });

  it("should render the title", async () => {
    const { getByText } = render(<QuestionnairesPage />);
    expect(getByText(/your questionnaires/i)).toBeTruthy();
    expect(document.title).toMatch(/your questionnaires/i);
  });

  it("should render the the questionnaires", async () => {
    const { getByText } = render(<QuestionnairesPage />, {
      mocks: [
        {
          request: {
            query: QUESTIONNAIRES_QUERY,
          },
          result: {
            data: {
              questionnaires: [
                {
                  id: "123",
                  title: "UKIS",
                  shortTitle: null,
                  updatedAt: Date.now().toString(),
                  createdAt: Date.now().toString(),
                  displayName: "UKIS",
                  permission: WRITE,
                  createdBy: {
                    id: "1",
                    name: "A Dude",
                    email: "a.dude@gmail.com",
                    displayName: "A Dude",
                    __typename: "User",
                  },
                  __typename: "Questionnaire",
                },
              ],
            },
          },
        },
      ],
    });

    await flushPromises();

    expect(getByText("UKIS")).toBeTruthy();
  });
});
