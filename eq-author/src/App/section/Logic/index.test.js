import React from "react";

import { render } from "tests/utils/rtl";

import Logic from ".";
import { MeContext } from "App/MeContext";

jest.mock("@apollo/react-hooks", () => ({
  useSubscription: () => [jest.fn()],
}));

describe("Logic page", () => {
  let section = {};
  let me = {};
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

    me = {
      id: "123",
      displayName: "Raymond Holt",
      email: "RaymondHolt@TheNineNine.com",
      picture: "http://img.com/avatar.jpg",
      admin: true,
    };
  });

  it("should enable logic tab when section has an introduction title", () => {
    const { debug } = render(
      <MeContext.Provider value={{ me }}>
        <Logic section={section}>
          <p>Test</p>
        </Logic>
      </MeContext.Provider>,
      {
        route: `/q/${section.questionnaire.id}/section/${section.id}/logic`,
        urlParamMatcher: "/q/:questionnaireId/section/:sectionId/logic",
      }
    );
    debug();
  });
});
