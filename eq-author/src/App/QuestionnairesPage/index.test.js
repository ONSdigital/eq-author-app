import React from "react";

import { render, flushPromises } from "tests/utils/rtl";
import { WRITE } from "constants/questionnaire-permissions";
import { MeContext } from "App/MeContext";

import QuestionnairesPage, { QUESTIONNAIRES_QUERY } from "./";

describe("QuestionnairesPage", () => {
  let me, signOut;

  // this is just a little hack to silence a warning that we'll get until we
  // upgrade to 16.9: https://github.com/facebook/react/pull/14853
  // https://github.com/testing-library/react-testing-library#suppressing-unnecessary-warnings-on-react-dom-168
  /* eslint-disable no-console, import/unambiguous */
  const originalError = console.error;
  beforeAll(() => {
    console.error = (...args) => {
      if (/Warning.*not wrapped in act/.test(args[0])) {
        return;
      }
      originalError.call(console, ...args);
    };
  });

  afterAll(() => {
    console.error = originalError;
  });
  // End hack to silence warning

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
    await flushPromises();
  });

  const renderQuestionnairesPage = (mocks = {}) =>
    render(
      <MeContext.Provider value={{ me, signOut }}>
        <QuestionnairesPage />
      </MeContext.Provider>,
      mocks
    );

  it("should not render table whilst data is loading", () => {
    const { getByTestId } = renderQuestionnairesPage();
    expect(getByTestId("loading")).toBeTruthy();
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
    await flushPromises();
    expect(getByText(/oops/i)).toBeTruthy();
  });

  it("should render the title", async () => {
    const { getByText } = renderQuestionnairesPage();
    expect(getByText(/your questionnaires/i)).toBeTruthy();
    expect(document.title).toMatch(/your questionnaires/i);
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
                  updatedAt: Date.now().toString(),
                  createdAt: Date.now().toString(),
                  displayName: "UKIS",
                  permission: WRITE,
                  publishStatus: "Unpublished",
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
