import React from "react";
import { shallow } from "enzyme";
import { render, flushPromises, act } from "tests/utils/rtl";

import commentsSubscription from "graphql/subscriptions/commentSubscription.graphql";
import { MeContext } from "App/MeContext";
import { byTestAttr } from "tests/utils/selectors";
import { TEXTFIELD } from "constants/answer-types";

import Error from "components/preview/Error";
import { publishStatusSubscription } from "components/EditorLayout/Header";

import QuestionPagePreview, {
  DetailsContent,
  DetailsTitle,
} from "./QuestionPagePreview";

describe("QuestionPagePreview", () => {
  let page, me, mocks, questionnaireId;

  beforeEach(() => {
    me = {
      id: "123",
      displayName: "Raymond Holt",
      email: "RaymondHolt@TheNineNine.com",
      picture: "http://img.com/avatar.jpg",
      admin: true,
    };

    page = {
      id: "1",
      displayName: "Question",
      position: 1,
      title: "<p>Hello world</p>",
      alias: "Who am I?",
      pageType: "QuestionPage",
      description: "<p>Description</p>",
      descriptionEnabled: true,
      guidance: "<p>Guidance</p>",
      guidanceEnabled: true,
      definitionLabel: "<p>Definition Label</p>",
      definitionContent: "<p>Definition Content</p>",
      definitionEnabled: true,
      additionalInfoLabel: "<p>Additional Info Label</p>",
      additionalInfoContent: "<p>Additional Info Content</p>",
      additionalInfoEnabled: true,
      validationErrorInfo: { totalCount: 0, errors: [] },
      answers: [{ id: "1", type: TEXTFIELD }],
      section: {
        id: "1",
        position: 0,
        questionnaire: {
          id: "1",
          metadata: [],
        },
      },
      folder: {
        id: "folder-1",
        position: 0,
      },
      totalValidation: null,
    };
    questionnaireId = "q123";
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
          variables: { id: "1" },
        },
        result: () => {
          return {};
        },
      },
    ];
  });

  it("should render", async () => {
    const { getByText } = render(
      <MeContext.Provider value={{ me }}>
        <QuestionPagePreview page={page} />
      </MeContext.Provider>,
      {
        route: `/q/${questionnaireId}/page/2`,
        urlParamMatcher: "/q/:questionnaireId/page/:pageId",
        mocks,
      }
    );
    await act(async () => {
      await flushPromises();
    });
    expect(getByText("Additional Info Content")).toBeTruthy();
  });

  it("should render warning when there are no answers", () => {
    page.answers = [];
    const wrapper = shallow(<QuestionPagePreview page={page} />);
    expect(wrapper.find(byTestAttr("no-answers"))).toBeTruthy();
  });

  it("should not render description when disabled", () => {
    page.descriptionEnabled = false;
    const wrapper2 = shallow(<QuestionPagePreview page={page} />);
    expect(wrapper2.exists(byTestAttr("description"))).toBeFalsy();
  });

  it("should render description missing message", () => {
    page.description = "";
    const wrapper2 = shallow(<QuestionPagePreview page={page} />);
    expect(
      wrapper2.find(byTestAttr("description")).find(Error)
    ).toMatchSnapshot();
  });

  it("should not render guidance when disabled", () => {
    page.guidanceEnabled = false;
    const wrapper = shallow(<QuestionPagePreview page={page} />);
    expect(wrapper.exists(byTestAttr("guidance"))).toBeFalsy();
  });

  it("should render guidance missing message", () => {
    page.guidance = "";
    const wrapper2 = shallow(<QuestionPagePreview page={page} />);
    expect(wrapper2.find(byTestAttr("guidance")).find(Error)).toMatchSnapshot();
  });

  it("should not render definition when disabled", () => {
    page.definitionEnabled = false;
    const wrapper = shallow(<QuestionPagePreview page={page} />);
    expect(wrapper.exists(byTestAttr("definition"))).toBeFalsy();
  });

  it("should render definition label missing message", () => {
    page.definitionLabel = "";
    const wrapper = shallow(<QuestionPagePreview page={page} />);
    expect(
      wrapper.find(byTestAttr("definition")).find(DetailsTitle)
    ).toMatchSnapshot();
  });

  it("should render definition content missing message", () => {
    page.definitionContent = "";
    const wrapper = shallow(<QuestionPagePreview page={page} />);
    expect(
      wrapper.find(byTestAttr("definition")).find(DetailsContent)
    ).toMatchSnapshot();
  });

  it("should not render additional information when disabled", () => {
    page.additionalInfoEnabled = false;
    const wrapper = shallow(<QuestionPagePreview page={page} />);
    expect(wrapper.exists(byTestAttr("additional-info"))).toBeFalsy();
  });

  it("should render additional info label missing message", () => {
    page.additionalInfoLabel = "";
    const wrapper = shallow(<QuestionPagePreview page={page} />);
    expect(
      wrapper.find(byTestAttr("additional-info")).find(DetailsTitle)
    ).toMatchSnapshot();
  });

  it("should render additional info content missing message", () => {
    page.additionalInfoContent = "";
    const wrapper = shallow(<QuestionPagePreview page={page} />);
    expect(
      wrapper.find(byTestAttr("additional-info")).find(DetailsContent)
    ).toMatchSnapshot();
  });
});
