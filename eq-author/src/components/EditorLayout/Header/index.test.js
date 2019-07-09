import React from "react";
import { Route } from "react-router-dom";

import { render, fireEvent, waitForElementToBeRemoved } from "tests/utils/rtl";
import { signOutUser } from "redux/auth/actions";
import flushPromises from "tests/utils/flushPromises";

import QuestionnaireContext from "components/QuestionnaireContext";
import Header, { CURRENT_USER_QUERY } from "./";

jest.mock("redux/toast/actions");
jest.mock("redux/auth/actions");

describe("Header", () => {
  let user, props, questionnaire, mocks;
  beforeEach(() => {
    questionnaire = {
      id: "456",
      displayName: "Questionnaire of Awesomeness",
      createdBy: {
        id: "1",
        name: "Pinky Malinky",
        email: "pinky@welovestuff.com",
      },
      editors: [
        { id: "2", name: "Babs", email: "b@abs.com", picture: "babs.jpg" },
        { id: "3", name: "Jay", email: "j@ay.com", picture: "jay.jpg" },
      ],
    };

    user = {
      id: "123",
      displayName: "Rick Sanchez",
      picture: "http://img.com/avatar.jpg",
    };
    props = {
      title: "Some title",
      children: "Some content",
      questionnaire,
    };
    mocks = [
      {
        request: {
          query: CURRENT_USER_QUERY,
        },
        result: {
          data: {
            me: {
              ...user,
              __typename: "User",
            },
          },
        },
      },
    ];
  });

  const renderWithContext = (component, ...rest) =>
    render(
      <QuestionnaireContext.Provider value={{ questionnaire }}>
        {component}
      </QuestionnaireContext.Provider>,
      ...rest
    );

  it("should show the currently logged in user", async () => {
    const { queryByText } = renderWithContext(<Header {...props} />, {
      mocks,
    });

    // before user is loaded
    expect(queryByText("Rick Sanchez")).toBeFalsy();
    await flushPromises();
    expect(queryByText("Rick Sanchez")).toBeTruthy();
  });

  it("should be able to log out", async () => {
    const { getByText } = renderWithContext(<Header {...props} />, { mocks });

    // load user
    await flushPromises();

    expect(getByText("Rick Sanchez")).toBeTruthy();

    fireEvent.click(getByText("Rick Sanchez"));

    expect(signOutUser).toHaveBeenCalled();
  });

  it("should show the questionnaire display name", () => {
    const { getByText } = renderWithContext(<Header {...props} />);

    expect(getByText(questionnaire.displayName)).toBeTruthy();
  });

  it("should show a link for previewing", () => {
    const { getByText, getByTestId } = renderWithContext(<Header {...props} />);

    const link = getByTestId("btn-preview");
    expect(link.getAttribute("href")).toMatch(
      new RegExp(`/launch/${questionnaire.id}$`)
    );
    expect(getByText("View survey")).toBeTruthy();
  });

  describe("updating a questionnaire", () => {
    it("can open the questionnaire settings modal", () => {
      const { getByText, queryByText } = renderWithContext(
        <Header {...props} />
      );

      expect(queryByText("Questionnaire settings")).toBeFalsy();
      fireEvent.click(getByText("Settings"));

      expect(getByText("Questionnaire settings")).toBeTruthy();
    });

    it("can close the questionnaire settings modal", async () => {
      const { getByText, queryByText } = renderWithContext(
        <Header {...props} />
      );

      fireEvent.click(getByText("Settings"));
      expect(getByText("Questionnaire settings")).toBeTruthy();

      fireEvent.click(getByText("Cancel"));
      await waitForElementToBeRemoved(() =>
        queryByText("Questionnaire settings")
      );

      expect(queryByText("Questionnaire settings")).toBeFalsy();
    });

    it("should start with the questionnaire settins open when the modifier is provided in the url", () => {
      const { getByText } = renderWithContext(
        <Route path="/page/:modifier">
          <Header {...props} />
        </Route>,
        {
          route: "/page/settings",
        }
      );

      expect(getByText("Questionnaire settings")).toBeTruthy();
    });
  });

  it("should be possible to open and close the sharing modal", async () => {
    const { getByText, queryByText } = renderWithContext(
      <Header {...props} />,
      {
        mocks,
      }
    );

    expect(queryByText("Pinky Malinky")).toBeFalsy();

    fireEvent.click(getByText("Sharing"));
    await flushPromises();

    expect(getByText("Pinky Malinky")).toBeTruthy();

    const doneButton = getByText("Done");
    fireEvent.click(doneButton);

    expect(queryByText("Pinky Malinky")).toBeFalsy();
  });
});
