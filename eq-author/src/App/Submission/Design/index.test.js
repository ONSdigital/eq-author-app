import React from "react";
import { render } from "tests/utils/rtl";
import { useQuery } from "@apollo/react-hooks";
import Theme from "contexts/themeContext";

import SubmissionDesign from ".";

const questionnaire = {
  id: "questionnaire-1",
  submission: {
    id: "submission-1",
    furtherContent: "<p>Test</p>",
    viewPrintAnswers: true,
    emailConfirmation: true,
    feedback: true,
  },
};

const { submission } = questionnaire;

jest.mock("@apollo/react-hooks", () => ({
  ...jest.requireActual("@apollo/react-hooks"),
  useQuery: jest.fn(),
  useSubscription: jest.fn(() => jest.fn()),
}));

useQuery.mockImplementation(() => ({
  loading: false,
  error: false,
  data: { submission },
}));

const match = {
  params: {
    questionnaireId: questionnaire.id,
  },
};

const history = { push: jest.fn() };

const renderSubmissionDesignPage = () => {
  return render(
    <Theme>
      <SubmissionDesign match={match} history={history} loading={false} />
    </Theme>,
    {
      route: `/q/${questionnaire.id}/submission/${submission.id}/design`,
      urlParamMatcher:
        "/q/:questionnaireId/submission/:submissionId/design/:modifier?",
    }
  );
};

describe("Submission design page", () => {
  it("should render", () => {
    const { getByText } = renderSubmissionDesignPage();
    expect(getByText("Further content")).toBeVisible();
  });

  it("should display error page if there is an error", () => {
    useQuery.mockImplementationOnce(() => ({
      loading: false,
      error: true,
      data: { submission },
    }));
    const { getByTestId } = renderSubmissionDesignPage();

    expect(getByTestId("error")).toBeVisible();
  });

  it("should display error page if there is no submission page returned", () => {
    useQuery.mockImplementationOnce(() => ({
      loading: false,
      error: false,
      data: undefined,
    }));
    const { getByTestId } = renderSubmissionDesignPage();

    expect(getByTestId("error")).toBeVisible();
  });

  it("should display the loading page when loading", () => {
    useQuery.mockImplementationOnce(() => ({
      loading: true,
      error: false,
      data: { submission },
    }));
    const { getByTestId } = renderSubmissionDesignPage();

    expect(getByTestId("loading")).toBeVisible();
  });
});
