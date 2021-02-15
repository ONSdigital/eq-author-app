import { find, isArray, pick, reduce } from "lodash";

const pushEntity = (currentEntity, entityType, entityToPush) => {
  if (!find(currentEntity[entityType], { id: entityToPush.id })) {
    if (!isArray(currentEntity[entityType])) {
      currentEntity[entityType] = [];
    }
    currentEntity[entityType].push(entityToPush);
  }
};

const shapeTree = (answers, topLevel = "section") =>
  reduce(
    answers,
    (result, value) => {
      const answer = pick(value, [
        "id",
        "displayName",
        "type",
        "properties",
        "__typename",
      ]);
      const page = pick(value.page, ["id", "displayName", "__typename"]);
      const section = pick(value.page.section, [
        "id",
        "displayName",
        "__typename",
      ]);

      if (topLevel === "page") {
        if (!find(result, { id: page.id })) {
          result.push(page);
        }

        const currentPage = find(result, { id: page.id });
        pushEntity(currentPage, "answers", answer);
        return result;
      }

      if (!find(result, { id: section.id })) {
        result.push(section);
      }

      const currentSection = find(result, { id: section.id });

      pushEntity(currentSection, "pages", page);

      const currentPage = find(currentSection.pages, { id: page.id });

      pushEntity(currentPage, "answers", answer);

      return result;
    },
    []
  );

export default shapeTree;
