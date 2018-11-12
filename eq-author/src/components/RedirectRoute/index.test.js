import React from "react";
import { mount } from "enzyme";
import RedirectRoute from "./";
import createRouterContext from "react-router-test-context";
import PropTypes from "prop-types";

describe("RedirectRoute", () => {
  const childContextTypes = { router: PropTypes.object };
  const createContext = pathname =>
    createRouterContext({ location: { pathname } });

  describe("when route matches `to` prop", () => {
    it("redirects if match", () => {
      const wrapper = mount(<RedirectRoute from="/a" to="/b" />, {
        context: createContext("/a"),
        childContextTypes
      });

      expect(wrapper.find("Redirect").prop("to")).toBe("/b");
    });

    it("redirects along with route params", () => {
      const wrapper = mount(<RedirectRoute from="/a/:id" to="/b/:id" />, {
        context: createContext("/a/123"),
        childContextTypes
      });

      expect(wrapper.find("Redirect").prop("to")).toBe("/b/123");
    });
  });

  describe("when route doesn't match", () => {
    it("doesn't redirect", () => {
      const wrapper = mount(<RedirectRoute from="/a" to="/b" />, {
        context: createContext("/c"),
        childContextTypes
      });

      expect(wrapper.find("Redirect")).toHaveLength(0);
    });
  });
});
