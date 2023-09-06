import { remove } from "lodash";

import isListCollectorPageType from "utils/isListCollectorPageType";

const identity = (x) => x;

const getContentBeforeEntity = (
  questionnaire,
  id,
  preprocessAnswers,
  includeTarget
) => {
  const sections = [];

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

        const answers =
          !isListCollectorPageType(page.pageType) &&
          (page?.answers?.flatMap(preprocessAnswers) || []);
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
} = {}) => {
  if (!questionnaire || !id || questionnaire?.introduction?.id === id) {
    return [];
  }

  return stripEmpty(
    getContentBeforeEntity(
      questionnaire,
      id,
      preprocessAnswers,
      includeTargetPage
    ).filter(({ folders }) => folders.length)
  );
};
