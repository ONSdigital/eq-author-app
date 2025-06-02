import React from "react";
import { render, fireEvent } from "tests/utils/rtl";

import PublishPage from "./PublishPage";
import QuestionnaireContext from "components/QuestionnaireContext";
import { QCodeContext } from "components/QCodeContext";

const mockUseSubscription = jest.fn();
const mockUseMutation = jest.fn();
const mockUseQuery = jest.fn();

jest.mock("@apollo/react-hooks", () => ({
  useMutation: () => [mockUseMutation],
  useSubscription: () => [mockUseSubscription],
  useQuery: () => [mockUseQuery],
}));

const renderPublishPage = (questionnaire, hasQCodeError, props) => {
  return render(
    <QuestionnaireContext.Provider value={{ questionnaire }}>
      <QCodeContext.Provider value={{ hasQCodeError }}>
        <PublishPage {...props} />
      </QCodeContext.Provider>
    </QuestionnaireContext.Provider>
  );
};

describe("Publish page", () => {
  let questionnaire, hasQCodeError;
  beforeEach(() => {
    questionnaire = {
      id: "1",
      isPublic: true,
    };
    hasQCodeError = false;
  });

  it("should render publish page", () => {
    const { getByTestId } = renderPublishPage();

    expect(getByTestId("publish-page-container")).toBeInTheDocument();
  });

  it("should enable publish button when totalErrorCount is 0 and no QCode errors", () => {
    questionnaire.totalErrorCount = 0;

    const { getByTestId } = renderPublishPage(questionnaire);

    const publishButton = getByTestId("btn-publish-schema");
    expect(publishButton).toBeEnabled();
  });

  it("should disable publish button when totalErrorCount is greater than 0", () => {
    questionnaire.totalErrorCount = 1;

    const { getByTestId } = renderPublishPage(questionnaire);

    const publishButton = getByTestId("btn-publish-schema");
    expect(publishButton).toBeDisabled();
  });

  it("should disable publish button when there are QCode errors", () => {
    questionnaire.totalErrorCount = 0;
    hasQCodeError = true;
    const { getByTestId } = renderPublishPage(questionnaire, { hasQCodeError });

    const publishButton = getByTestId("btn-publish-schema");
    expect(publishButton).toBeDisabled();
  });

  it("should publish questionnaire on button click", () => {
    const { getByTestId } = renderPublishPage();

    const publishButton = getByTestId("btn-publish-schema");
    fireEvent.click(publishButton);

    expect(mockUseMutation).toHaveBeenCalledTimes(1);
  });
});
