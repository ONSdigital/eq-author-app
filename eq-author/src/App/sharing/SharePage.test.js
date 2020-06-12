import React from "react";
import { render, act, flushPromises } from "tests/utils/rtl";
import SharePage from "./SharePage";
import { MeContext } from "App/MeContext";
import { publishStatusSubscription } from "components/EditorLayout/Header";

jest.mock("./SharePageContent/index.js", () => {
  const ShareContent = () => <div />;
  return ShareContent;
});

const renderSharingPage = (questionnaire, props, user, mocks) => {
  return render(
    <MeContext.Provider value={{ me: user, signOut: jest.fn(), props }}>
      <SharePage {...props} />
    </MeContext.Provider>,
    {
      route: `/q/${questionnaire.id}/sharing`,
      urlParamMatcher: "/q/:questionnaireId/sharing",
      mocks,
    }
  );
};

describe("Share Page", () => {
  let questionnaire, props, user, mocks;

  beforeEach(() => {
    questionnaire = {
      id: "1",
      isPublic: true,
    };
    props = {
      match: { params: { modifier: "", questionnaireId: questionnaire.id } },
    };
    user = {
      id: "2",
      displayName: "TestName",
      email: "TEAmail@mail.com",
      picture: "",
      admin: true,
      name: "T",
      __typename: "User",
    };
    mocks = [
      {
        request: {
          query: publishStatusSubscription,
          variables: { id: questionnaire.id },
        },
        result: () => ({
          data: {
            publishStatusUpdated: {
              id: questionnaire.id,
              publishStatus: "Unpublished",
              __typename: "Questionnaire",
            },
          },
        }),
      },
    ];
  });

  it("should have correct title", () => {
    const { getByText } = renderSharingPage(questionnaire, props, user, mocks);

    expect(getByText("Sharing")).toBeTruthy();
  });

  it("should have correct scroll pane", () => {
    const { getByTestId } = renderSharingPage(
      questionnaire,
      props,
      user,
      mocks
    );

    expect(getByTestId("sharing-page-content")).toBeTruthy();
  });

  afterEach(async () => {
    await act(async () => {
      await flushPromises();
    });
  });
});
