import { remove } from "lodash";

import isListCollectorPageType from "utils/isListCollectorPageType";
import { getPageByAnswerId } from "utils/questionnaireUtils";

import { MUTUALLY_EXCLUSIVE } from "constants/answer-types";

const identity = (x) => x;

const getContentBeforeEntity = (
  questionnaire,
  id,
  preprocessAnswers,
  includeTarget,
  expressionGroup,
  selectedId
) => {
  const sections = [];
  const selectedAnswerPage = getPageByAnswerId(questionnaire, selectedId);

  for (const section of questionnaire.sections) {
    if (section.id === id) {
      return sections;
    }

    sections.push({
      ...section,
      folders: [],
    });

    for (const folder of section.folders) {
      if (folder.id === id) {
        return sections;
      }

      sections[sections.length - 1].folders.push({
        ...folder,
        pages: [],
      });

      for (const page of folder.pages) {
        if (page.id === id && !includeTarget) {
          return sections;
        }

        let answers =
          !isListCollectorPageType(page.pageType) &&
          (page?.answers?.flatMap(preprocessAnswers) || []);

        /*
          When expression group's condition is "And":
            1. Do not include mutually exclusive answers on the same page as the expression's left side answer
            2. Do not include answers on the same page as the expression's left side answer when the expression's left side answer is mutually exclusive
        */
        if (expressionGroup?.operator === "And") {
          expressionGroup.expressions.forEach((expression) => {
            if (expression?.left?.page?.id) {
              // Filters answers if the expression's left side page is not the selected answer's page - allows selection of answers on the same page as the selected answer
              if (expression.left.page.id !== selectedAnswerPage?.id) {
                answers = answers.filter((answer) => {
                  // If the expression's left side answer is on the same page as the looped answer
                  if (expression.left.page.id === answer.page.id) {
                    // If the expression's left side answer is mutually exclusive, do not include the looped answer (as looped answer and expression answer are on the same page)
                    if (expression.left.type === MUTUALLY_EXCLUSIVE) {
                      return false;
                    }
                    // If the expression's left side answer is not mutually exclusive, only include the looped answer if it is also not mutually exclusive (as looped answer and expression answer are on the same page)
                    else {
                      return answer.type !== MUTUALLY_EXCLUSIVE;
                    }
                  }
                  return true;
                });
              }
              // Filters answers if the expression's left side page matches the selected answer's page - allows selection of answers on the same page as the selected answer
              else {
                // Gets all expressions using answers from the same page as the selected answer
                const expressionsFromSamePage =
                  expressionGroup.expressions.filter(
                    (expression) =>
                      expression?.left?.page?.id === selectedAnswerPage?.id
                  );

                /* 
                Checks if the expression group includes more than one expression using the selected answer's page 
                (to allow selection of answers on the same page as the selected answer when it is the only expression using the selected answer's page) 
                */
                const expressionGroupIncludesExpressionFromSamePage =
                  expressionsFromSamePage.length > 1; // Checks length to see if there is more than one expression in the expression group using the selected answer's page

                // Filters out answers on the same page as the selected answer if the expression group includes more than one expression using the selected answer's page and the selected answer's page includes a mutually exclusive answer
                answers = answers.filter((answer) => {
                  if (
                    answer.page.id === selectedAnswerPage?.id &&
                    expressionGroupIncludesExpressionFromSamePage &&
                    selectedAnswerPage?.answers.some(
                      (answer) => answer.type === MUTUALLY_EXCLUSIVE
                    )
                  ) {
                    return false;
                  }
                  return true;
                });
              }
            }
          });
        }

        if (answers.length) {
          sections[sections.length - 1].folders[
            sections[sections.length - 1].folders.length - 1
          ].pages.push({
            ...page,
            answers,
          });
        }

        if (
          (page.id === id && includeTarget) ||
          page?.confirmation?.id === id
        ) {
          return sections;
        }
      }
    }
  }

  return sections;
};

export const stripEmpty = (sections) => {
  sections.forEach(({ folders }) =>
    remove(folders, (folder) => !folder.pages.length)
  );
  remove(sections, (section) => !section.folders.length);
  return sections;
};

export default ({
  questionnaire,
  id,
  preprocessAnswers = identity,
  includeTargetPage = false,
  expressionGroup,
  selectedId,
} = {}) => {
  if (!questionnaire || !id || questionnaire?.introduction?.id === id) {
    return [];
  }

  return stripEmpty(
    getContentBeforeEntity(
      questionnaire,
      id,
      preprocessAnswers,
      includeTargetPage,
      expressionGroup,
      selectedId
    ).filter(({ folders }) => folders.length)
  );
};
