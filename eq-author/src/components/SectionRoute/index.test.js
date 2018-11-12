import React from "react";
import { mount } from "enzyme";
import SectionRoute, { UnwrappedSectionRoute, SECTION_QUERY } from "./";

import TestProvider from "tests/utils/TestProvider";
import { buildSectionPath } from "utils/UrlUtils";
import flushPromises from "tests/utils/flushPromises";
import createRouterContext from "react-router-test-context";
import PropTypes from "prop-types";
import { byTestAttr } from "tests/utils/selectors";

import GET_QUESTIONNAIRE_QUERY from "graphql/getQuestionnaire.graphql";

const moveSectionMock = {
  request: {
    query: GET_QUESTIONNAIRE_QUERY,
    variables: {
      id: "1"
    }
  },
  result: {
    data: {
      questionnaire: {
        id: "1",
        title: "",
        description: "",
        surveyId: "1",
        theme: "foo",
        legalBasis: "",
        navigation: true,
        summary: "",
        __typename: "Questionnaire",
        sections: [
          {
            __typename: "Section",
            id: "2",
            title: "foo",
            alias: "foo-alias",
            introductionTitle: null,
            introductionContent: null,
            introductionEnabled: false,
            displayName: "foo",
            position: 0,
            pages: [
              {
                __typename: "QuestionPage",
                id: "3",
                title: "bar",
                alias: "bar alias",
                displayName: "bar",
                position: 0
              },
              {
                __typename: "QuestionPage",
                id: "4",
                title: "blah",
                alias: "blah alias",
                displayName: "blah",
                position: 1
              }
            ],
            questionnaire: {
              __typename: "Questionnaire",
              id: "1",
              questionnaireInfo: {
                __typename: "QuestionnaireInfo",
                totalSectionCount: 1
              }
            }
          },
          {
            __typename: "Section",
            id: "3",
            title: "foo",
            alias: "foo-alias",
            displayName: "foo",
            introductionTitle: null,
            introductionContent: null,
            introductionEnabled: false,
            position: 1,
            pages: [
              {
                __typename: "QuestionPage",
                id: "5",
                title: "bar",
                alias: "bar alias",
                displayName: "bar",
                position: 0
              },
              {
                __typename: "QuestionPage",
                id: "6",
                title: "blah",
                alias: "blah alias",
                displayName: "blah",
                position: 1
              }
            ],
            questionnaire: {
              __typename: "Questionnaire",
              id: "1",
              questionnaireInfo: {
                __typename: "QuestionnaireInfo",
                totalSectionCount: 1
              }
            }
          }
        ]
      }
    }
  }
};

