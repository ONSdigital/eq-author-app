import React from "react";
import { Route } from "react-router-dom";

import { render, fireEvent, waitForElementToBeRemoved } from "tests/utils/rtl";

import QuestionnaireContext from "components/QuestionnaireContext";
import { MeContext } from "App/MeContext";
import Header from "./";

describe("Header", () => {
  let user, props, questionnaire, signOut;
  beforeEach(() => {
    questionnaire = {
      id: "456",
      displayName: "Questionnaire of Awesomeness",
      totalErrorCount: 0,
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
      email: "wubbalubba@dubdub.com",
      picture: "http://img.com/avatar.jpg",
      admin: true,
    };
    props = {
      title: "Some title",
      children: "Some content",
    };

    signOut = jest.fn();
  });

  const renderWithContext = (component, ...rest) =>
    render(
      <MeContext.Provider value={{ me: user, signOut }}>
        <QuestionnaireContext.Provider value={{ questionnaire }}>
          {component}
        </QuestionnaireContext.Provider>
      </MeContext.Provider>,
      ...rest
    );

  it("should show the currently logged in user", () => {
    const { queryByText } = renderWithContext(<Header {...props} />);

    expect(queryByText("Rick Sanchez")).toBeTruthy();
  });

  it("should be able to log out", () => {
    const { getByText } = renderWithContext(<Header {...props} />);

    expect(getByText("Rick Sanchez")).toBeTruthy();

    fireEvent.click(getByText("Rick Sanchez"));

    expect(signOut).toHaveBeenCalled();
  });

  it("should show the questionnaire display name", () => {
    const { getByText } = renderWithContext(<Header {...props} />);

    expect(getByText(questionnaire.displayName)).toBeTruthy();
  });

  describe("view survey button", () => {
    it("should show a button for previewing questionnaire", () => {
      const { getByText, getByTestId } = renderWithContext(
        <Header {...props} />
      );

      const viewSurveyButton = getByTestId("btn-preview");
      expect(viewSurveyButton.getAttribute("href")).toMatch(
        new RegExp(`/launch/${questionnaire.id}$`)
      );
      expect(getByText("View survey")).toBeTruthy();
    });

    it("should disable the view survey button when questionnaire is invalid", () => {
      questionnaire.totalErrorCount = 1;
      const { getByTestId } = renderWithContext(<Header {...props} />);

      const viewSurveyButton = getByTestId("btn-preview");
      expect(viewSurveyButton).toHaveAttribute("disabled");
    });

    it("should not disable the view survey button when questionnaire is valid", () => {
      const { getByTestId } = renderWithContext(<Header {...props} />);

      const viewSurveyButton = getByTestId("btn-preview");
      expect(viewSurveyButton).not.toHaveAttribute("disabled");
    });
  });

  describe("publish survey button", () => {
    it("should disable the publish survey button when questionnaire is invalid", () => {
      questionnaire.totalErrorCount = 1;
      const { getByTestId } = renderWithContext(<Header {...props} />);

      const publishSurveyButton = getByTestId("btn-publish");
      expect(publishSurveyButton).toHaveAttribute("disabled");
    });

    it("should not disable the publish survey button when questionnaire is valid", () => {
      const { getByText } = renderWithContext(<Header {...props} />);

      const publishSurveyButton = getByText("Publish");
      expect(publishSurveyButton).not.toHaveAttribute("disabled");
    });
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

    it("should start with the questionnaire settings open when the modifier is provided in the url", () => {
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

  it("should be possible to open and close the sharing modal", () => {
    const { getByText, queryByText } = renderWithContext(<Header {...props} />);

    expect(queryByText("Pinky Malinky")).toBeFalsy();

    fireEvent.click(getByText("Sharing"));

    expect(getByText("Pinky Malinky")).toBeTruthy();

    const doneButton = getByText("Done");
    fireEvent.click(doneButton);

    expect(queryByText("Pinky Malinky")).toBeFalsy();
  });

  it("should be possible to open and close the publish modal", async () => {
    const { getByText, queryByText } = renderWithContext(<Header {...props} />);

    expect(queryByText("Publish questionnaire")).toBeFalsy();

    fireEvent.click(getByText("Publish"));

    expect(queryByText("Publish questionnaire")).toBeTruthy();

    const cancelButton = getByText("Cancel");
    fireEvent.click(cancelButton);
    await waitForElementToBeRemoved(() => queryByText("Publish questionnaire"));

    expect(queryByText("Publish questionnaire")).toBeFalsy();
  });
});
