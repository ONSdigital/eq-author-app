import React from "react";
import { shallow } from "enzyme";

import Loading from "components/Loading";
import Error from "components/Error";

import RoutingPage from "./RoutingPage";

import { UnwrappedQuestionRoutingRoute } from "./";

describe("Question Routing Route", () => {
  let props;
  beforeEach(() => {
    props = {
      loading: false,
      data: undefined,
      match: {
        params: {
          questionnaireId: "1",
        },
      },
    };
  });

  it("should render a loading icon when loading", () => {
    const wrapper = shallow(
      <UnwrappedQuestionRoutingRoute {...props} loading />
    );
    expect(wrapper.find(Loading).exists()).toBe(true);
  });

  it("should show an error when there is a server error", () => {
    const wrapper = shallow(
      <UnwrappedQuestionRoutingRoute {...props} error={{ message: "Oh no" }} />
    );
    expect(wrapper.find(Error).exists()).toBe(true);
  });

  it("should render an error when there is no data", () => {
    const wrapper = shallow(
      <UnwrappedQuestionRoutingRoute {...props} data={undefined} />
    );
    expect(wrapper.find(Error).exists()).toBe(true);
  });

  it("should render the RoutingPage when data is loaded", () => {
    const page = {
      id: "1",
      position: 1,
      folder: {
        id: 1,
        position: 1,
        pages: [
          {
            id: "Page 1",
            displayName: "Page 1",
            position: 1,
            answers: [
              {
                id: "Percentage 1",
                displayName: "Percentage 1",
                type: "Percentage",
                properties: {},
              },
            ],
          },
        ],
      },
      pageType: "QuestionPage",
      displayName: "Untitled Page",
      routing: null,
      section: {
        folders: [],
        id: "1",
        position: 1,
        questionnaire: {
          id: "1",
        },
      },
      validationErrorInfo: {
        id: "1",
        errors: [],
        totalCount: 0,
      },
    };
    const wrapper = shallow(
      <UnwrappedQuestionRoutingRoute
        {...props}
        data={{
          page,
        }}
      />
    );
    expect(wrapper.find(RoutingPage).exists()).toBe(true);
    expect(wrapper.find(RoutingPage).props()).toMatchObject({
      page: page,
    });
  });

  it("should redirect if the pageType is not valid", () => {
    const page = {
      id: "1",
      position: 1,
      folder: {
        id: 1,
        position: 1,
        pages: [
          {
            id: "Page 1",
            displayName: "Page 1",
            position: 1,
            answers: [
              {
                id: "Percentage 1",
                displayName: "Percentage 1",
                type: "Percentage",
                properties: {},
              },
            ],
          },
        ],
      },
      pageType: "NoRoutingHere",
      displayName: "Untitled Page",
      routing: null,
      section: {
        folders: [],
        id: "1",
        position: 1,
        questionnaire: {
          id: "1",
        },
      },
      validationErrorInfo: {
        id: "1",
        errors: [],
        totalCount: 0,
      },
    };
    const wrapper = shallow(
      <UnwrappedQuestionRoutingRoute
        {...props}
        data={{
          page,
        }}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });
});
