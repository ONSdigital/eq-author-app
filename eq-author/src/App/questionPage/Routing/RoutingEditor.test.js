import React from "react";
import { shallow } from "enzyme";
import RoutingEditor from "App/questionPage/Routing/RoutingEditor";

const createWrapper = (props, render = shallow) => {
  return render(<RoutingEditor {...props} />);
};

describe("RoutingEditor", () => {
  let wrapper, props;

  const answer = {
    id: "1",
    type: "Number"
  };

  const page = {
    id: "1",
    answers: [answer]
  };

  const section = {
    id: "1",
    pages: [page]
  };

  const questionnaire = {
    id: "1",
    sections: [section]
  };

  const routingRule = {
    id: "1",
    operation: "And",
    conditions: [],
    goto: null
  };

  const routingRuleSet = {
    id: "1",
    routingRules: [],
    questionPage: page,
    else: null
  };

  const availableRoutingDestinations = {
    questionPages: [
      {
        id: "2",
        __typename: "QuestionPage",
        section: {
          id: "1"
        }
      },
      {
        id: "3",
        __typename: "QuestionPage",
        section: {
          id: "1"
        }
      }
    ],
    sections: [
      {
        id: "2",
        __typename: "Section"
      },
      {
        id: "3",
        __typename: "Section"
      }
    ]
  };

  const pageWithRoutingRuleSet = {
    ...page,
    routingRuleSet
  };

  const pageWithRoutingRules = {
    ...pageWithRoutingRuleSet,
    routingRuleSet: {
      id: "2",
      routingRules: [routingRule]
    }
  };

  beforeEach(() => {
    props = {
      questionnaire,
      currentPage: page,
      onAddRoutingRuleSet: jest.fn(),
      onUpdateRoutingRuleSet: jest.fn(),
      onAddRoutingRule: jest.fn(),
      onUpdateRoutingRule: jest.fn(),
      onDeleteRoutingRule: jest.fn(),
      onAddRoutingCondition: jest.fn(),
      onUpdateRoutingCondition: jest.fn(),
      onDeleteRoutingCondition: jest.fn(),
      onToggleConditionOption: jest.fn(),
      onDeleteRoutingRuleSet: jest.fn(),
      availableRoutingDestinations,
      match: {
        params: {
          questionnaireId: questionnaire.id,
          sectionId: section.id,
          pageId: page.id
        }
      }
    };

    wrapper = createWrapper(props);
  });

  describe("when not Routing rule set", () => {
    it("should render when no Routing rule set", () => {
      expect(wrapper).toMatchSnapshot();
    });

    it("should allow a rule set to be added", () => {
      wrapper
        .find("[data-test='routing-rule-set-empty-msg']")
        .simulate("addRuleSet");
      expect(props.onAddRoutingRuleSet).toHaveBeenCalled();
    });
  });

  describe("Routing rule set", () => {
    beforeEach(() => {
      const withRoutingRuleSet = {
        ...props,
        currentPage: pageWithRoutingRuleSet,
        availableRoutingDestinations
      };

      wrapper = createWrapper(withRoutingRuleSet);
    });

    it("should render Routing rule set", () => {
      expect(wrapper).toMatchSnapshot();
    });

    it("should handle changing else destination", () => {
      const destination = {
        id: "26",
        else: {
          absoluteDestination: {
            destinationType: "QuestionPage",
            destinationId: "19"
          }
        }
      };

      wrapper.find("RoutingRuleSet").simulate("elseChange", destination);
      expect(props.onUpdateRoutingRuleSet).toHaveBeenCalledWith(destination);
    });
  });

  describe("Routing rules", () => {
    beforeEach(() => {
      const withRoutingRules = {
        ...props,
        currentPage: pageWithRoutingRules
      };

      wrapper = createWrapper(withRoutingRules);
    });

    it("should render Routing rules", () => {
      expect(wrapper).toMatchSnapshot();
    });

    it("should handle deleting a Routing rule", () => {
      const currentPage = {
        ...pageWithRoutingRuleSet,
        routingRuleSet: {
          ...pageWithRoutingRuleSet.routingRuleSet,
          routingRules: [routingRule, routingRule]
        }
      };
      wrapper = createWrapper({
        ...props,
        currentPage
      });

      wrapper.find("RoutingRuleSet").simulate("deleteRule", routingRule);
      expect(props.onDeleteRoutingRule).toHaveBeenCalledWith(
        currentPage.routingRuleSet.id,
        routingRule.id
      );
    });

    it("delete Routing rule set when last rule deleted", () => {
      wrapper.find("RoutingRuleSet").simulate("deleteRule", routingRule);
      expect(props.onDeleteRoutingRuleSet).toHaveBeenCalledWith(
        pageWithRoutingRules.routingRuleSet.id,
        pageWithRoutingRules.id
      );
    });

    it("should handle changing the THEN destination", () => {
      const destination = {
        id: "26",
        goto: {
          absoluteDestination: {
            destinationType: "QuestionPage",
            destinationId: "19"
          }
        }
      };

      wrapper.find("RoutingRuleSet").simulate("thenChange", destination);
      expect(props.onUpdateRoutingRule).toHaveBeenCalledWith(destination);
    });

    it("should handle adding a Routing condition", () => {
      wrapper
        .find("RoutingRuleSet")
        .simulate("addRoutingCondition", routingRule);

      expect(props.onAddRoutingCondition).toHaveBeenCalledWith(
        routingRule.id,
        page.answers[0].id
      );
    });
  });
});
