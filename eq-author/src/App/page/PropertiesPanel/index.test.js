import React from "react";
import { render, screen } from "tests/utils/rtl";
import {
  buildQuestionnaire,
  buildPages,
  buildAnswers,
} from "tests/utils/createMockQuestionnaire";
import QuestionnaireContext from "components/QuestionnaireContext";
import PropertiesPanel from "./";

const mockPage = () => [
  buildPages({ pageCount: 1 })[0],
  buildAnswers({ answerCount: 1 })[0],
];

const questionnaire = buildQuestionnaire();
questionnaire.metadata = [
  {
    id: "1",
    displayName: "metadata one",
    key: "metadata-one",
    dateValue: "2016-05-10",
    type: "Date",
  },
  {
    id: "2",
    displayName: "metadata two",
    key: "metadata-two",
    dateValue: "2016-05-11",
    type: "Date",
  },
];
const setup = (page) =>
  render(
    <QuestionnaireContext.Provider value={{ questionnaire }}>
      <PropertiesPanel page={page} />
    </QuestionnaireContext.Provider>
  );

describe("PropertiesPanel", () => {
  describe("Not date range", () => {
    beforeEach(() => {
      const [page, answer] = mockPage();
      answer.properties = { decimals: 0, required: false };
      page.answers = [answer];
      setup(page);
    });

    it("should not render fallback when answer type isn't 'Date range'", () => {
      expect(screen.queryByText(/Fallback value/)).not.toBeInTheDocument();
    });
  });

  describe("Date range", () => {
    describe("fallback === false", () => {
      beforeEach(() => {
        const [page, answer] = mockPage();
        answer.type = "DateRange";
        answer.properties = { required: false, fallback: { enabled: false } };
        page.answers = [answer];
        setup(page);
      });

      it("should fallback when answer type is 'Date range'", () => {
        expect(screen.getByText(/Fallback/)).toBeVisible();
      });

      it("should default to fallback being off", () => {
        expect(screen.getByRole("checkbox", { name: "Fallback" }).checked).toBe(
          false
        );
      });

      it("should not show fall back collapsible by default", () => {
        expect(
          screen.queryByTestId("fallback-collapsible-body")
        ).not.toBeInTheDocument();
      });
    });

    describe("fallback === true", () => {
      beforeEach(() => {
        const [page, answer] = mockPage();
        answer.type = "DateRange";
        answer.properties = {
          required: false,
          fallback: { enabled: true },
        };
        answer.validationErrorInfo = {
          id: "",
          errors: [
            {
              errorCode: "ERR_VALID_REQUIRED_START",
              field: "fallback",
              type: "answer",
              id: "1",
            },
            {
              errorCode: "ERR_VALID_REQUIRED_END",
              field: "fallback",
              type: "answer",
              id: "1",
            },
          ],
          totalCount: 2,
        };
        page.answers = [answer];
        setup(page);
      });

      it("should display dropdowns with placeholder text", () => {
        expect(screen.queryAllByText(/Select metadata/)[0]).toBeVisible();
        expect(screen.queryAllByText(/Select metadata/)[1]).toBeVisible();
      });

      it("should display validation errors when no selection has been made", () => {
        expect(screen.queryAllByText(/Selection required/)[0]).toBeVisible();
        expect(screen.queryAllByText(/Selection required/)[1]).toBeVisible();
      });

      it("should allow selection of metadata of type 'Date'", () => {
        // write this test monday
      });
    });
  });
});
