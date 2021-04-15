import React from "react";

import { render, flushPromises, act } from "tests/utils/rtl";
import { WRITE } from "constants/questionnaire-permissions";
import { MeContext } from "App/MeContext";

import QuestionnairesPage, { QUESTIONNAIRES_QUERY } from "./";

import { UNPUBLISHED } from "constants/publishStatus";

jest.mock("hooks/useLockStatusSubscription", () => ({
  __esModule: true,
  default: () => null,
}));

describe("QuestionnairesPage", () => {
  let me, signOut;

  beforeEach(() => {
    me = {
      id: "123",
      name: "Dave the Rave",
      email: "Dave@dj.com",
    };
    signOut = jest.fn();
  });

  afterEach(async () => {
    // clear all running queries
    await act(async () => {
      await flushPromises();
    });
  });

  const renderQuestionnairesPage = (mocks = {}) =>
    render(
      <MeContext.Provider value={{ me, signOut }}>
        <QuestionnairesPage />
      </MeContext.Provider>,
      mocks
    );

  it("should not render table whilst data is loading", async () => {
    const { getByTestId } = renderQuestionnairesPage();
    expect(getByTestId("loading")).toBeTruthy();
    await act(async () => {
      await flushPromises();
    });
  });

  it("should render error message when there is an error", async () => {
    const { getByText } = renderQuestionnairesPage({
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
    await act(async () => {
      await flushPromises();
    });
    expect(getByText(/oops/i)).toBeTruthy();
  });

  it("should render the title", async () => {
    const { getAllByText } = renderQuestionnairesPage();
    await act(async () => {
      await flushPromises();
    });
    const title = getAllByText(/Questionnaires/i);
    expect(title[0]).toBeTruthy();
    expect(document.title).toMatch(/questionnaires/i);
  });

  it("should render the the questionnaires", async () => {
    const { getByText } = renderQuestionnairesPage({
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
                  starred: false,
                  updatedAt: Date.now().toString(),
                  createdAt: Date.now().toString(),
                  displayName: "UKIS",
                  permission: WRITE,
                  publishStatus: UNPUBLISHED,
                  createdBy: {
                    id: "1",
                    name: "A Dude",
                    email: "a.dude@gmail.com",
                    displayName: "A Dude",
                    __typename: "User",
                  },
                  locked: false,
                  __typename: "Questionnaire",
                },
              ],
            },
          },
        },
      ],
    });

    await act(async () => {
      await flushPromises();
    });

    expect(getByText("UKIS")).toBeTruthy();
  });
});
