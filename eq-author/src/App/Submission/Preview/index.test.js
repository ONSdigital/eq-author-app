import React from "react";
import { render } from "tests/utils/rtl";
import { useQuery } from "@apollo/react-hooks";
import Theme from "contexts/themeContext";

import SubmissionPreview from ".";
import { MeContext } from "App/MeContext";

const questionnaire = {
  id: "questionnaire-1",
  title: "Test questionnaire",
  submission: {
    id: "submission-1",
    furtherContent: "<p>Test</p>",
    viewPrintAnswers: true,
    emailConfirmation: true,
    feedback: true,
  },
};

jest.mock("@apollo/react-hooks", () => ({
  ...jest.requireActual("@apollo/react-hooks"),
  useQuery: jest.fn(),
  useSubscription: jest.fn(() => jest.fn()),
}));

useQuery.mockImplementation(() => ({
  loading: false,
  error: false,
  data: { questionnaire, comments: [] },
}));

const match = {
  params: {
    questionnaireId: questionnaire.id,
  },
};

const history = { push: jest.fn() };
const me = {
  id: "me",
  name: "test",
};

const renderSubmissionPreviewPage = () => {
  return render(
    <MeContext.Provider value={{ me }}>
      <Theme>
        <SubmissionPreview match={match} history={history} loading={false} />
      </Theme>
    </MeContext.Provider>,
    {
      route: `/q/${questionnaire.id}/submission/${questionnaire.submission.id}/preview`,
      urlParamMatcher: "/q/:questionnaireId/submission/:submissionId/preview",
    }
  );
};

describe("Submission preview page", () => {
  it("should render", () => {
    const { getByText } = renderSubmissionPreviewPage();
    expect(
      getByText(`Thank you for completing the ${questionnaire.title}`)
    ).toBeVisible();
  });

  it("should display error page if there is an error", () => {
    useQuery.mockImplementationOnce(() => ({
      loading: false,
      error: true,
      data: { questionnaire, comments: [] },
    }));
    const { getByTestId } = renderSubmissionPreviewPage();

    expect(getByTestId("error")).toBeVisible();
  });

  it("should display error page if there is no data returned", () => {
    useQuery.mockImplementationOnce(() => ({
      loading: false,
      error: false,
      data: undefined,
    }));
    const { getByTestId } = renderSubmissionPreviewPage();

    expect(getByTestId("error")).toBeVisible();
  });

  it("should display loading page when loading", () => {
    useQuery.mockImplementationOnce(() => ({
      loading: true,
      error: false,
      data: { questionnaire, comments: [] },
    }));
    const { getByTestId } = renderSubmissionPreviewPage();

    expect(getByTestId("loading")).toBeVisible();
  });
});
