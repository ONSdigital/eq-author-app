import { remove } from "lodash";

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

        const answers = page?.answers?.flatMap(preprocessAnswers) || [];
        if (!answers.length) {
          continue;
        }

        sections[sections.length - 1].folders[
          sections[sections.length - 1].folders.length - 1
        ].pages.push({
          ...page,
          answers,
        });

        if (page.id === id && includeTarget) {
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
}) =>
  stripEmpty(
    questionnaire?.introduction?.id === id
      ? []
      : getContentBeforeEntity(
          questionnaire,
          id,
          preprocessAnswers,
          includeTargetPage
        ).filter(({ folders }) => folders.length)
  );
