import React from "react";
import { shallow } from "enzyme";

import { UnwrappedRoutingRuleDestinationSelector } from "App/questionPage/Routing/RoutingRuleDestinationSelector";
import { byTestAttr } from "tests/utils/selectors";

let wrapper, props;

describe("components/RoutingRuleDestinationSelector", () => {
  beforeEach(() => {
    props = {
      onChange: jest.fn(),
      value: {
        logicalDestination: {
          destinationType: "EndOfQuestionnaire",
        },
      },
      label: "Test",
      id: "test-select",
      match: {
        params: {
          questionnaireId: "1",
          sectionId: "1",
          pageId: "1",
        },
      },
    };

    wrapper = shallow(<UnwrappedRoutingRuleDestinationSelector {...props} />);
  });

  it("should render", () => {
    expect(wrapper).toMatchSnapshot();
  });

  it("should handle change for absoluteDestination", () => {
    wrapper
      .find(byTestAttr("routing-destination-content-picker"))
      .simulate("submit", {
        value: {
          id: 1,
          config: {
            destination: {
              absoluteDestination: {
                destinationType: "foobar",
              },
            },
          },
        },
      });

    expect(props.onChange).toHaveBeenCalledWith({
      absoluteDestination: {
        destinationType: "foobar",
        destinationId: 1,
      },
    });
  });

  it("should handle change for logicalDestination", () => {
    wrapper
      .find(byTestAttr("routing-destination-content-picker"))
      .simulate("submit", {
        value: {
          id: 1,
          config: {
            destination: { foo: "foobar" },
          },
        },
      });

    expect(props.onChange).toHaveBeenCalledWith({ foo: "foobar" });
  });
});
