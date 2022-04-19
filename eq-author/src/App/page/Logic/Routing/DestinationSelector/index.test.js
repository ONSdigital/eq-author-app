import React from "react";
import { shallow } from "enzyme";

import { UnwrappedDestinationSelector } from ".";
import { byTestAttr } from "tests/utils/selectors";

let wrapper, props;

describe("components/RoutingRuleDestinationSelector", () => {
  beforeEach(() => {
    props = {
      onChange: jest.fn(),
      value: {
        logicalDestination: {
          destinationType: "NextPage",
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

    wrapper = shallow(<UnwrappedDestinationSelector {...props} />);
  });

  it("should render", () => {
    expect(wrapper).toMatchSnapshot();
  });

  it("should handle change for section destinations", () => {
    wrapper
      .find(byTestAttr("routing-destination-content-picker"))
      .simulate("submit", {
        value: {
          id: 1,
          __typename: "Section",
        },
      });

    expect(props.onChange).toHaveBeenCalledWith({
      sectionId: 1,
    });
  });

  it("should handle change for page destinations", () => {
    wrapper
      .find(byTestAttr("routing-destination-content-picker"))
      .simulate("submit", {
        value: {
          id: 1,
          __typename: "QuestionPage",
        },
      });

    expect(props.onChange).toHaveBeenCalledWith({
      pageId: 1,
    });
  });

  it("should handle change for logicalDestination", () => {
    wrapper
      .find(byTestAttr("routing-destination-content-picker"))
      .simulate("submit", {
        value: {
          id: "SomeLogicalDestination",
        },
      });

    expect(props.onChange).toHaveBeenCalledWith({
      logical: "SomeLogicalDestination",
    });
  });
});
