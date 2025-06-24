import React from "react";
import { render, fireEvent } from "tests/utils/rtl";

import PublishPage from "./PublishPage";
import QuestionnaireContext from "components/QuestionnaireContext";
import { QCodeContext } from "components/QCodeContext";
import { ToastContext } from "components/Toasts";

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
describe("onCompleted callback in useMutation", () => {
  let questionnaire, hasQCodeError, showToastMock, onCompletedCallback;

  beforeEach(() => {
    questionnaire = { id: "1", totalErrorCount: 0 };
    hasQCodeError = false;
    showToastMock = jest.fn();

    // Capture the onCompleted callback passed to useMutation
    jest
      .spyOn(require("@apollo/react-hooks"), "useMutation")
      .mockImplementation((_, opts) => {
        onCompletedCallback = opts.onCompleted;
        return [jest.fn()];
      });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  const renderWithToast = () =>
    render(
      <QuestionnaireContext.Provider value={{ questionnaire }}>
        <QCodeContext.Provider value={{ hasQCodeError }}>
          <ToastContext.Provider value={{ showToast: showToastMock }}>
            <PublishPage />
          </ToastContext.Provider>
        </QCodeContext.Provider>
      </QuestionnaireContext.Provider>
    );

  it("should show 'Publish successful' when latest publish entry is successful", () => {
    renderWithToast();
    const data = {
      publishSchema: {
        publishHistory: [
          { id: "1", success: false },
          { id: "2", success: true },
        ],
      },
    };
    onCompletedCallback(data);
    expect(showToastMock).toHaveBeenCalledWith("Publish successful");
  });

  it("should show 'Publish failed' when latest publish entry is not successful", () => {
    renderWithToast();
    const data = {
      publishSchema: {
        publishHistory: [
          { id: "1", success: true },
          { id: "2", success: false },
        ],
      },
    };
    onCompletedCallback(data);
    expect(showToastMock).toHaveBeenCalledWith("Publish failed");
  });

  it("should show 'Publish successful' when publishHistory is empty", () => {
    renderWithToast();
    const data = {
      publishSchema: {
        publishHistory: [],
      },
    };
    onCompletedCallback(data);
    expect(showToastMock).toHaveBeenCalledWith("Publish successful");
  });

  it("should show 'Publish successful' when publishHistory is undefined", () => {
    renderWithToast();
    const data = {
      publishSchema: {},
    };
    onCompletedCallback(data);
    expect(showToastMock).toHaveBeenCalledWith("Publish successful");
  });

  it("should show 'Publish successful' when data is undefined", () => {
    renderWithToast();
    onCompletedCallback(undefined);
    expect(showToastMock).toHaveBeenCalledWith("Publish successful");
  });
});
