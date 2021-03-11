import React from "react";

import { render } from "tests/utils/rtl";

import NavigationSidebar from ".";

const mockQuestionnaire = {
  introduction: {
    id: "197cb391-06fc-4d6d-a98f-e162ad9ebd01",
    __typename: "QuestionnaireIntroduction",
  },
  publishStatus: "Unpublished",
  totalErrorCount: 6,
  qCodeErrorCount: 2,
  id: "bbe1a631-c54d-48bc-8c26-f18abad0b3a0",
  sections: [
    {
      id: "3b1b3a38-69cd-49ec-86ea-298f9a8ae694",
      title: "",
      displayName: "Untitled section",
      questionnaire: {
        id: "bbe1a631-c54d-48bc-8c26-f18abad0b3a0",
        __typename: "Questionnaire",
      },
      validationErrorInfo: {
        id: "3b1b3a38-69cd-49ec-86ea-298f9a8ae694",
        totalCount: 0,
        __typename: "ValidationErrorInfo",
      },
      folders: [
        {
          id: "b27a62e6-3c60-4220-8580-8bd2128f288d",
          enabled: false,
          alias: "",
          position: 0,
          validationErrorInfo: {
            id: "f0awdhiwahd-fc50-46ec-b228-76b9f787e708",
            totalCount: 0,
            __typename: "ValidationErrorInfo",
          },
          pages: [
            {
              id: "17de54db-eb71-42d5-9f4c-948b9f6dbfc5",
              title: "<p>My question</p>",
              position: 0,
              displayName: "My question",
              pageType: "QuestionPage",
              validationErrorInfo: {
                id: "17de54db-eb71-42d5-9f4c-948b9f6dbfc5",
                errors: [
                  {
                    id: "abd0891d-eebe-4622-bc1d-1b4ee9f43f50",
                    type: "answer",
                    field: "qCode",
                    errorCode: "ERR_VALID_REQUIRED",
                    __typename: "ValidationError",
                  },
                ],
                totalCount: 0,
                __typename: "ValidationErrorInfo",
              },
              confirmation: {
                id: "f0b33c81-fc50-46ec-b228-76b9f787e708",
                __typename: "QuestionConfirmation",
                displayName: "Untitled confirmation question",
                validationErrorInfo: {
                  id: "f0b33c81-fc50-46ec-b228-76b9f787e708",
                  totalCount: 3,
                  __typename: "ValidationErrorInfo",
                },
              },
              __typename: "QuestionPage",
            },
          ],
          __typename: "Folder",
        },
        {
          id: "8d7e1aa8-305f-4c85-86d9-c48cddd6392a",
          enabled: true,
          alias: "",
          position: 1,
          validationErrorInfo: {
            id: "f0awdhiwahd-fc50-46ec-b228-76b9f787e708",
            totalCount: 0,
            __typename: "ValidationErrorInfo",
          },
          pages: [
            {
              id: "79710f7d-d65a-48ae-9c5d-77ffa381f40a",
              title: "",
              position: 0,
              displayName: "Untitled question",
              pageType: "QuestionPage",
              validationErrorInfo: {
                id: "79710f7d-d65a-48ae-9c5d-77ffa381f40a",
                errors: [
                  {
                    id: "f4e06dec-46a7-4892-b6e0-5f2bfa809ea4",
                    type: "page",
                    field: "title",
                    errorCode: "ERR_VALID_REQUIRED",
                    __typename: "ValidationError",
                  },
                  {
                    id: "28c77e61-767f-446f-bbbe-4715ca14ed4e",
                    type: "page",
                    field: "answers",
                    errorCode: "ERR_NO_ANSWERS",
                    __typename: "ValidationError",
                  },
                ],
                totalCount: 2,
                __typename: "ValidationErrorInfo",
              },
              confirmation: null,
              __typename: "QuestionPage",
            },
          ],
          __typename: "Folder",
        },
        {
          id: "243e10c3-67ca-4655-ada2-b326b68c86f9",
          enabled: false,
          alias: "",
          position: 2,
          pages: [
            {
              id: "78da469d-8ab9-44c9-b7b7-86e806af6420",
              title: "<p>My calculated summary</p>",
              position: 0,
              displayName: "My calculated summary",
              pageType: "CalculatedSummaryPage",
              validationErrorInfo: {
                id: "78da469d-8ab9-44c9-b7b7-86e806af6420",
                errors: [
                  {
                    id: "31fe7e03-e02a-441b-b34d-075e29fb67df",
                    type: "page",
                    field: "summaryAnswers",
                    errorCode: "ERR_NO_ANSWERS",
                    __typename: "ValidationError",
                  },
                ],
                totalCount: 1,
                __typename: "ValidationErrorInfo",
              },
              __typename: "CalculatedSummaryPage",
            },
          ],
          __typename: "Folder",
        },
      ],
      __typename: "Section",
    },
  ],
  __typename: "Questionnaire",
  title: "Dina",
  description: "",
  surveyId: "",
  theme: "default",
  navigation: false,
  summary: false,
  collapsibleSummary: null,
  type: "Business",
  shortTitle: null,
  displayName: "Dina",
  createdBy: {
    id: "123-456-789-0",
    picture: null,
    name: "Dina",
    email: "Dina@Cloud9.com",
    __typename: "User",
  },
  editors: [],
  isPublic: true,
  permission: "Write",
};

const renderNavigationSidebar = ({
  questionnaire = mockQuestionnaire,
  onAddQuestionPage = jest.fn(),
  onAddSection = jest.fn(),
  onAddFolder = jest.fn(),
  onAddCalculatedSummaryPage = jest.fn(),
  onAddQuestionConfirmation = jest.fn(),
  canAddQuestionConfirmation = true,
  canAddCalculatedSummaryPage = true,
  canAddQuestionPage = true,
  canAddFolder = true,
  match = { params: { entityId: "17de54db-eb71-42d5-9f4c-948b9f6dbfc5" } },
}) =>
  render(
    <NavigationSidebar
      questionnaire={questionnaire}
      onAddQuestionPage={onAddQuestionPage}
      onAddSection={onAddSection}
      onAddFolder={onAddFolder}
      onAddCalculatedSummaryPage={onAddCalculatedSummaryPage}
      onAddQuestionConfirmation={onAddQuestionConfirmation}
      canAddQuestionConfirmation={canAddQuestionConfirmation}
      canAddCalculatedSummaryPage={canAddCalculatedSummaryPage}
      canAddQuestionPage={canAddQuestionPage}
      canAddFolder={canAddFolder}
      match={match}
    />
  );

describe("Navigation sidebar", () => {
  it("Can render with an assortment of questions and folders", () => {
    const { getByTestId } = renderNavigationSidebar({});

    expect(getByTestId("side-nav")).toBeTruthy();
  });
});
