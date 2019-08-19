import React from "react";
import { render } from "tests/utils/rtl";
import RedirectRoute from ".";

describe("RedirectRoute", () => {
  const renderRedirect = (from, to, options) =>
    render(<RedirectRoute from={from} to={to} />, options);

  describe("when route matches `to` prop", () => {
    it("redirects if match", () => {
      const { history } = renderRedirect("/a", "/b", { route: "/a" });
      expect(history.location.pathname).toEqual("/b");
    });

    it("redirects along with route params", () => {
      const { history } = renderRedirect("/a/:id", "/b/:id", {
        route: "/a/123",
      });

      expect(history.location.pathname).toEqual("/b/123");
    });
  });

  describe("when route doesn't match", () => {
    it("doesn't redirect", () => {
      const { history } = renderRedirect("/a", "/b/", {
        route: "/c",
      });

      expect(history.location.pathname).toEqual("/c");
    });
  });
});
