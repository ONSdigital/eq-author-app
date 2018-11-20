import { find, isArray, pick, reduce } from "lodash";

const shapeTree = answers =>
  reduce(
    answers,
    (result, value) => {
      const answer = pick(value, ["id", "displayName"]);
      const page = pick(value.page, ["id", "displayName"]);
      const section = pick(value.page.section, ["id", "displayName"]);

      if (!find(result, { id: section.id })) {
        result.push(section);
      }

      const x = find(result, { id: section.id });

      if (!find(x.pages, { id: page.id })) {
        if (!isArray(x.pages)) {
          x.pages = [];
        }
        x.pages.push(page);
      }

      const y = find(x.pages, { id: page.id });

      if (!find(y.answers, { id: answer.id })) {
        if (!isArray(y.answers)) {
          y.answers = [];
        }
        y.answers.push(answer);
      }

      return result;
    },
    []
  );

export default shapeTree;
