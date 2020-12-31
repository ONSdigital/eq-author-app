import React from "react";
import { shallow } from "enzyme";

import { UnwrappedLogicPage } from "./";

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
        validationErrorInfo: {
          totalCount: 2,
          errors: [
            {
              id: "expressions-skipConditions-1",
              type: "skipConditionExpression",
            },
            {
              id: "expressions-routing-1",
              type: "routingExpression",
            },
          ],
        },
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
      <UnwrappedLogicPage match={match} {...defaultProps} {...props}>
        Content
      </UnwrappedLogicPage>
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

  it("should provide the validation error dot for the routing tab if design page has error", () => {
    expect(
      shallow(
        <UnwrappedLogicPage match={match} {...defaultProps}>
          Content
        </UnwrappedLogicPage>
      ).find("[data-test='badge-withCount']")
    ).toHaveLength(2);
  });

  it("should not provide the validation error dot for the routing tab if design page has no error", () => {
    const defaultProps = {
      loading: false,
      data: {
        page: {
          id: "1",
          displayName: "My first displayname",
          title: "My first title",
          validationErrorInfo: {
            totalCount: 0,
            errors: [],
          },
          page: {
            id: "1",
            displayName: "My question",
            answers: [],
          },
        },
      },
    };

    expect(
      shallow(
        <UnwrappedLogicPage match={match} {...defaultProps}>
          Content
        </UnwrappedLogicPage>
      ).find("[data-test='badge-withCount']")
    ).toHaveLength(0);
  });
});
