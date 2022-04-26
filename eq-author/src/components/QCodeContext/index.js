import React, { createContext, useContext, useMemo } from "react";
import PropTypes from "prop-types";
import CustomPropTypes from "custom-prop-types";
import { getPages } from "utils/questionnaireUtils";
import { RADIO } from "constants/answer-types";

export const QCodeContext = createContext();

// flattenAnswer :: [Answer] -> [AnswerRow]
// Flatten single answer into rows for each of:
// - Answer
// - (If present) Answer's options (inc. mutually exclusive option)
// - (If present) Answer's embedded secondary answer
export const flattenAnswer = (answer) =>
  [
    answer,
    ...(answer.options?.map((option) => ({
      ...option,
      type: answer.type === RADIO ? "RadioOption" : "CheckboxOption",
      option: true,
    })) ?? []),
    answer.mutuallyExclusiveOption && {
      ...answer.mutuallyExclusiveOption,
      type: "MutuallyExclusiveOption",
      option: true,
    },
    answer.secondaryLabel && {
      ...answer,
      label: answer.secondaryLabel,
      qCode: answer.secondaryQCode,
      secondary: true,
    },
  ].filter(Boolean);

// getFlattenedAnswerRows :: Questionnaire -> [AnswerRow]
// Generate list of rows of flattened answers, with parent page information,
// from input questionnaire object
export const getFlattenedAnswerRows = (questionnaire) => {
  const pages = getPages(questionnaire)?.filter(
    ({ pageType }) =>
      pageType !== "CalculatedSummaryPage" && pageType !== "ListCollectorPage"
  );

  return pages?.flatMap((page) => {
    const answerRows = page.answers.flatMap(flattenAnswer);

    // Add page title / shortcode alias (for display in QCodesTable) to first answer only
    if (answerRows.length) {
      answerRows[0].questionTitle = page.title;
      answerRows[0].questionShortCode = page.alias;
    }

    return answerRows;
  });
};

// getDuplicatedQCodes :: [AnswerRow] -> [QCode]
// Return an array of qCodes which are duplicated in the given list of answer rows
export const getDuplicatedQCodes = (flattenedAnswers) => {
  const qCodeUsageMap = flattenedAnswers?.reduce(
    (acc, { qCode, additionalAnswer }) => {
      const { qCode: additionalAnswerQCode } = additionalAnswer || {};

      if (qCode) {
        const currentValue = acc.get(qCode);
        acc.set(qCode, currentValue ? currentValue + 1 : 1);
      }

      if (additionalAnswerQCode) {
        const currentValue = acc.get(additionalAnswerQCode);
        acc.set(additionalAnswerQCode, currentValue ? currentValue + 1 : 1);
      }

      return acc;
    },
    new Map()
  );

  return Array.from(qCodeUsageMap).reduce(
    (acc, [qCode, count]) => (count > 1 ? [...acc, qCode] : acc),
    []
  );
};

export const QCodeContextProvider = ({ questionnaire = {}, children }) => {
  const answerRows = useMemo(
    () => getFlattenedAnswerRows(questionnaire) ?? [],
    [questionnaire]
  );

  const duplicatedQCodes = useMemo(
    () => getDuplicatedQCodes(answerRows) ?? [],
    [answerRows]
  );

  const hasQCodeError =
    duplicatedQCodes?.length ||
    answerRows?.find(
      ({ qCode, type }) => !qCode && !["Checkbox", "RadioOption"].includes(type)
    );

  const value = useMemo(
    () => ({
      answerRows,
      duplicatedQCodes,
      hasQCodeError,
    }),
    [answerRows, duplicatedQCodes, hasQCodeError]
  );

  return (
    <QCodeContext.Provider value={value}>{children}</QCodeContext.Provider>
  );
};

QCodeContextProvider.propTypes = {
  questionnaire: CustomPropTypes.questionnaire,
  children: PropTypes.node,
};

export const useQCodeContext = () => useContext(QCodeContext);

export default QCodeContext;
