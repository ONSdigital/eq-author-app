import React from "react";
import { shallow } from "enzyme";
import { render, flushPromises, act } from "tests/utils/rtl";

import commentsSubscription from "graphql/subscriptions/commentSubscription.graphql";
import { MeContext } from "App/MeContext";
import { byTestAttr } from "tests/utils/selectors";

import CalculatedSummaryPreview from "./CalculatedSummaryPreview";
import { publishStatusSubscription } from "components/EditorLayout/Header";

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
      alias: "Who am I?",
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
    const wrapper = shallow(<CalculatedSummaryPreview page={page} />);
    expect(wrapper.find(byTestAttr("no-total-title"))).toBeTruthy();
  });

  it("should render 'no answers selected' message", () => {
    page.summaryAnswers = [];
    const wrapper = shallow(<CalculatedSummaryPreview page={page} />);
    expect(wrapper.find(byTestAttr("no-answers-selected"))).toBeTruthy();
  });
});
