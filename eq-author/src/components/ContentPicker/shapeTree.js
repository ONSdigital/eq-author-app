import { find, isArray, pick, reduce } from "lodash";

const shapeTree = answers =>
  reduce(
    answers,
    (result, value) => {
      const answer = pick(value, ["id", "displayName", "type"]);
      const page = pick(value.page, ["id", "displayName"]);
      const section = pick(value.page.section, ["id", "displayName"]);

      if (!find(result, { id: section.id })) {
        result.push(section);
      }

      const currentSection = find(result, { id: section.id });

      if (!find(currentSection.pages, { id: page.id })) {
        if (!isArray(currentSection.pages)) {
          currentSection.pages = [];
        }
        currentSection.pages.push(page);
      }

      const currentPage = find(currentSection.pages, { id: page.id });

      if (!find(currentPage.answers, { id: answer.id })) {
        if (!isArray(currentPage.answers)) {
          currentPage.answers = [];
        }
        currentPage.answers.push(answer);
      }

      return result;
    },
    []
  );

export const shapePageTree = answers =>
  reduce(
    answers,
    (result, value) => {
      const page = pick(value, ["id", "displayName"]);
      const section = pick(value.section, ["id", "displayName"]);

      if (!find(result, { id: section.id })) {
        result.push(section);
      }

      const currentSection = find(result, { id: section.id });

      if (!find(currentSection.pages, { id: page.id })) {
        if (!isArray(currentSection.pages)) {
          currentSection.pages = [];
        }
        currentSection.pages.push(page);
      }

      return result;
    },
    []
  );

export default shapeTree;
