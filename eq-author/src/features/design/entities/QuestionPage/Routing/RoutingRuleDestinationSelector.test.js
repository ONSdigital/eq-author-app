import React from "react";
import { shallow, mount } from "enzyme";

import RoutingRuleDestinationSelector from "./RoutingRuleDestinationSelector";
import sections from "./mockstate";

let wrapper, props;

describe("components/RoutingRuleDestinationSelector", () => {
  beforeEach(() => {
    props = {
      onChange: jest.fn(),
      value: {
        logicalDestination: {
          destinationType: "EndOfQuestionnaire"
        }
      },
      label: "Test",
      id: "test-select",
      destinations: {
        questionPages: [
          {
            id: "1",
            displayName: "page 1",
            title: "page 1",
            __typename: "QuestionPage"
          },
          {
            id: "2",
            displayName: "page 2",
            title: "page 2",
            __typename: "QuestionPage"
          }
        ],
        sections: [
          {
            id: "3",
            displayName: "section 1",
            title: "section 1",
            __typename: "Section"
          },
          {
            id: "4",
            displayName: "section 2",
            title: "section 2",
            __typename: "Section"
          }
        ]
      },
      sections
    };

    wrapper = shallow(<RoutingRuleDestinationSelector {...props} />);
  });

  it("should render", () => {
    expect(wrapper).toMatchSnapshot();
  });

  it("should allow change of goto select", () => {
    wrapper = mount(<RoutingRuleDestinationSelector {...props} />);
    wrapper.find(`select[data-test="result-selector"]`).simulate("change");

    expect(props.onChange).toHaveBeenCalledWith({
      absoluteDestination: {
        destinationId: "1",
        destinationType: "QuestionPage"
      }
    });
  });

  it("should pass disabled prop onto select field", () => {
    wrapper.setProps({ disabled: true });
    const select = wrapper.find('[data-test="result-selector"]');
    expect(select.props().disabled).toBe(true);
  });
});
