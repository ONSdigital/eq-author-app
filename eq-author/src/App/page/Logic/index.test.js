import React from "react";
import { shallow } from "enzyme";

import { UnwrappedQuestionRoutingRoute as QuestionRoute } from "./";

describe("Logic Page", () => {
  let match, questionnaireId, sectionId, pageId;

  beforeEach(() => {
    questionnaireId = "1";
    sectionId = "2";
    match = {
      params: { questionnaireId, sectionId, pageId },
    };
  });

  const defaultProps = {
    loading: false,
    data: {
      page: {
        id: "1",
        displayName: "My first displayname",
        title: "My first title",
        page: {
          id: "1",
          displayName: "My question",
          answers: [],
        },
      },
    },
  };

  const render = props => {
    return shallow(
      <QuestionRoute match={match} {...defaultProps} {...props} />
    );
  };

  it("should render", () => {
    expect(render()).toMatchSnapshot();
  });

  it("should show loading info when loading", () => {
    expect(render({ loading: true })).toMatchSnapshot();
  });

  it("should show error info when there is an error", () => {
    expect(render({ error: { message: "some error" } })).toMatchSnapshot();
  });

  it("should render an error when there is no data", () => {
    expect(render({ data: undefined })).toMatchSnapshot();
  });
});
