import React from "react";
import { omit } from "lodash";
import { render, fireEvent } from "tests/utils/rtl";
import flushPromises from "tests/utils/flushPromises";

import SharingModal, { ALL_USERS_QUERY } from "./";
import { ADD_REMOVE_EDITOR_MUTATION } from "./withAddRemoveEditor";
import { WRITE } from "constants/questionnaire-permissions";

describe("Sharing Modal", () => {
  let props;
  const BETH_SMITH = {
    id: "11",
    name: "Beth Smith",
    email: "beth@smith.com",
  };

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
    props = {
      isOpen: true,
      loading: false,
      data: {
        users: [
          BETH_SMITH,
          { id: "2", name: "Babs", email: "b@abs.com", picture: "babs.jpg" },
        ],
      },
      onClose: jest.fn(),
      addEditor: jest.fn(),
      removeEditor: jest.fn(() => Promise.resolve()),
      togglePublic: jest.fn(),
      questionnaire: {
        id: "456",
        displayName: "Questionnaire of Awesomeness",
        createdBy: {
          id: "1",
          name: "Jerry Smith",
          email: "jerry@smith.com",
          picture: "jerry.jpg",
        },
        editors: [
          { id: "2", name: "Babs", email: "b@abs.com", picture: "babs.jpg" },
          { id: "3", name: "Jay", email: "j@ay.com", picture: "jay.jpg" },
        ],
      },
      previewUrl: `/launch/456`,
      currentUser: { id: "1" },
      history: { push: jest.fn() },
    };
  });
  afterEach(async () => {
    await flushPromises();
  });

  it("should list the owner and editors", async () => {
    const { getByText } = render(<SharingModal {...props} />);

    expect(getByText("Jerry Smith")).toBeTruthy();
    expect(getByText("Babs")).toBeTruthy();
    expect(getByText("Jay")).toBeTruthy();
  });

  it("should provide a button to copy the launch url", async () => {
    const originalExecCommand = document.execCommand;
    let selectedText = "no text selected";
    document.execCommand = command => {
      if (command === "copy") {
        // jsdom has not implemented textselection so we we have do the next best thing
        selectedText = document.querySelector("[data-test='share-link']")
          .innerText;
      }
    };
    const { getByText } = render(<SharingModal {...props} />);

    const linkButton = getByText("Get shareable link");

    fireEvent.click(linkButton);

    expect(selectedText).toMatch(
      new RegExp(`/launch/${props.questionnaire.id}$`)
    );

    expect(getByText("Link copied to clipboard")).toBeTruthy();
    document.execCommand = originalExecCommand;
  });

  describe("removing editors", () => {
    let mocks;
    let mutationWasCalled = false;
    beforeEach(() => {
      mocks = [
        {
          request: {
            query: ADD_REMOVE_EDITOR_MUTATION,
            variables: {
              input: {
                id: "456",
                editors: props.questionnaire.editors
                  .filter(e => e.name !== "Babs")
                  .map(e => e.id),
              },
            },
          },
          result() {
            mutationWasCalled = true;
            return {
              data: {
                updateQuestionnaire: {
                  id: props.questionnaire.id,
                  editors: props.questionnaire.editors
                    .filter(e => e.name !== "Babs")
                    .map(e => ({ ...e, __typename: "User" })),
                  permission: WRITE,
                  __typename: "Questionnaire",
                },
              },
            };
          },
        },
      ];
    });

    it("should be possible to remove editors", async () => {
      const { getByText, queryByText, getAllByLabelText, rerender } = render(
        <SharingModal {...props} />,
        { mocks }
      );

      const row = getByText("Babs").parentElement;
      const removeButton = getAllByLabelText("Remove editor").find(
        btn => btn.parentElement === row
      );

      fireEvent.click(removeButton);
      await flushPromises();

      const updatedQuestionnaire = {
        ...props.questionnaire,
        editors: props.questionnaire.editors.filter(
          editor => editor.name !== "Babs"
        ),
      };
      props.questionnaire = updatedQuestionnaire;
      rerender(<SharingModal {...props} />);

      expect(mutationWasCalled).toEqual(true);
      expect(queryByText("Babs")).toBeFalsy();
    });
    it("should display a confirmation before removing yourself as editor", async () => {
      const jsdomWindowConfirm = window.confirm;
      window.confirm = jest.fn(() => true);

      props.currentUser.id = "2";

      const { getByText, getAllByLabelText, history } = render(
        <SharingModal {...props} />,
        { mocks }
      );
      history.location = {};
      const row = getByText("Babs").parentElement;
      const removeButton = getAllByLabelText("Remove editor").find(
        btn => btn.parentElement === row
      );
      fireEvent.click(removeButton);
      await flushPromises();

      expect(window.confirm).toHaveBeenCalled();
      expect(history.location.pathname).toEqual("/");
      window.confirm = jsdomWindowConfirm;
    });
  });
  describe("adding editors", () => {
    let mocks;
    let PETER_PARKER;
    beforeEach(() => {
      PETER_PARKER = {
        id: "11",
        name: "Peter Parker",
        email: "p@spidermanfanclub.com",
        picture: "tarantula.jpg",
      };
      mocks = [
        {
          request: {
            query: ALL_USERS_QUERY,
          },
          result: {
            data: {
              users: [
                PETER_PARKER,
                props.questionnaire.createdBy,
                ...props.questionnaire.editors,
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
                id: props.questionnaire.id,
                editors: [...props.questionnaire.editors, PETER_PARKER].map(
                  e => e.id
                ),
              },
            },
          },
          result: {
            data: {
              updateQuestionnaire: {
                id: props.questionnaire.id,
                editors: [...props.questionnaire.editors, PETER_PARKER].map(
                  e => ({
                    ...e,
                    __typename: "User",
                  })
                ),
                permission: WRITE,
                __typename: "Questionnaire",
              },
            },
          },
        },
      ];
    });

    it("should be possible to search for a user by name and add them as an editor", async () => {
      const { getByText, getAllByLabelText, queryByText, rerender } = render(
        <SharingModal {...props} />,
        { mocks }
      );

      // load the users
      await flushPromises();

      expect(queryByText("Beth Smith")).toBeFalsy();

      // downshift labels everything including the div
      const input = getAllByLabelText("Add editors")[0];
      fireEvent.change(input, { target: { value: "beTh" } });

      const userResult = getByText(`Beth`);
      fireEvent.click(userResult);

      await flushPromises();

      const updatedQuestionnaire = {
        ...props.questionnaire,
        editors: [...props.questionnaire.editors, BETH_SMITH],
      };
      props.questionnaire = updatedQuestionnaire;
      rerender(<SharingModal {...props} />);

      expect(queryByText("Beth Smith")).toBeTruthy();
    });

    it("should be possible to search for users by email", async () => {
      const { getAllByLabelText, queryByText } = render(
        <SharingModal {...props} />
      );

      // load the users
      await flushPromises();

      expect(queryByText("Beth Smith")).toBeFalsy();

      const input = getAllByLabelText("Add editors")[0];
      fireEvent.change(input, { target: { value: "beth@sm" } });

      expect(queryByText("Beth Smith")).toBeTruthy();
    });

    it("removing your search should return no one", async () => {
      const { getAllByLabelText, queryByText } = render(
        <SharingModal {...props} />
      );

      // load the users
      await flushPromises();

      expect(queryByText("Beth Smith")).toBeFalsy();

      const input = getAllByLabelText("Add editors")[0];
      fireEvent.change(input, { target: { value: "smit" } });
      fireEvent.change(input, { target: { value: "" } });

      expect(queryByText("Beth Smith")).toBeFalsy();
    });

    it("should not be possible to add existing editors", async () => {
      const { getAllByLabelText, queryAllByText } = render(
        <SharingModal {...props} />
      );

      // load the users
      await flushPromises();

      const input = getAllByLabelText("Add editors")[0];
      fireEvent.change(input, { target: { value: "babs" } });

      expect(queryAllByText("Babs")[0]).toBeTruthy();
      expect(queryAllByText("Babs")[1]).toBeFalsy();
    });

    it("should not be possible to add the owner", async () => {
      const { queryAllByText, getAllByLabelText } = render(
        <SharingModal {...props} />
      );

      // load the users
      await flushPromises();

      const input = getAllByLabelText("Add editors")[0];
      fireEvent.change(input, { target: { value: "jerry" } });

      expect(queryAllByText("Jerry Smith")[0]).toBeTruthy();
      expect(queryAllByText("Jerry Smith")[1]).toBeFalsy();
    });
  });
});
