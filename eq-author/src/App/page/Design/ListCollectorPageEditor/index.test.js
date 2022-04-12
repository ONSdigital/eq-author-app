import UnwrappedListCollectorPageEditor from ".";

import React from "react";
import { render } from "tests/utils/rtl";

jest.mock("components/NavigationCallbacks", () => ({
  useSetNavigationCallbacksForPage: () => null,
}));

describe("List Collector Page Editor", () => {
  let wrapper;

  let mockHandlers;
  let page;
  let section;
  let questionnaire;

  const answer = {
    id: "123",
    __typename: "Answer",
  };

  const match = {
    params: {
      questionnaireId: "1",
      sectionId: "2",
      pageId: "3",
    },
  };

  const renderListCollector = ({ ...props }) =>
    render(
      <UnwrappedListCollectorPageEditor
        {...mockHandlers}
        questionnaire={questionnaire}
        page={page}
        section={section}
        showMovePageDialog={false}
        showDeleteConfirmDialog={false}
        match={match}
        {...props}
      />
    );

  beforeEach(() => {
    mockHandlers = {
      onUpdateAnswer: jest.fn(),
      onUpdatePage: jest.fn(),
      onDeletePageConfirm: jest.fn(),
      onCloseDeleteConfirmDialog: jest.fn(),
      onAddAnswer: jest.fn(() => Promise.resolve(answer)),
      onAddOption: jest.fn(),
      fetchAnswers: jest.fn(),
      onDeleteOption: jest.fn(),
      onDeleteAnswer: jest.fn(),
      onAddExclusive: jest.fn(),
      onUpdateOption: jest.fn(),
      onMovePage: jest.fn(),
      onCloseMovePageDialog: jest.fn(),
      onAddOther: jest.fn(),
      onDeleteOther: jest.fn(),
      onChange: jest.fn(),
      onUpdate: jest.fn(),
    };

    page = {
      __typename: "Page",
      id: "1",
      displayName: "Question",
      position: 1,
      title: "<p>Hello world</p>",
      alias: "Who am I?",
      anotherNegativeDescription: "",
      alias: "",
      title: "List Names",
      anotherPositiveDescription: "",
      addItemTitle: "<p>What are the names of everyone who live at ?</p>",
      anotherTitle:
        "<p>Does anyone live at  as their permanent or family home?</p>",
      pageType: "ListCollectorPage",
      anotherPositive: "Yes",
      id: "b6d9efb5-24e5-4e42-abbc-912ef6aebcdb",
      listId: "list-1",
      anotherNegative: "No",
      validationErrorInfo: {
        totalCount: 0,
        errors: [],
        id: "1",
        __typename: "ValidationErrorInfo",
      },
      answers: [
        {
          __typename: "BasicAnswer",
          id: "1",
          title: "First name",
          description: "",
          type: "TextField",
        },
        {
          __typename: "BasicAnswer",
          id: "2",
          title: "Last name",
          description: "",
          type: "TextField",
        },
      ],
      section: { questionnaire: { metadata: [] } },
    };

    section = {
      id: "3",
      pages: [page],
    };

    questionnaire = {
      id: "1",
      __typename: "Questionnaire",
      sections: [section],
      collectionLists: {
        lists: [
          {
            answers: [
              {
                secondaryLabel: null,

                description: null,
                properties: {
                  required: false,
                },
                id: "list-answer-1",
                label: "Pet's Name",
                guidance: null,
                type: "TextField",
                qCode: null,
              },
            ],
            id: "list-1",
            listName: "Pets",
            totalValidation: null,
          },
        ],
        id: "collection-lists-1",
      },
    };
  });

  it("should delete the correct answer", () => {
    // wrapper
    // .find("[data-test='answers-editor']")
    // .first()
    // .simulate("deleteAnswer", page.answers[0].id);
    const { getByTestId } = renderListCollector({});

    expect(mockHandlers.onDeleteAnswer).toHaveBeenCalledWith(
      page.id,
      page.answers[0].id
    );
  });

  it("should add an answer with a type", () => {
    // wrapper.find("[data-test='add-answer']").simulate("select", "Textfield");
    expect(mockHandlers.onAddAnswer).toHaveBeenCalledWith(
      match.params.pageId,
      "Textfield"
    );
  });
});
