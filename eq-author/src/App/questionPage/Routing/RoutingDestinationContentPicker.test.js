import React from "react";
import { shallow } from "enzyme";
import { UnwrappedRoutingDestinationContentPicker } from "App/questionPage/Routing/RoutingDestinationContentPicker";

const render = props =>
  shallow(<UnwrappedRoutingDestinationContentPicker {...props} />);

describe("RoutingDestinationContentPicker", () => {
  let wrapper, props;
  beforeEach(() => {
    props = {
      path: "foobar",
      data: {},
      onSubmit: jest.fn(),
      selected: {}
    };

    wrapper = render(props);
  });

  it("should render", () => {
    expect(wrapper).toMatchSnapshot();
  });

  describe("displayName", () => {
    it("should correctly render absoluteDestination", () => {
      const selected = {
        absoluteDestination: {
          displayName: "foobar"
        }
      };
      wrapper = render({ ...props, selected });
      expect(wrapper).toMatchSnapshot();
    });

    it("should correctly render logicalDestination EndOfQuestionnaire", () => {
      const selected = {
        logicalDestination: "EndOfQuestionnaire"
      };
      wrapper = render({ ...props, selected });
      expect(wrapper).toMatchSnapshot();
    });

    it("should correctly render logicalDestination with no data", () => {
      wrapper = render({ ...props });
      expect(wrapper).toMatchSnapshot();
    });

    it("should correctly render logicalDestination with question page", () => {
      wrapper = render({
        ...props,
        selected: {
          logicalDestination: "NextPage"
        },
        data: { foobar: { questionPages: [{ displayName: "hello world" }] } }
      });
      expect(wrapper).toMatchSnapshot();
    });
  });
});
