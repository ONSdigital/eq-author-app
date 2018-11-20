import React from "react";
import mountWithRouter from "tests/utils/mountWithRouter";
import { UnwrappedTabs, Tab, activeClassName } from "components/Tabs";

let wrapper;

const match = {
  params: { questionnaireId: "1", sectionId: "2", pageId: "3" }
};

describe("components/Tabs", () => {
  beforeEach(() => {
    wrapper = mountWithRouter(
      <UnwrappedTabs match={match}>Tab Content</UnwrappedTabs>
    );
  });

  describe("when no pageId", () => {
    it("should render section link", () => {
      const params = { questionnaireId: "123", sectionId: "888", pageId: "" };

      wrapper.setProps({
        match: {
          ...match,
          params
        }
      });

      expect(wrapper).toMatchSnapshot();
    });
  });

  describe("when pageId present", () => {
    it("should render page link", () => {
      expect(wrapper).toMatchSnapshot();
    });
  });

  it("should link to confirmation and disable routing when confirmation id is present", () => {
    const params = {
      questionnaireId: "123",
      sectionId: "888",
      pageId: "123",
      confirmationId: "444"
    };

    wrapper.setProps({
      match: {
        ...match,
        params
      }
    });

    expect(wrapper).toMatchSnapshot();
  });

  describe("when rendering Tabs", () => {
    it("should provide the activeClassName", () => {
      wrapper.find(Tab).forEach(node => {
        expect(node.props()).toHaveProperty("activeClassName", activeClassName);
      });
    });
  });
});
