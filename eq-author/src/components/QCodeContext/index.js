import React, { createContext, useContext, useMemo } from "react";
import PropTypes from "prop-types";
import CustomPropTypes from "custom-prop-types";
import { getPages, getPageByAnswerId } from "utils/questionnaireUtils";

import {
  RADIO_OPTION,
  CHECKBOX,
  CHECKBOX_OPTION,
  RADIO,
  MUTUALLY_EXCLUSIVE,
  ANSWER_OPTION_TYPES,
  SELECT,
  SELECT_OPTION,
  MUTUALLY_EXCLUSIVE_OPTION,
} from "constants/answer-types";

import {
  ListCollectorPage as LIST_COLLECTOR_PAGE,
  ListCollectorAddItemPage as LIST_COLLECTOR_ADD_ITEM_PAGE,
} from "constants/page-types";
import { DRIVING, ANOTHER } from "constants/list-answer-types";

export const QCodeContext = createContext();

// flattenAnswer :: [Answer] -> [AnswerRow]
// Flatten single answer into rows for each of:
// - Answer
// - (If present) Answer's options (inc. mutually exclusive option)
// - (If present) Answer's embedded secondary answer

export const flattenAnswer = (answer) =>
  [
    answer,
    ...(answer.options?.map(
      (option) =>
        answer.type !== MUTUALLY_EXCLUSIVE && {
          ...option,
          type: ANSWER_OPTION_TYPES[answer.type],
          option: true,
        }
    ) ?? []),
    ...(answer.options?.map(
      (option) =>
        answer.type === MUTUALLY_EXCLUSIVE && {
          ...option,
          type: "MutuallyExclusiveOption",
          option: true,
        }
    ) ?? []),
    answer.secondaryLabel && {
      ...answer,
      label: answer.secondaryLabel,
      qCode: answer.secondaryQCode,
      secondary: true,
    },
  ].filter(Boolean);

const formatListCollector = (listCollectorPage) => [
  {
    id: listCollectorPage.id,
    questionTitle: listCollectorPage.drivingQuestion,
    drivingQCode: listCollectorPage.drivingQCode,
    type: RADIO,
    listAnswerType: DRIVING,
    label: "",
  },
  {
    label: listCollectorPage.drivingPositive,
    type: RADIO_OPTION,
    option: true,
    hideOptionValue: true,
  },
  {
    label: listCollectorPage.drivingNegative,
    type: RADIO_OPTION,
    option: true,
    hideOptionValue: true,
  },
  {
    id: listCollectorPage.id,
    questionTitle: listCollectorPage.anotherTitle,
    anotherQCode: listCollectorPage.anotherQCode,
    type: RADIO,
    listAnswerType: ANOTHER,
    label: "",
  },
  {
    label: listCollectorPage.anotherPositive,
    type: RADIO_OPTION,
    option: true,
    hideOptionValue: true,
  },
  {
    label: listCollectorPage.anotherNegative,
    type: RADIO_OPTION,
    option: true,
    hideOptionValue: true,
  },
];

// getFlattenedAnswerRows :: Questionnaire -> [AnswerRow]
// Generate list of rows of flattened answers, with parent page information,
// from input questionnaire object
export const getFlattenedAnswerRows = (questionnaire) => {
  const pages = getPages(questionnaire)?.filter(
    ({ pageType }) =>
      pageType !== "CalculatedSummaryPage" &&
      pageType !== LIST_COLLECTOR_ADD_ITEM_PAGE
  );

  if (questionnaire?.collectionLists?.lists) {
    questionnaire.collectionLists.lists.forEach((list) => {
      pages.push({
        ...list,
        title: list.listName,
      });
    });
  }

  return pages?.flatMap((page) => {
    if (page.pageType !== LIST_COLLECTOR_PAGE) {
      const answerRows = page.answers.flatMap(flattenAnswer);

      // Add page title / shortcode alias (for display in QCodesTable) to first answer only
      if (answerRows.length) {
        answerRows[0].questionTitle = page.title;
        answerRows[0].questionShortCode = page.alias;
      }

      return answerRows;
    }
    // pageType ListCollectorPage does not include page.answers
    else {
      return formatListCollector(page);
    }
  });
};

