import React from "react";
import { render } from "tests/utils/rtl";
import { UnwrappedPageRoute } from "./";
import { useQuery } from "@apollo/react-hooks";
import { buildPages } from "tests/utils/createMockQuestionnaire";
import { MeContext } from "App/MeContext";

jest.mock("components/EditorLayout/Header", () => ({
  __esModule: true,
  default: () => <></>,
}));

jest.mock("components/RichTextEditor", () => ({
  __esModule: true,
  default: () => <></>,
}));

jest.mock("App/page/Design/QuestionPageEditor/MetaEditor", () => ({
  __esModule: true,
  default: () => <></>,
}));

jest.mock("@apollo/react-hooks", () => ({
  ...jest.requireActual("@apollo/react-hooks"),
  useQuery: jest.fn(),
}));

jest.mock("components/NavigationCallbacks", () => ({
  __esModule: true,
  useNavigationCallbacks: jest.fn(() => ({
    onAddQuestionPage: jest.fn(),
  })),
  useSetNavigationCallbacksForPage: jest.fn(() => null),
}));

useQuery.mockImplementation(() => ({
  data: undefined,
  loading: true,
}));

const user = {
  id: "1",
  name: "Name",
};

function defaultSetup(props) {
  const questionnaireId = "questionnaire";
  const sectionId = "1.1";
  const pageId = "1.1.1";
  const match = {
    params: { questionnaireId, sectionId, pageId },
  };
  const utils = render(
    <MeContext.Provider value={{ me: user }}>
      <UnwrappedPageRoute {...props} match={match} fetchAnswers={jest.fn()} />
    </MeContext.Provider>
  );

  return { ...utils, questionnaireId, sectionId, pageId };
}

describe("PageRoute", () => {
  describe("data fetching", () => {
    it("should show loading spinner while request in flight", () => {
      const { getByTestId } = defaultSetup();

      expect(getByTestId("loading")).toBeVisible();
    });

    it("should render a questionPage editor once loaded", () => {
      useQuery.mockImplementationOnce(() => ({
        loading: false,
        data: { page: buildPages()[0] },
      }));

      const { getByTestId } = defaultSetup();

      expect(getByTestId("question-page-editor")).toBeVisible();
    });

    it("should render a calculatedSummaryPage editor once loaded", () => {
      jest.mock("components/RichTextEditor", () => <></>);
      const page = {
        ...buildPages()[0],
        pageType: "CalculatedSummaryPage",
        totalTitle: "",
        summaryAnswers: [],
      };

      useQuery.mockImplementationOnce(() => ({
        loading: false,
        data: { page },
      }));
      const { getByTestId } = defaultSetup();

      expect(getByTestId("calculated-summary-page-editor")).toBeVisible();
    });

    it("should render error if problem with request", () => {
      useQuery.mockImplementationOnce(() => ({
        loading: false,
        data: undefined,
        error: true,
      }));
      const { getByTestId } = defaultSetup();
      expect(getByTestId("error")).toBeVisible();
    });
  });
});
