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
    };

    me = {
      id: "123",
      displayName: "Raymond Holt",
      email: "RaymondHolt@TheNineNine.com",
      picture: "http://img.com/avatar.jpg",
      admin: true,
    };
  });

  it("should disable preview tab when section has no introduction title or introduction content", () => {
    const { getByTestId } = render(
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
    expect(
      getByTestId("tabs-nav").querySelector(`a[data-test="preview"]`)
    ).toBeFalsy();
    expect(
      getByTestId("tabs-nav").querySelector(`span[data-test="preview"]`)
    ).toBeTruthy();
    expect(getByTestId("preview")).toBeInTheDocument();
  });

  it("should enable preview tab when section has introduction title", () => {
    section.introductionTitle = "Test";
    const { getByTestId } = render(
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
    expect(
      getByTestId("tabs-nav").querySelector(`a[data-test="preview"]`)
    ).toBeTruthy();
    expect(
      getByTestId("tabs-nav").querySelector(`span[data-test="preview"]`)
    ).toBeFalsy();
    expect(getByTestId("preview")).toBeInTheDocument();
  });

  it("should enable preview tab when section has introduction content", () => {
    section.introductionContent = "Test";
    const { getByTestId } = render(
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
    expect(
      getByTestId("tabs-nav").querySelector(`a[data-test="preview"]`)
    ).toBeTruthy();
    expect(
      getByTestId("tabs-nav").querySelector(`span[data-test="preview"]`)
    ).toBeFalsy();
    expect(getByTestId("preview")).toBeInTheDocument();
  });
});