// getDuplicatedQCodes :: [AnswerRow] -> [QCode]
// Return an array of qCodes which are duplicated in the given list of answer rows
export const getDuplicatedQCodes = (flattenedAnswers, { dataVersion }) => {
  // acc - accumulator
  const qCodeUsageMap = flattenedAnswers?.reduce(
    (acc, { qCode, drivingQCode, anotherQCode, type, additionalAnswer }) => {
      const { qCode: additionalAnswerQCode } = additionalAnswer || {};
      if (dataVersion === "3") {
        if (
          (qCode || drivingQCode || anotherQCode) &&
          type !== CHECKBOX_OPTION
        ) {
          const currentValue = acc.get(qCode ?? drivingQCode ?? anotherQCode);
          acc.set(
            qCode ?? drivingQCode ?? anotherQCode,
            currentValue ? currentValue + 1 : 1
          );
        }
        if (additionalAnswerQCode) {
          const currentValue = acc.get(additionalAnswerQCode);
          acc.set(additionalAnswerQCode, currentValue ? currentValue + 1 : 1);
        }
      }

      if (dataVersion !== "3") {
        if (qCode && type !== CHECKBOX) {
          const currentValue = acc.get(qCode);
          acc.set(qCode, currentValue ? currentValue + 1 : 1);
        }

        if (additionalAnswerQCode && type !== CHECKBOX_OPTION) {
          const currentValue = acc.get(additionalAnswerQCode);
          acc.set(additionalAnswerQCode, currentValue ? currentValue + 1 : 1);
        }
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

const getEmptyQCodes = (answerRows, dataVersion) => {
  // If dataVersion is 3, checkbox options and radio options do not have QCodes, and therefore these can be empty
  // This removes the error badge from the main navigation QCodes tab when data version is 3 and a checkbox option is empty from when it previously used a different data version
  if (dataVersion === "3") {
    return answerRows?.find(
      ({ qCode, drivingQCode, anotherQCode, type }) =>
        !(qCode || drivingQCode || anotherQCode) &&
        ![
          CHECKBOX_OPTION,
          RADIO_OPTION,
          SELECT_OPTION,
          MUTUALLY_EXCLUSIVE_OPTION,
        ].includes(type)
    );
  }
  // If dataVersion is not 3, checkbox answers and radio options do not have QCodes, and therefore these can be empty
  // This removes the error badge from the main navigation QCodes tab when data version is not 3 and a checkbox answer is empty from when it previously used data version 3
  else {
    return answerRows?.find(
      ({ qCode, type }) =>
        !qCode &&
        ![
          CHECKBOX,
          RADIO_OPTION,
          SELECT_OPTION,
          MUTUALLY_EXCLUSIVE_OPTION,
        ].includes(type)
    );
  }
};

// getDuplicatedOptionValues :: [AnswerRow] -> [Value]
// Return an array of Values which are duplicated within an answer in the given list of answer rows
export const getDuplicatedOptionValues = (flattenedAnswers, questionnaire) => {
  // acc - accumulator
  let currentQuestionId = "";
  let idValue = "";
  const optionValueUsageMap = flattenedAnswers?.reduce(
    (acc, { value, type, id }) => {
      if ([RADIO, CHECKBOX, SELECT].includes(type)) {
        currentQuestionId = id;
      }

      if ([MUTUALLY_EXCLUSIVE].includes(type)) {
        const page = getPageByAnswerId(questionnaire, id);
        currentQuestionId = page.answers[0]?.id;
      }

      if (
        value &&
        [
          CHECKBOX_OPTION,
          RADIO_OPTION,
          SELECT_OPTION,
          MUTUALLY_EXCLUSIVE_OPTION,
        ].includes(type)
      ) {
        idValue = currentQuestionId.concat(value);
        const currentValue = acc.get(idValue);
        acc.set(idValue, currentValue ? currentValue + 1 : 1);
      }
      return acc;
    },
    new Map()
  );

  return Array.from(optionValueUsageMap).reduce(
    (acc, [value, count]) => (count > 1 ? [...acc, value] : acc),
    []
  );
};

const getEmptyOptionValues = (answerRows) => {
  return answerRows?.find(
    ({ value, type, hideOptionValue }) =>
      !value &&
      [
        CHECKBOX_OPTION,
        RADIO_OPTION,
        SELECT_OPTION,
        MUTUALLY_EXCLUSIVE_OPTION,
      ].includes(type) &&
      !hideOptionValue
  );
};

export const QCodeContextProvider = ({ questionnaire = {}, children }) => {
  const answerRows = useMemo(
    () => getFlattenedAnswerRows(questionnaire) ?? [],
    [questionnaire]
  );

  const duplicatedQCodes = useMemo(
    () => getDuplicatedQCodes(answerRows, questionnaire) ?? [],
    [answerRows, questionnaire]
  );

  const duplicatedOptionValues = useMemo(
    () => getDuplicatedOptionValues(answerRows, questionnaire) ?? [],
    [answerRows, questionnaire]
  );

  const hasQCodeError =
    duplicatedQCodes?.length ||
    getEmptyQCodes(answerRows, questionnaire.dataVersion) ||
    (questionnaire.dataVersion === "3" && duplicatedOptionValues?.length) ||
    (questionnaire.dataVersion === "3" && getEmptyOptionValues(answerRows));

  const hasOptionValueError =
    duplicatedOptionValues?.length || getEmptyOptionValues(answerRows);

  const dataVersion = questionnaire?.dataVersion;

  const value = useMemo(
    () => ({
      answerRows,
      duplicatedQCodes,
      dataVersion,
      hasQCodeError,
      duplicatedOptionValues,
      hasOptionValueError,
    }),
    [
      answerRows,
      duplicatedQCodes,
      dataVersion,
      hasQCodeError,
      duplicatedOptionValues,
      hasOptionValueError,
    ]
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
