import React from "react";

import { render } from "tests/utils/rtl";

import Logic from ".";

jest.mock("@apollo/react-hooks", () => ({
  useSubscription: () => [jest.fn()],
}));

describe("Logic page", () => {
  let section = {};
  beforeEach(() => {
    section = {
      questionnaire: {
        id: "1",
        hub: true,
      },
      id: "1",
      position: 1,
      introductionTitle: "Test",
      introductionContent: "Test",
    };
  });

  it("should enable logic tab when section has an introduction title", () => {
    const { debug } = render(
      <Logic match={{ sectionId: section.id }} section={section}>
        <p>Test</p>
      </Logic>
    );
    debug();
  });
});
