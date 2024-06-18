import React from "react";
import { shallow } from "enzyme";
import { render, flushPromises, act } from "tests/utils/rtl";

import commentsSubscription from "graphql/subscriptions/commentSubscription.graphql";
import { MeContext } from "App/MeContext";

import { byTestAttr } from "tests/utils/selectors";

import CalculatedSummaryPreview from "./CalculatedSummaryPreview";
import { publishStatusSubscription } from "components/EditorLayout/Header";
import QuestionnaireContext from "components/QuestionnaireContext";

jest.mock("@apollo/react-hooks", () => ({
  ...jest.requireActual("@apollo/react-hooks"),
  useQuery: jest.fn(),
  useMutation: jest.fn(() => [() => null]),
}));

const questionnaire = {
  id: "questionnaire-1",
  sections: [
    {
      id: "section-1",
      folders: [
        {
          id: "folder-1",
          pages: [
            {
              id: "3",
              pageType: "QuestionPage",
              title: "Page 1",
              answers: [
                {
                  id: "answer-1",
                  label: "answer 1",
                },
                {
                  id: "answer-2",
                  label: "answer 2",
                },
              ],
            },
            {
              id: "6",
              pageType: "QuestionPage",
              title: "Page 2",
              answers: [
                {
                  id: "answer-3",
                  label: "answer 3",
                },
                {
                  id: "answer-4",
                  label: "answer 4",
                },
              ],
            },
            {
              id: "9",
              title: "calculated summary page 1",
              pageType: "CalculatedSummaryPage",
              pageDescription: "Hello",
              alias: "Who am I?",

              summaryAnswers: [
                { id: "answer-4", displayName: "Answer 4" },
                { id: "answer-2", displayName: "Answer 2" },
                { id: "answer-3", displayName: "Answer 3" },
                { id: "answer-1", displayName: "Answer 1" },
              ],
            },
          ],
        },
      ],
    },
  ],
};

describe("CalculatedSummaryPreview", () => {
  let page, me, mocks, questionnaireId;

  beforeEach(() => {
    questionnaireId = "111";
    me = {
      id: "123",
      displayName: "Raymond Holt",
      email: "RaymondHolt@TheNineNine.com",
      picture: "http://img.com/avatar.jpg",
      admin: true,
    };

    page = {
      id: "pageId",
      displayName: "Question",
      position: 1,
      title: "<p>Hello world</p>",
      totalTitle: "<p>Total be:</p>",
      pageDescription: "Hello",
      alias: "Who am I?",
      type: "Number",
      answers: [],
      comments: [],
      summaryAnswers: [
        { id: "1", displayName: "Answer 1" },
        { id: "2", displayName: "Answer 2" },
        { id: "3", displayName: "Answer 3" },
      ],
      pageType: "CalculatedSummaryPage",
      section: {
        id: "1",
        position: 0,
        questionnaire: {
          id: "1",
          metadata: [],
        },
      },
      validationErrorInfo: {
        id: "test",
        totalCount: 0,
        errors: [],
      },
      folder: {
        id: "folder-1",
        position: 0,
      },
    };

    mocks = [
      {
        request: {
          query: publishStatusSubscription,
          variables: { id: questionnaireId },
        },
        result: () => ({
          data: {
            publishStatusUpdated: {
              id: questionnaireId,
              publishStatus: "Unpublished",
              __typename: "Questionnaire",
            },
          },
        }),
      },
      {
        request: {
          query: commentsSubscription,
          variables: { id: "pageId" },
        },
        result: () => {
          return {};
        },
      },
    ];
  });

  it("should render", async () => {
    const { getByTestId, getByText } = render(
      <MeContext.Provider value={{ me }}>
        <CalculatedSummaryPreview page={page} />
      </MeContext.Provider>,
      {
        route: `/q/${questionnaireId}/page/2/preview`,
        urlParamMatcher: "/q/:questionnaireId/page/:pageId",
        mocks,
      }
    );
    await act(async () => {
      await flushPromises();
    });
    expect(getByTestId("calSum test page")).toBeTruthy();
    expect(getByText("Answer 1")).toBeTruthy();
  });

  it("should render empty box when no total-title given", () => {
    page.totalTitle = "";
    const wrapper = shallow(
      <MeContext.Provider value={{ me }}>
        <CalculatedSummaryPreview page={page} />
      </MeContext.Provider>,
      {
        route: `/q/${questionnaireId}/page/2/preview`,
        urlParamMatcher: "/q/:questionnaireId/page/:pageId",
        mocks,
      }
    );
    expect(wrapper.find(byTestAttr("no-total-title"))).toBeTruthy();
  });

  it("should render 'no answers selected' message", () => {
    page.summaryAnswers = [];
    const wrapper = shallow(
      <MeContext.Provider value={{ me }}>
        <CalculatedSummaryPreview page={page} />
      </MeContext.Provider>,
      {
        route: `/q/${questionnaireId}/page/2/preview`,
        urlParamMatcher: "/q/:questionnaireId/page/:pageId",
        mocks,
      }
    );
    expect(wrapper.find(byTestAttr("no-answers-selected"))).toBeTruthy();
  });

  // test the answer.display name is rendered in the page.
  // change the code where it test based on the data-test id(data-test id need to be unique for each answer) no functions need to be mock at all.
  // check the text of answer found from the data test id is equal to the answer.displayName
  // check if the question page title appear in the correct order with the answer display name
  // index for each loop

  it.only("should order the summary answers correctly ", () => {
    const { getByTestId } = render(
      <QuestionnaireContext.Provider value={{ questionnaire }}>
        <MeContext.Provider value={{ me }}>
          <CalculatedSummaryPreview
            page={questionnaire.sections[0].folders[0].pages[2]}
          />
        </MeContext.Provider>
        ,
      </QuestionnaireContext.Provider>,
      {
        route: `/q/${questionnaireId}/page/9/preview`,
        urlParamMatcher: "/q/:questionnaireId/page/:pageId",
        mocks,
      }
    );

    expect(getByTestId("answer-item-0")).toHaveTextContent("Answer 3");
    expect(getByTestId("answer-item-1")).toHaveTextContent("Answer 4");
    expect(getByTestId("answer-item-2")).toHaveTextContent("Answer 1");
    expect(getByTestId("answer-item-3")).toHaveTextContent("Answer 2");
  });
});
