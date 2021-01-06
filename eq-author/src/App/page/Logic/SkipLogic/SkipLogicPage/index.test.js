import React from "react";
import { render, screen } from "tests/utils/rtl";
import SkipLogicPage from "./";

jest.mock("../mutations.js", () => ({
  useCreateSkipCondition: jest.fn(),
}));

describe("Skip Condition Page", () => {
  const defaultPage = {
    id: "1",
    displayName: "test",
    position: 0,
    section: {
      position: 0,
    },
    skipConditions: null,
    validationErrorInfo: { id: "1", errors: [], totalCount: 0 },
  };

  it("should show the no skip condition message when there is no skip conditions for a page", () => {
    render(<SkipLogicPage page={defaultPage} />);
    expect(screen.getByTestId("skip-condition-set-empty-msg")).toBeTruthy();
  });

  it("should render the editor when there is a skip condition", () => {
    render(
      <SkipLogicPage
        page={{
          ...defaultPage,
          skipConditions: [{ id: "2", expressions: [] }],
        }}
      />
    );
    expect(screen.getByTestId("skip-condition-editor")).toBeTruthy();
  });
});
