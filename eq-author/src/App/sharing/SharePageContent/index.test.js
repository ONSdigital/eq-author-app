import React from "react";
import { render, act, flushPromises, fireEvent } from "tests/utils/rtl";

import { Sharing } from "./index";

import TOGGLE_PUBLIC_MUTATION from "../graphql/TogglePublicMutation.graphql";

jest.mock("./EditorSearch.js", () => {
  const EditorSearch = () => <div />;
  return EditorSearch;
});

const renderSharing = (props, mocks) => {
  return render(<Sharing {...props} />, { mocks });
};

let props, mocks;

let queryWasCalled = false;
beforeEach(() => {
  props = {
    data: {
      questionnaire: {
        id: "1",
        isPublic: true,
        createdBy: {
          id: "2",
          name: "Owner",
          email: "owner@email.com",
        },
        editors: [
          {
            id: "2",
            name: "Owner",
            email: "owner@email.com",
          },
          {
            id: "4",
            name: "Ed",
            email: "Ed@email.com",
          },
        ],
      },
    },
    showToast: jest.fn(),
  };
  mocks = [
    {
      request: {
        query: TOGGLE_PUBLIC_MUTATION,
        variables: {
          input: {
            id: props.data.questionnaire.id,
            isPublic: !props.data.questionnaire.isPublic,
          },
        },
      },
      result: () => {
        queryWasCalled = true;
        return {
          data: {
            updateQuestionnaire: {
              id: props.data.questionnaire.id,
              isPublic: !props.data.questionnaire.isPublic,
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

describe("Share Page", () => {
  it("should have shareable link", async () => {
    const originalExecCommand = document.execCommand;
    let selectedText = "no text selected";
    document.execCommand = (command) => {
      if (command === "copy") {
        // jsdom has not implemented textselection so we we have do the next best thing
        selectedText = document.querySelector("[data-test='share-link']")
          .innerText;
      }
    };
    const { getByText } = renderSharing(props);
    await act(async () => {
      await flushPromises();
    });

    const linkButton = getByText("Get shareable link");

    fireEvent.click(linkButton);
    expect(selectedText).toMatch(
      new RegExp(`/launch/${props.data.questionnaire.id}$`)
    );

    expect(props.showToast).toHaveBeenCalled();
    document.execCommand = originalExecCommand;
  });

  it("should be able to toggle public access", async () => {
    const { getByTestId, getByRole, rerender } = render(
      <Sharing {...props} />,
      { mocks }
    );

    const publicSwitch = getByTestId("public");

    expect(publicSwitch).toBeTruthy();

    const switchInput = getByRole("checkbox");

    await act(async () => {
      await fireEvent.click(switchInput);
      flushPromises();
    });

    props = {
      data: {
        questionnaire: {
          isPublic: false,
        },
      },
    };

    rerender(<Sharing {...props} />);

    expect(switchInput["aria-checked"]).toBeFalsy();
    expect(queryWasCalled).toBeTruthy();
  });
});
