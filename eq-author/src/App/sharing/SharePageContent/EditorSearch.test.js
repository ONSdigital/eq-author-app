import React from "react";
import { render, act, flushPromises, fireEvent } from "tests/utils/rtl";

import ADD_REMOVE_EDITOR from "../graphql/AddRemoveEditor.graphql";
import { READ } from "constants/questionnaire-permissions";

import { EditorSearch } from "./EditorSearch";

const renderEditorSearch = (props, mocks) => {
  return render(<EditorSearch {...props} />, { mocks });
};

describe("Editor search", () => {
  let props, mocks, queryWasCalled, editors;
  beforeEach(() => {
    editors = [
      { id: "4", name: "Fred", email: "Fred@mail.com" },
      { id: "5", name: "George", email: "George@mail.com" },
      { id: "6", name: "Albert", email: "Albert@mail.com" },
    ];

    props = {
      questionnaireId: "1",
      users: [
        { id: "2", name: "UserThomas", email: "thomas@mail.com" },
        { id: "3", name: "UserJack", email: "jack@mail.com" },
      ],
      owner: { id: "2", name: "OwnerThomas", email: "OwnerThomas@mail.com" },
      editors: [],
      showToast: jest.fn(),
    };

    mocks = [
      {
        request: {
          query: ADD_REMOVE_EDITOR,
          variables: {
            input: {
              id: props.questionnaireId,
              editors: ["4", "6"],
              permission: READ,
            },
          },
        },
        result: () => {
          queryWasCalled = true;
          return {
            data: {
              updateQuestionnaire: {
                id: props.questionnaireId,
                editors: [
                  {
                    id: "4",
                    name: "Fred",
                    email: "Fred@mail.com",
                    picture: "mypicture",
                    __typename: "User",
                  },
                  {
                    id: "6",
                    name: "Albert",
                    email: "Albert@mail.com",
                    picture: "mypicture",
                    __typename: "User",
                  },
                ],
                permission: READ,
                __typename: "Questionnaire",
              },
            },
          };
        },
      },
    ];
  });

  afterEach(async () => {
    await act(async () => {
      await flushPromises();
    });
  });

  it("should display owner", () => {
    const { queryByTestId } = renderEditorSearch(props);
    const testIds = ["user-item", "user-name", "user-owner", "user-email"];
    const [user, name, owner, email] = testIds.map((id) => queryByTestId(id));

    expect(user).toBeTruthy();
    expect(name).toBeTruthy();
    expect(owner).toBeTruthy();
    expect(email).toBeFalsy();
  });

  it("should display owner email if name is null", () => {
    props.owner.name = null;

    const { queryByTestId } = renderEditorSearch(props);
    const testIds = ["user-item", "user-name", "user-owner", "user-email"];
    const [user, name, owner, email] = testIds.map((id) => queryByTestId(id));

    expect(user).toBeTruthy();
    expect(name).toBeFalsy();
    expect(owner).toBeTruthy();
    expect(email).toBeTruthy();
  });

  it("should display editors", () => {
    props.editors = editors;

    const { queryAllByTestId } = renderEditorSearch(props);

    const testIds = ["user-item", "user-name", "user-owner", "user-email"];
    const [user, name, owner, email] = testIds.map((id) =>
      queryAllByTestId(id)
    );

    expect(user.length).toEqual(4);
    expect(name.length).toEqual(4);
    expect(owner.length).toEqual(1);
    expect(email.length).toEqual(3);
  });

  it("should remove editor from list", async () => {
    props.editors = editors;
    const TARGET = "George";
    const { queryAllByTestId, queryByText, rerender } = render(
      <EditorSearch {...props} />,
      {
        mocks,
      }
    );

    const testIds = ["user-item", "user-name", "user-owner", "user-email"];
    const [user, name, owner, email] = testIds.map((id) =>
      queryAllByTestId(id)
    );

    expect(user.length).toEqual(4);
    expect(name.length).toEqual(4);
    expect(owner.length).toEqual(1);
    expect(email.length).toEqual(3);
    expect(queryByText(TARGET)).toBeTruthy();

    const removeButton = queryAllByTestId("user-remove-btn");

    await act(async () => {
      fireEvent.click(removeButton[1]);
      flushPromises();
    });

    expect(queryWasCalled).toBeTruthy();

    const updatedEditors = editors.filter((editor) => editor.name !== TARGET);
    props.editors = updatedEditors;

    rerender(<EditorSearch {...props} />);

    const [userUpdated, nameUpdated, ownerUpdated, emailUpdated] = testIds.map(
      (id) => queryAllByTestId(id)
    );

    expect(userUpdated.length).toEqual(3);
    expect(nameUpdated.length).toEqual(3);
    expect(ownerUpdated.length).toEqual(1);
    expect(emailUpdated.length).toEqual(2);
    expect(queryByText(TARGET)).toBeFalsy();
  });
});