describe("SectionRoute", () => {
  let store, match, context, childContextTypes;

  beforeEach(() => {
    childContextTypes = { router: PropTypes.object };

    match = {
      params: { questionnaireId: "1", sectionId: "2" }
    };

    store = {
      getState: jest.fn(() => ({
        toasts: {},
        saving: { apiDownError: false }
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
          <SectionRoute match={match} />
        </TestProvider>,
        { context, childContextTypes }
      );

    it("should show loading spinner while request in flight", () => {
      const mock = {
        request: {
          query: SECTION_QUERY,
          variables: {
            id: "2"
          }
        },
        result: {
          data: {
            section: {
              __typename: "Section",
              id: "1",
              title: "foo",
              alias: "foo-alias",
              displayName: "foo",
              description: "bar",
              introductionTitle: null,
              introductionContent: null,
              introductionEnabled: false,
              position: 0,
              questionnaire: {
                __typename: "Questionnaire",
                id: "1",
                questionnaireInfo: {
                  __typename: "QuestionnaireInfo",
                  totalSectionCount: 1
                }
              }
            }
          }
        }
      };

      const wrapper = render([mock, moveSectionMock]);
      expect(wrapper.find(`[data-test="loading"]`).exists()).toBe(true);
      expect(wrapper.find(`[data-test="section-editor"]`).exists()).toBe(false);
    });

    it("should render the editor once loaded", () => {
      const mock = {
        request: {
          query: SECTION_QUERY,
          variables: {
            id: "2"
          }
        },
        result: {
          data: {
            section: {
              __typename: "Section",
              id: "2",
              title: "foo",
              alias: "foo-alias",
              displayName: "foo",
              description: "bar",
              introductionTitle: null,
              introductionContent: null,
              introductionEnabled: false,
              position: 0,
              questionnaire: {
                __typename: "Questionnaire",
                id: "1",
                questionnaireInfo: {
                  __typename: "QuestionnaireInfo",
                  totalSectionCount: 1
                }
              }
            }
          }
        }
      };

      const wrapper = render([mock, mock, moveSectionMock, moveSectionMock]);

      return flushPromises().then(() => {
        wrapper.update();
        expect(wrapper.find(`[data-test="loading"]`).exists()).toBe(false);
        expect(wrapper.find(`[data-test="section-editor"]`).exists()).toBe(
          true
        );
      });
    });

    it("should render error if problem with request", () => {
      const mock = {
        request: {
          query: SECTION_QUERY
        },
        error: new Error("something went wrong")
      };

      const wrapper = render([mock]);

      return flushPromises().then(() => {
        wrapper.update();
        expect(wrapper.find(`[data-test="loading"]`).exists()).toBe(false);
        expect(wrapper.find(`[data-test="section-editor"]`).exists()).toBe(
          false
        );
        expect(wrapper.find(`[data-test="error"]`).exists()).toBe(true);
      });
    });

    it("should render error if no section returned", () => {
      const mock = {
        request: {
          query: SECTION_QUERY
        },
        result: {
          data: {
            section: null
          }
        }
      };

      const wrapper = render([mock]);

      return flushPromises().then(() => {
        wrapper.update();
        expect(wrapper.find(`[data-test="loading"]`).exists()).toBe(false);
        expect(wrapper.find(`[data-test="section-editor"]`).exists()).toBe(
          false
        );
        expect(wrapper.find(`[data-test="error"]`).exists()).toBe(true);
      });
    });
  });

  describe("behaviour", () => {
    const render = (props = {}) =>
      mount(
        <TestProvider
          reduxProps={{ store }}
          apolloProps={{ mocks: [moveSectionMock] }}
        >
          <UnwrappedSectionRoute {...props} />
        </TestProvider>,
        { context, childContextTypes }
      );

    it("ensures confirmation before delete", () => {
      const data = {
        section: {
          id: "1",
          title: "foo",
          alias: "foo alias",
          description: "bar",
          introductionTitle: null,
          introductionContent: null,
          introductionEnabled: false
        }
      };

      const mockHandlers = {
        onUpdateSection: jest.fn(),
        onDeleteSection: jest.fn(),
        onDuplicateSection: jest.fn(),
        onAddPage: jest.fn(),
        onMoveSection: jest.fn()
      };

      const wrapper = render({
        loading: false,
        match,
        data,
        ...mockHandlers
      });

      wrapper
        .find(`[data-test="btn-delete"]`)
        .first()
        .simulate("click");

      wrapper
        .find(`[data-test="btn-delete-modal"]`)
        .first()
        .simulate("click");

      expect(mockHandlers.onDeleteSection).toHaveBeenCalledWith("2");
    });

    it("allows new pages to be added", () => {
      const data = {
        section: {
          id: "1",
          title: "foo",
          alias: "foo alias",
          description: "bar",
          introductionTitle: null,
          introductionContent: null,
          introductionEnabled: false
        }
      };

      const mockHandlers = {
        onUpdateSection: jest.fn(),
        onDeleteSection: jest.fn(),
        onDuplicateSection: jest.fn(),
        onAddPage: jest.fn(),
        onMoveSection: jest.fn()
      };

      const wrapper = render({
        loading: false,
        match,
        data,
        ...mockHandlers
      });

      wrapper
        .find(`[data-test="btn-add-page"]`)
        .first()
        .simulate("click");

      expect(mockHandlers.onAddPage).toHaveBeenCalledWith(
        match.params.sectionId,
        0
      );
    });

    it("should disable move section button when one section", () => {
      const data = {
        section: {
          id: "1",
          title: "foo",
          alias: "foo alias",
          displayName: "foo",
          description: "bar",
          introductionTitle: null,
          introductionContent: null,
          introductionEnabled: false,
          position: 0,
          questionnaire: {
            id: "1",
            questionnaireInfo: {
              totalSectionCount: 1
            }
          }
        }
      };

      const mockHandlers = {
        onUpdateSection: jest.fn(),
        onDeleteSection: jest.fn(),
        onDuplicateSection: jest.fn(),
        onAddPage: jest.fn(),
        onMoveSection: jest.fn()
      };

      const wrapper = render({
        loading: false,
        match,
        data,
        ...mockHandlers
      });

      expect(
        wrapper.find(`Button${byTestAttr("btn-move")}`).prop("disabled")
      ).toBe(true);
    });

    it("should enable move section button when multiple sections", () => {
      const data = {
        section: {
          id: "1",
          title: "foo",
          alias: "foo-alias",
          displayName: "foo",
          description: "bar",
          introductionTitle: null,
          introductionContent: null,
          introductionEnabled: false,
          position: 0,
          questionnaire: {
            id: "1",
            questionnaireInfo: {
              totalSectionCount: 2
            }
          }
        }
      };

      const mockHandlers = {
        onUpdateSection: jest.fn(),
        onDeleteSection: jest.fn(),
        onDuplicateSection: jest.fn(),
        onAddPage: jest.fn(),
        onMoveSection: jest.fn()
      };

      const wrapper = render({
        loading: false,
        match,
        data,
        ...mockHandlers
      });

      expect(
        wrapper.find(`Button${byTestAttr("btn-move")}`).prop("disabled")
      ).toBe(false);
    });

    it("should call onDuplicateSection with the section id and position when the duplicate button is clicked", () => {
      const data = {
        section: {
          id: "1",
          title: "foo",
          alias: "foo-alias",
          displayName: "foo",
          description: "bar",
          introductionTitle: null,
          introductionContent: null,
          introductionEnabled: false,
          position: 0,
          questionnaire: {
            id: "1",
            questionnaireInfo: {
              totalSectionCount: 2
            }
          }
        }
      };

      const mockHandlers = {
        onUpdateSection: jest.fn(),
        onDeleteSection: jest.fn(),
        onDuplicateSection: jest.fn(),
        onAddPage: jest.fn(),
        onMoveSection: jest.fn()
      };

      const wrapper = render({
        loading: false,
        match,
        data,
        ...mockHandlers
      });

      wrapper
        .find(`Button${byTestAttr("btn-duplicate-section")}`)
        .simulate("click");

      expect(mockHandlers.onDuplicateSection).toHaveBeenCalledWith({
        sectionId: data.section.id,
        position: data.section.position + 1
      });
    });
  });
});
