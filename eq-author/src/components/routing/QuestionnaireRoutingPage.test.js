import React from "react";
import { mount } from "enzyme";
import QuestionnaireRoutingRoute, {
  ROUTING_QUERY
} from "./QuestionnaireRoutingPage";
import TestProvider from "tests/utils/TestProvider";
import { buildSectionPath } from "utils/UrlUtils";
import flushPromises from "tests/utils/flushPromises";
import createRouterContext from "react-router-test-context";
import PropTypes from "prop-types";

describe("QuestionnaireRoutingPage", () => {
  let store, match, context, childContextTypes;

  beforeEach(() => {
    childContextTypes = { router: PropTypes.object };

    match = {
      params: { questionnaireId: "1", sectionId: "2", pageId: "3" }
    };

    store = {
      getState: jest.fn(() => ({
        toasts: {},
        saving: {
          apiDownError: false
        }
      })),
      subscribe: jest.fn(),
      dispatch: jest.fn()
    };

    context = createRouterContext({
      location: { pathname: buildSectionPath(match.params) },
      match
    });
  });

  describe("data fetching", () => {
    const render = mocks =>
      mount(
        <TestProvider reduxProps={{ store }} apolloProps={{ mocks }}>
          <QuestionnaireRoutingRoute match={match} />
        </TestProvider>,
        { context, childContextTypes }
      );

    it("should show loading spinner while request in flight", () => {
      const mock = {
        request: {
          query: ROUTING_QUERY,
          variables: match.params
        },
        result: {
          data: {
            questionnaire: {
              __typename: "Questionnaire",
              id: "1",
              title: "foo",
              sections: []
            },
            currentPage: {
              __typename: "QuestionPage",
              id: "3",
              displayName: "hello world",
              routingRuleSet: null,
              answers: []
            },
            availableRoutingDestinations: {
              __typename: "AvailableRoutingDestinations",
              logicalDestinations: [],
              questionPages: [],
              sections: []
            }
          }
        }
      };

      const wrapper = render([mock]);
      expect(wrapper.find(`[data-test="loading"]`).exists()).toBe(true);
      expect(wrapper.find(`[data-test="routing-editor"]`).exists()).toBe(false);
    });

    it("should render the editor once loaded", () => {
      const mock = {
        request: {
          query: ROUTING_QUERY,
          variables: match.params
        },
        result: {
          data: {
            questionnaire: {
              __typename: "Questionnaire",
              id: "1",
              title: "foo",
              sections: []
            },
            currentPage: {
              __typename: "QuestionPage",
              id: "3",
              displayName: "hello world",
              routingRuleSet: null,
              answers: []
            },
            availableRoutingDestinations: {
              __typename: "AvailableRoutingDestinations",
              logicalDestinations: [],
              questionPages: [],
              sections: []
            }
          }
        }
      };

      const wrapper = render([mock, mock]);

      return flushPromises().then(() => {
        wrapper.update();
        expect(wrapper.find(`[data-test="loading"]`).exists()).toBe(false);
        expect(wrapper.find(`[data-test="routing-editor"]`).exists()).toBe(
          true
        );
      });
    });

    it("should render error if problem with request", () => {
      const mock = {
        request: {
          query: ROUTING_QUERY,
          variables: match.params
        },
        error: new Error("something went wrong")
      };

      const wrapper = render([mock]);

      return flushPromises().then(() => {
        wrapper.update();
        expect(wrapper.find(`[data-test="loading"]`).exists()).toBe(false);
        expect(wrapper.find(`[data-test="routing-editor"]`).exists()).toBe(
          false
        );
        expect(wrapper.find(`[data-test="error"]`).exists()).toBe(true);
      });
    });
  });
});
