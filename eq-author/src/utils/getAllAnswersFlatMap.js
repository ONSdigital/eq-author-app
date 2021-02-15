/* eslint-disable no-loop-func */
import { RADIO } from "constants/answer-types";

export const removeHtml = html => html && html.replace(/(<([^>]+)>)/gi, "");

export const organiseAnswers = sections => {
  const questions = sections
    .map(({ folders }) => folders.map(({ pages }) => pages))
    .flat(2);

  let answerRows = [];

  for (const item of questions) {
    const { title, alias, answers, confirmation } = item;

    if (answers) {
      const extraCheck = answers.reduce((acc, item) => {
        if (
          item.hasOwnProperty("options") &&
          item.options &&
          item.type !== RADIO
        ) {
          const optionLabel = item.options.map(option => ({
            ...option,
            type: "CheckboxOption",
            option: true,
          }));

          acc.push(...optionLabel);
        }
        if (
          item.hasOwnProperty("mutuallyExclusiveOption") &&
          item.mutuallyExclusiveOption
        ) {
          acc.push({
            ...item.mutuallyExclusiveOption,
            type: "MutuallyExclusiveOption",
            option: true,
          });
        }

        if (
          item.hasOwnProperty("secondaryLabel") &&
          item.hasOwnProperty("secondaryQCode") &&
          item.secondaryLabel
        ) {
          acc.push({
            id: item.id,
            label: item.secondaryLabel,
            qCode: item.secondaryQCode,
            type: item.type,
            validationErrorInfo: item.validationErrorInfo,
            secondary: true,
          });
        }
        return acc;
      }, []);

      const answersAndOptions = [...answers, ...extraCheck];

      answerRows.push({
        title,
        alias,
        answers: answersAndOptions,
      });
    }

    if (confirmation) {
      const {
        id,
        title,
        alias,
        qCode,
        validationErrorInfo,
        __typename: type,
      } = confirmation;

      answerRows.push({
        title: title,
        alias,
        answers: [{ id, qCode, type, validationErrorInfo }],
      });
    }
  }

  return { answers: answerRows };
};

export const flattenAnswers = data => {
  const answers = data.reduce((acc, item) => {
    const answer = item.answers.map((ans, index) => {
      if (index > 0) {
        return {
          title: item.title,
          alias: item.alias,
          nested: true,
          ...ans,
        };
      } else {
        return {
          title: item.title,
          alias: item.alias,
          ...ans,
        };
      }
    });
    acc.push(...answer);
    return acc;
  }, []);
  return answers;
};

export const duplicatesAnswers = flattenedAnswers => {
  const duplicates = flattenedAnswers.reduce((acc, item) => {
    if (
      acc.hasOwnProperty(item.qCode) &&
      item.qCode !== "" &&
      item.qCode !== null
    ) {
      acc[item.qCode]++;
    }
    if (!acc[item.qCode]) {
      acc[item.qCode] = 1;
    }
    return acc;
  }, {});
  return duplicates;
};
