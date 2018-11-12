import {
  dropRightWhile,
  get,
  isEmpty,
  last,
  takeWhile,
  dropRight
} from "lodash";
import fp from "lodash/fp";

const getAnswer = answer => {
  if (answer.__typename === "CompositeAnswer") {
    return answer.childAnswers;
  }
  return answer;
};

const filterAnswers = answerTypes =>
  fp.flow(
    fp.map(getAnswer),
    fp.flatten,
    fp.filter(({ type }) => fp.includes(type)(answerTypes))
  );

const filterQuestionnaire = ({
  answerTypes,
  questionnaire,
  sectionId,
  pageId
}) => {
  if (!questionnaire) {
    return [];
  }
  let sections;

  if (!pageId && sectionId) {
    if (get(questionnaire, "sections[0].id") === sectionId) {
      return [];
    }

    sections = dropRight(
      dropRightWhile(
        questionnaire.sections,
        section => section.id !== sectionId
      )
    );
  } else {
    // show nothing if on first section or first page of first section
    if (get(questionnaire, "sections[0].pages[0].id") === pageId) {
      return [];
    }

    sections = dropRightWhile(
      questionnaire.sections,
      section => section.id !== sectionId
    );

    // only include pages up to the current
    const currentSection = last(sections);
    sections[sections.length - 1] = {
      ...currentSection,
      pages: takeWhile(currentSection.pages, page => page.id !== pageId)
    };

    // exclude current section if page is first in section
    if (isEmpty(last(sections).pages)) {
      sections.splice(sections.length - 1, 1);
    }
  }

  return sections.map(section => ({
    ...section,
    pages: section.pages.map(page => ({
      ...page,
      answers: filterAnswers(answerTypes)(page.answers)
    }))
  }));
};

export default filterQuestionnaire;
