import React from "react";
import { omit } from "lodash";
import { Route } from "react-router-dom";

import {
  render,
  fireEvent,
  waitForElement,
  waitForElementToBeRemoved,
} from "tests/utils/rtl";
import flushPromises from "tests/utils/flushPromises";

import { raiseToast } from "redux/toast/actions";
import { signOutUser } from "redux/auth/actions";

import { WRITE } from "constants/questionnaire-permissions";

import { CURRENT_USER_QUERY } from "components/UserProfile";
import QuestionnaireContext from "components/QuestionnaireContext";

import Header from "./";
import { ADD_REMOVE_EDITOR_MUTATION } from "./SharingModal/withAddRemoveEditor";
import { ALL_USERS_QUERY } from "./SharingModal";

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
        picture: "pinky.jpg",
      },
      editors: [
        { id: "2", name: "Babs", email: "b@abs.com", picture: "babs.jpg" },
        { id: "3", name: "Jay", email: "j@ay.com", picture: "jay.jpg" },
      ],
      permission: WRITE,
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
    expect(queryByText(user.displayName)).toBeFalsy();
    await flushPromises();
    expect(queryByText(user.displayName)).toBeTruthy();
  });

  it("should be able to log out", async () => {
    const { getByText } = renderWithContext(<Header {...props} />, { mocks });

    // load user
    await flushPromises();

    expect(getByText(user.displayName)).toBeTruthy();

    fireEvent.click(getByText(user.displayName));

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

  describe("sharing", () => {
    it("should list the owner and editors", () => {
      const { getByText } = renderWithContext(<Header {...props} />);

      fireEvent.click(getByText("Sharing"));

      expect(getByText("Pinky Malinky")).toBeTruthy();
      expect(getByText("Babs")).toBeTruthy();
      expect(getByText("Jay")).toBeTruthy();
    });

    it("should be possible to close the modal", async () => {
      const { getByText, queryByText } = renderWithContext(
        <Header {...props} />
      );

      expect(queryByText("Pinky Malinky")).toBeFalsy();

      fireEvent.click(getByText("Sharing"));

      expect(getByText("Pinky Malinky")).toBeTruthy();

      const doneButton = getByText("Done");
      fireEvent.click(doneButton);

      expect(queryByText("Pinky Malinky")).toBeFalsy();
    });

    it("should provide a button to copy the launch url", () => {
      const originalExecCommand = document.execCommand;
      let selectedText = "no text selected";
      document.execCommand = command => {
        if (command === "copy") {
          // jsdom has not implemented textselection so we we have do the next best thing
          selectedText = document.querySelector("[data-test='share-link']")
            .innerText;
        }
      };
      const { getByText } = renderWithContext(<Header {...props} />);

      fireEvent.click(getByText("Sharing"));

      const linkButton = getByText("Get shareable link");
      fireEvent.click(linkButton);

      expect(selectedText).toMatch(new RegExp(`/launch/${questionnaire.id}$`));

      expect(raiseToast).toHaveBeenCalledWith(
        expect.any(String),
        "Link copied to clipboard"
      );

      document.execCommand = originalExecCommand;
    });

    describe("removing editors", () => {
      it("should be possible to remove editors", async () => {
        mocks = [
          ...mocks,
          {
            request: {
              query: ADD_REMOVE_EDITOR_MUTATION,
              variables: {
                input: {
                  id: "456",
                  editors: questionnaire.editors
                    .filter(e => e.name !== "Babs")
                    .map(e => e.id),
                },
              },
            },
            result: {
              data: {
                updateQuestionnaire: {
                  id: questionnaire.id,
                  editors: questionnaire.editors
                    .filter(e => e.name !== "Babs")
                    .map(e => ({ ...e, __typename: "User" })),
                  permission: WRITE,
                  __typename: "Questionnaire",
                },
              },
            },
          },
        ];
        const {
          getByText,
          queryByText,
          getAllByLabelText,
          rerender,
        } = renderWithContext(<Header {...props} />, { mocks });

        fireEvent.click(getByText("Sharing"));

        const row = getByText("Babs").parentElement;
        const removeButton = getAllByLabelText("Remove editor").find(
          btn => btn.parentElement === row
        );

        fireEvent.click(removeButton);

        // Run query and re-render with updated result
        await flushPromises();
        const updatedQuestionnaire = {
          ...questionnaire,
          editors: questionnaire.editors.filter(e => e.name !== "Babs"),
        };
        rerender(
          <QuestionnaireContext.Provider
            value={{ questionnaire: updatedQuestionnaire }}
          >
            <Header {...props} />
          </QuestionnaireContext.Provider>
        );

        expect(queryByText("Babs")).toBeFalsy();
      });
    });

    describe("adding an editor", () => {
      let PETER_PARKER;
      beforeEach(() => {
        PETER_PARKER = {
          id: "11",
          name: "Peter Parker",
          email: "p@spidermanfanclub.com",
          picture: "tarantula.jpg",
        };
        mocks = [
          ...mocks,
          {
            request: {
              query: ALL_USERS_QUERY,
            },
            result: {
              data: {
                users: [
                  {
                    id: "10",
                    name: null,
                    email: "clark@totallynotsuperman.com",
                  },
                  PETER_PARKER,
                  questionnaire.createdBy,
                  ...questionnaire.editors,
                ].map(u => ({
                  ...omit(u, "picture"),
                  __typename: "User",
                })),
              },
            },
          },
          {
            request: {
              query: ADD_REMOVE_EDITOR_MUTATION,
              variables: {
                input: {
                  id: questionnaire.id,
                  editors: [...questionnaire.editors, PETER_PARKER].map(
                    e => e.id
                  ),
                },
              },
            },
            result: {
              data: {
                updateQuestionnaire: {
                  id: questionnaire.id,
                  editors: [...questionnaire.editors, PETER_PARKER].map(e => ({
                    ...e,
                    __typename: "User",
                  })),
                  permission: WRITE,
                  __typename: "Questionnaire",
                },
              },
            },
          },
        ];
      });

      it("should be possible to search for a user by name and add them as an editor", async () => {
        const {
          getByText,
          getAllByLabelText,
          queryByText,
          queryByLabelText,
          rerender,
        } = renderWithContext(<Header {...props} />, { mocks });
        fireEvent.click(getByText("Sharing"));

        // load the users
        await flushPromises();
        waitForElement(() => queryByLabelText("Add editors"));

        expect(queryByText("Peter Parker")).toBeFalsy();

        // downshift labels everything including the div
        const input = getAllByLabelText("Add editors")[0];
        fireEvent.change(input, { target: { value: "peTeR" } });

        const userResult = getByText(`<${PETER_PARKER.email}>`);
        fireEvent.click(userResult);

        await flushPromises();
        const updatedQuestionnaire = {
          ...questionnaire,
          editors: [...questionnaire.editors, PETER_PARKER],
        };
        rerender(
          <QuestionnaireContext.Provider
            value={{ questionnaire: updatedQuestionnaire }}
          >
            <Header {...props} />
          </QuestionnaireContext.Provider>
        );
        expect(queryByText("Peter Parker")).toBeTruthy();
      });

      it("should be possible to search for users by email", async () => {
        const {
          getByText,
          getAllByLabelText,
          queryByText,
          queryByLabelText,
        } = renderWithContext(<Header {...props} />, { mocks });
        fireEvent.click(getByText("Sharing"));

        // load the users
        await flushPromises();
        waitForElement(() => queryByLabelText("Add editors"));

        expect(queryByText("Peter Parker")).toBeFalsy();

        const input = getAllByLabelText("Add editors")[0];
        fireEvent.change(input, { target: { value: "SPiDeRMan" } });

        expect(queryByText("Peter Parker")).toBeTruthy();
      });

      it("removing your search should return no one", async () => {
        const {
          getByText,
          getAllByLabelText,
          queryByText,
          queryByLabelText,
        } = renderWithContext(<Header {...props} />, { mocks });
        fireEvent.click(getByText("Sharing"));

        // load the users
        await flushPromises();
        waitForElement(() => queryByLabelText("Add editors"));

        expect(queryByText("Peter Parker")).toBeFalsy();

        const input = getAllByLabelText("Add editors")[0];
        fireEvent.change(input, { target: { value: "Spiderman" } });
        fireEvent.change(input, { target: { value: "" } });

        expect(queryByText("Peter Parker")).toBeFalsy();
      });

      it("should not be possible to add existing editors", async () => {
        const {
          getByText,
          queryByLabelText,
          getAllByLabelText,
          queryByText,
        } = renderWithContext(<Header {...props} />, {
          mocks,
        });
        fireEvent.click(getByText("Sharing"));

        // load the users
        await flushPromises();
        waitForElement(() => queryByLabelText("Add editors"));

        const input = getAllByLabelText("Add editors")[0];
        fireEvent.change(input, { target: { value: "babs" } });
        expect(queryByText("<b@abs.com>")).toBeFalsy();
      });

      it("should not be possible to add the owner", async () => {
        const {
          getByText,
          queryByLabelText,
          getAllByLabelText,
          queryByText,
        } = renderWithContext(<Header {...props} />, {
          mocks,
        });
        fireEvent.click(getByText("Sharing"));

        // load the users
        await flushPromises();
        waitForElement(() => queryByLabelText("Add editors"));

        const input = getAllByLabelText("Add editors")[0];
        fireEvent.change(input, { target: { value: "malinky" } });
        expect(queryByText("<pinky@welovestuff.com>")).toBeFalsy();
      });
    });
  });
});
