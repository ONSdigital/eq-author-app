import React from "react";
import { render } from "tests/utils/rtl";

import { buildPages } from "tests/utils/createMockQuestionnaire";
import { CalculatedSummaryPageEditor } from "./";
import { richTextEditorErrors } from "constants/validationMessages";

jest.mock("components/NavigationCallbacks", () => ({
  useSetNavigationCallbacksForPage: () => null,
}));

// TODO mock out richText editor to get rid of warning

function defaultPage(changes) {
  const page = buildPages()[0];
  page.pageType = "CalculatedSummaryPage";
  page.summaryAnswers = [];
  page.availableSummaryAnswers = [];
  page.folder = {
    id: "folder-id",
    position: 0,
    section: {},
  };
  page.section = {
    id: "2",
    position: 0,
    displayName: "This Section",
    questionnaire: { id: "1", metadata: [] },
  };
  page.validationErrorInfo = {
    errors: [],
  };
  page.totalTitle = "";
  return { ...page, ...changes };
}

function buildError(error) {
  return {
    validationErrorInfo: {
      errors: [error],
    },
  };
}

function defaultSetup(errors) {
  const fetchAnswers = jest.fn();
  const onChange = jest.fn();
  const onUpdate = jest.fn();
  const onChangeUpdate = jest.fn();
  const onUpdateCalculatedSummaryPage = jest.fn();
  const page = defaultPage(errors);
  const defaultProps = {
    fetchAnswers,
    onChange,
    onUpdate,
    onChangeUpdate,
    onUpdateCalculatedSummaryPage,
    match: {
      params: {
        questionnaireId: "questionnaire",
        sectionId: "1",
        pageId: "1.1.1",
      },
    },
    questionnaireId: "1",
    page,
  };

  const utils = render(<CalculatedSummaryPageEditor {...defaultProps} />);

  return { ...utils, page };
}

function errorSetup(errors) {
  const utils = defaultSetup(errors);
  return { ...utils };
}

describe("CalculatedSummaryPageEditor", () => {
  it("should render", () => {
    const { getByTestId } = defaultSetup();
    expect(getByTestId("calculated-summary-page-editor")).toBeVisible();
  });

  it("should display the correct error message when the title is missing", () => {
    const error = buildError({
      errorCode: "ERR_VALID_REQUIRED",
      field: "title",
      id: "1",
      type: "pages",
    });

    const { getByText } = errorSetup(error);
    expect(
      getByText(richTextEditorErrors.CALCSUM_TITLE_NOT_ENTERED.message)
    ).toBeVisible();
  });

  it("should display the correct error message when piping answer in title is deleted", async () => {
    const error = buildError({
      errorCode: "PIPING_TITLE_DELETED",
      field: "title",
      id: "1",
      type: "pages",
    });

    const { getByText } = errorSetup(error);
    expect(
      getByText(richTextEditorErrors.PIPING_TITLE_DELETED.message)
    ).toBeVisible();
  });

  it("should display the correct error message when piping answer in title is moved after This question", async () => {
    const error = buildError({
      errorCode: "PIPING_TITLE_MOVED",
      field: "title",
      id: "1",
      type: "pages",
    });

    const { getByText } = errorSetup(error);
    expect(
      getByText(richTextEditorErrors.PIPING_TITLE_MOVED.message)
    ).toBeVisible();
  });
});
