import React from "react";
import { shallow } from "enzyme";
import { UnwrappedRoutingEditor, LABEL_ELSE_IF, LABEL_IF } from "./";
import RuleEditor from "./RuleEditor";

describe("components/RoutingRuleSet", () => {
  let defaultProps;
  beforeEach(() => {
    defaultProps = {
      routing: {
        id: "1",
        rules: [{ id: "2" }],
        else: {
          id: "4",
          logical: null,
          section: null,
          page: {
            id: "3",
            displayName: "page",
          },
          validationErrorInfo: {
            id: "test",
            totalCount: 0,
            errors: [],
          },
        },
      },
      createRule: jest.fn(),
      updateRouting: jest.fn(),
      moveRule: jest.fn(),
      onMoveUp: jest.fn(),
      onMoveDown: jest.fn(),
      canMoveUp: true,
      canMoveDown: true,
    };
  });

  it("should render children", () => {
    const wrapper = shallow(<UnwrappedRoutingEditor {...defaultProps} />);
    expect(wrapper).toMatchSnapshot();
  });

  it("should allow change of ELSE condition", () => {
    const destination = { logical: "EndOfCurrentSection" };

    const wrapper = shallow(<UnwrappedRoutingEditor {...defaultProps} />);
    wrapper.find("[data-test='select-else']").simulate("change", destination);

    expect(defaultProps.updateRouting).toHaveBeenCalledWith({
      ...defaultProps.routing,
      else: destination,
    });
  });

  it("should allow creating a rule", () => {
    const wrapper = shallow(<UnwrappedRoutingEditor {...defaultProps} />);
    wrapper.find("[data-test='btn-add-rule']").simulate("click");
    expect(defaultProps.createRule).toHaveBeenCalledWith(
      defaultProps.routing.id
    );
  });

  it("should render all subsequent rule editor titles as ELSE IF", () => {
    defaultProps.routing.rules.push({ id: "5" }, { id: "6" });
    const wrapper = shallow(<UnwrappedRoutingEditor {...defaultProps} />);
    wrapper.find(RuleEditor).forEach((ruleEditor, index) => {
      expect(ruleEditor.prop("ifLabel")).toEqual(
        index > 0 ? LABEL_ELSE_IF : LABEL_IF
      );
    });
  });
});
