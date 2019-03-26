import React from "react";
import { shallow } from "enzyme";
import { UnwrappedRoutingDestinationContentPicker } from "./RoutingDestinationContentPicker";

const render = props =>
  shallow(<UnwrappedRoutingDestinationContentPicker {...props} />);

describe("RoutingDestinationContentPicker", () => {
  let wrapper, props;
  beforeEach(() => {
    props = {
      data: {
        page: {
          id: "5",
          availableRoutingDestinations: {
            pages: [],
            sections: [],
            logicalDestinations: [],
          },
        },
      },
      onSubmit: jest.fn(),
      selected: {
        logical: "NextPage",
      },
      loading: false,
    };

    wrapper = render(props);
  });

  it("should render", () => {
    expect(wrapper).toMatchSnapshot();
  });

  describe("displayName", () => {
    it("should correctly render page display name", () => {
      const selected = {
        page: {
          id: "1",
          displayName: "page name",
        },
      };
      wrapper = render({ ...props, selected });
      expect(wrapper).toMatchSnapshot();
    });

    it("should correctly render section display name", () => {
      const selected = {
        section: {
          id: "1",
          displayName: "section name",
        },
      };
      wrapper = render({ ...props, selected });
      expect(wrapper).toMatchSnapshot();
    });

    it("should correctly render logicalDestination EndOfQuestionnaire", () => {
      const selected = {
        logical: "EndOfQuestionnaire",
      };
      wrapper = render({ ...props, selected });
      expect(wrapper).toMatchSnapshot();
    });

    it("should render with no display name if loading and next page selected", () => {
      wrapper = render({ ...props, loading: true });
      expect(wrapper).toMatchSnapshot();
    });

    it("should render first page display name when logical destination is next page", () => {
      props.selected = {
        logical: "NextPage",
      };
      props.data.page.availableRoutingDestinations.pages = [
        { id: "1", displayName: "page name" },
      ];
      wrapper = render(props);
      expect(wrapper).toMatchSnapshot();
    });

    it("should render first page display name when logical destination is next page and no pages", () => {
      props.selected = {
        logical: "NextPage",
      };
      props.data.page.availableRoutingDestinations.sections = [
        { id: "1", displayName: "section name" },
      ];
      wrapper = render(props);
      expect(wrapper).toMatchSnapshot();
    });
  });
});
