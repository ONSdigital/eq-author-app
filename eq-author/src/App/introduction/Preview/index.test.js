import React from "react";
import { render } from "tests/utils/rtl";

import { MeContext } from "App/MeContext";
import { publishStatusSubscription } from "components/EditorLayout/Header";

import { useQuery } from "@apollo/react-hooks";

import Preview from ".";

jest.mock("@apollo/react-hooks", () => ({
  ...jest.requireActual("@apollo/react-hooks"),
  useQuery: jest.fn(),
}));

useQuery.mockImplementation(() => ({
  loading: false,
  error: false,
  data: {
    introduction: {
      id: "1",
      title: "foo",
      description: "<p>bar</p>",
      additionalGuidancePanel: "",
      additionalGuidancePanelSwitch: false,
      secondaryTitle: "secondaryTitle",
      secondaryDescription: "<p>secondaryDescription</p>",
      collapsibles: [],
      tertiaryTitle: "tertiaryTitle",
      tertiaryDescription: "tertiaryDescription",
      contactDetailsPhoneNumber: "0300 1234 931",
      contactDetailsEmailAddress: "surveys@ons.gov.uk",
    },
  },
}));

const questionnaire = {
  id: "questionnaire-1",
  title: "Test questionnaire",
  introduction: {
    id: "1",
    title: "foo",
    description: "<p>bar</p>",
    additionalGuidancePanel: "",
    additionalGuidancePanelSwitch: false,
    secondaryTitle: "secondaryTitle",
    secondaryDescription: "<p>secondaryDescription</p>",
    collapsibles: [],
    tertiaryTitle: "tertiaryTitle",
    tertiaryDescription: "tertiaryDescription",
    contactDetailsPhoneNumber: "0300 1234 931",
    contactDetailsEmailAddress: "surveys@ons.gov.uk",
  },
};

const me = {
  id: "me",
  name: "test",
};

const mocks = [
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

const renderIntroductionPreviewPage = (match) => {
  return render(
    <MeContext.Provider value={{ me }}>
      <Preview match={match} />
    </MeContext.Provider>,
    {
      route: `/q/${questionnaire.id}/introduction/${questionnaire.introduction.id}/preview`,
      urlParamMatcher:
        "/q/:questionnaireId/introduction/:introductionId/preview",
      mocks,
    }
  );
};

describe("Introduction Preview", () => {
  let props;
  beforeEach(() => {
    props = {
      loading: false,
      introduction: {
        id: "1",
        title: "foo",
        description: "<p>bar</p>",
        additionalGuidancePanel: "",
        additionalGuidancePanelSwitch: false,
        secondaryTitle: "secondaryTitle",
        secondaryDescription: "<p>secondaryDescription</p>",
        collapsibles: [],
        tertiaryTitle: "tertiaryTitle",
        tertiaryDescription: "tertiaryDescription",
        contactDetailsPhoneNumber: "0300 1234 931",
        contactDetailsEmailAddress: "surveys@ons.gov.uk",
      },
      match: {
        params: {
          questionnaireId: "1",
          introductionId: "1",
        },
      },
    };
  });

  it("should show loading when loading", () => {
    useQuery.mockImplementationOnce(() => ({
      loading: true,
    }));
    const { getByTestId } = renderIntroductionPreviewPage(props.match);
    expect(getByTestId("loading")).toBeInTheDocument();
  });

  it("should show error when there is an error", () => {
    useQuery.mockImplementationOnce(() => ({
      error: true,
    }));
    const { getByTestId } = renderIntroductionPreviewPage(props.match);
    expect(getByTestId("error")).toBeInTheDocument();
  });

  it("should show error when there is no data", () => {
    useQuery.mockImplementationOnce(() => ({
      data: {},
    }));
    const { getByTestId } = renderIntroductionPreviewPage(props.match);
    expect(getByTestId("error")).toBeInTheDocument();
  });

  it("should show introduction preview", () => {
    const { getByTestId } = renderIntroductionPreviewPage(props.match);
    expect(getByTestId("introduction-preview-container")).toBeInTheDocument();
  });
});
