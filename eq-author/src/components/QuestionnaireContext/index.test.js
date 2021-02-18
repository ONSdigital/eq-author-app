import React from "react";

import { PageContextProvider, usePage } from "./";
import { render, screen } from "tests/utils/rtl";

const PageContextClient = () => {
  const pageContext = usePage();
  return <h1>{pageContext?.id}</h1>;
};

describe("QuestionnaireContext", () => {
  describe("PageContextProvider", () => {
    it("should pass on value prop to context", () => {
      const pageId = "42";
      render(
        <PageContextProvider value={{ id: pageId }}>
          <PageContextClient />
        </PageContextProvider>
      );
      expect(screen.getByText(pageId)).toBeTruthy();
    });
  });
});
