import React from "react";
import { render, flushPromises } from "tests/utils/rtl";
import { UnwrappedMainNavigation, publishStatusSubscription } from "./";
import { MeContext } from "App/MeContext";
import { act } from "react-dom/test-utils";
import GET_ALL_ANSWERS from "../../qcodes/QCodesTable/graphql/getAllAnswers.graphql";

describe("MainNavigation", () => {
  let props, user, mocks, questionnaire;
  beforeEach(() => {
    user = {
      id: "123",
      displayName: "Batman",
      name: "Bruce",
      email: "IAmBatman@dccomics.com",
      picture: "",
      admin: true,
    };
    const answer = {
      id: "ans-1",
      description: "",
      guidance: "",
      label: "num1",
      qCode: "",
      type: "Number",
      questionPageId: "2",
      secondaryLabel: null,
    };
    const page = { id: "2", title: "Page", position: 0, answers: [answer] };
    const section = { id: "3", title: "Section", pages: [page] };
    // questionnaire = {
    //   id: "1",
    //   title: "Questionnaire",
    //   sections: [section],
    //   editors: [],
    //   createdBy: { ...user },
    //   totalErrorCount: 0,
    // };

    questionnaire = {
      id: "99",
      title: "Questionnaire",
      editors: [],
      createdBy: { ...user },
      totalErrorCount: 0,
      sections: [
        {
          id: "3", title: "Section",
          pages: [
            {
              id: "2",
              title: "page",
              position: 0,
              confirmation: null,
              alias: null,
              totalTitle: "",
              displayName: "",
              answers: [
                {
                  id: "ans-1",
                  label: "num1",
                  secondaryLabel: null,
                  type: "Number",
                  qCode: "",
                  properties: {
                    required: false,
                    decimals: 0
                  },
                  secondaryQCode: null,
                  options: [
                    {
                      id: "8f878166-0e42-489a-baac-426994516e93",
                      label: "checkbox1",
                      qCode: "asd",
                      __typename: "Option"
                    }
                  ],
                  mutuallyExclusiveOption: null,
                  __typename: "BasicAnswer",
                },
              ],
              __typename: "QuestionPage",
            },
            {
              id: "3e0a0933-888b-4f3d-b3a5-629387344749",
              title: "<p>calc summary</p>",
              alias: null,
              totalTitle: null,
              displayName: "calc summary",
              pageType: "CalculatedSummaryPage",
              qCode: null,
              summaryAnswers: [
                {
                  id: "324052e7-e269-48f2-8e70-65a5d71d08ff",
                  displayName: "number label",
                  label: "number label",
                  qCode: "",
                  __typename: "BasicAnswer"
                }
              ],
              section: {
                id: "fe60a528-4bda-43c6-8f4f-6ff785cd79f8",
                title: "<p>section 1</p>",
                __typename: "Section"
              },
              __typename: "CalculatedSummaryPage",
            }
          ],
          __typename: "Section",
        }
      ],
      __typename: "Questionnaire",
    };


    props = {
      questionnaire,
      match: { params: { modifier: "", questionnaireId: questionnaire.id } },
      loading: false,
    };
    mocks = [
      {
        request: {
          query: publishStatusSubscription,
          variables: { id: props.match.params.questionnaireId },
        },
        result: () => {
          return {
            data: {
              publishStatusUpdated: {
                id: "99",
                publishStatus: "unpublished",
                __typename: "query",
              },
            },
          };
        },
      },
      {
        request: {
          query: GET_ALL_ANSWERS,
          variables: {
            input: {
              questionnaireId: "99"
            }
          },
        },
        result: () => {
          return {
            data: {
              questionnaire: {
                id: "99",
                sections: [
                  {
                    pages: [
                      {
                        id: "fbca09a6-fd2f-49df-905f-6aea4362bdc5",
                        title: "<p>question 1</p>",
                        alias: null,
                        confirmation: null,
                        answers: [
                          {
                            id: "324052e7-e269-48f2-8e70-65a5d71d08ff",
                            label: "number label",
                            secondaryLabel: null,
                            type: "Number",
                            qCode: "",
                            properties: {
                              required: false,
                              decimals: 0
                            },
                            secondaryQCode: null,
                            __typename: "BasicAnswer"
                          }
                        ],
                        __typename: "QuestionPage"
                      },
                      {
                        id: "3e0a0933-888b-4f3d-b3a5-629387344749",
                        title: "<p>calc summary</p>",
                        alias: null,
                        totalTitle: null,
                        displayName: "calc summary",
                        pageType: "CalculatedSummaryPage",
                        qCode: null,
                        summaryAnswers: [
                          {
                            id: "324052e7-e269-48f2-8e70-65a5d71d08ff",
                            displayName: "number label",
                            label: "number label",
                            qCode: "",
                            __typename: "BasicAnswer"
                          }
                        ],
                        section: {
                          id: "fe60a528-4bda-43c6-8f4f-6ff785cd79f8",
                          title: "<p>section 1</p>",
                          __typename: "Section"
                        },
                        __typename: "CalculatedSummaryPage"
                      }
                    ],
                    __typename: "Section"
                  }
                ],
                __typename: "Questionnaire"
              }
            },
          };
        },
      },
    ];


  });

  it("should enable all buttons if there are no errors on questionnaire", async () => {
    const { getByTestId } = render(
      <MeContext.Provider value={{ me: user }}>
        <UnwrappedMainNavigation {...props} />
      </MeContext.Provider>,
      {
        mocks,
      }
    );

    await act(async () => {
      flushPromises();
    });

    const nav = getByTestId("main-navigation");
    await act(async () => {
      flushPromises();
    });
    expect(nav).toBeTruthy();

    const viewSurveyBtn = getByTestId("btn-preview");
    const settingsBtn = getByTestId("btn-settings");
    const sharingBtn = getByTestId("btn-sharing");
    const historyBtn = getByTestId("btn-history");
    const metadataBtn = getByTestId("btn-metadata");
    const qcodesBtn = getByTestId("btn-qcodes");

    expect(viewSurveyBtn).not.toBeDisabled();
    expect(settingsBtn).not.toBeDisabled();
    expect(sharingBtn).not.toBeDisabled();
    expect(historyBtn).not.toBeDisabled();
    expect(metadataBtn).not.toBeDisabled();
    expect(qcodesBtn).not.toBeDisabled();
  });

  it("should disable qcodes, publish and preview buttons if there are errors on questionnaire", async () => {
    props.questionnaire.totalErrorCount = 1;

    const { getByTestId } = render(
      <MeContext.Provider value={{ me: user }}>
        <UnwrappedMainNavigation {...props} />
      </MeContext.Provider>,
      {
        mocks,
      }
    );

    await act(async () => {
      flushPromises();
    });

    const nav = getByTestId("main-navigation");

    await act(async () => {
      flushPromises();
    });

    expect(nav).toBeTruthy();

    const viewSurveyBtn = getByTestId("btn-preview");
    const settingsBtn = getByTestId("btn-settings");
    const sharingBtn = getByTestId("btn-sharing");
    const historyBtn = getByTestId("btn-history");
    const metadataBtn = getByTestId("btn-metadata");
    const qcodesBtn = getByTestId("btn-qcodes");

    expect(viewSurveyBtn.hasAttribute("disabled")).toBeTruthy();
    expect(settingsBtn.hasAttribute("disabled")).toBeFalsy();
    expect(sharingBtn.hasAttribute("disabled")).toBeFalsy();
    expect(historyBtn.hasAttribute("disabled")).toBeFalsy();
    expect(metadataBtn.hasAttribute("disabled")).toBeFalsy();
    expect(qcodesBtn.hasAttribute("disabled")).toBeTruthy();
  });
});
