const { v4: uuidv4 } = require("uuid");

const uuidRejex =
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

const idIsNotUUID = (id) => !uuidRejex.test(id);

const buildIdRemap = (entityType, oldId) => ({
  entityType,
  oldId,
  newId: uuidv4(),
});

const remapEntityId = (id, entityType, callback) => {
  const originalId = id;
  let supportedSuffixes = ["to", "from"];
  let suffixToAdd;

  supportedSuffixes.forEach((suffix) => {
    //   See if the ID includes a suffix, for example "from" in date ranges
    if (id.includes(suffix)) {
      // Store and remove the suffix to sort the ID out; we'll add the suffix back later
      suffixToAdd = suffix;
      id = id.replace(suffix, "");
    }
  });

  // Remaps an entity (i.e. answer, page, folder, or section) to a UUID if needed
  if (idIsNotUUID(id)) {
    const mapping = buildIdRemap(entityType, id);

    if (suffixToAdd) {
      // Re-adds the suffix, for example for date ranges
      mapping.oldId = `${mapping.oldId}${suffixToAdd}`;
      mapping.newId = `${mapping.newId}${suffixToAdd}`;
    }

    if (callback) {
      callback(mapping);
    }

    return mapping.newId;
  }

  return originalId;
};

const remapPipingInString = (title, idMap) => {
  const regex = /data-piped="answers" data-id="(.+?)"/gm;

  let matches;
  let pipedIdList = [];

  do {
    matches = regex.exec(title);
    if (matches && matches.length > 1) {
      const [, answerId] = matches;
      pipedIdList.push(answerId);
    }
  } while (matches);

  pipedIdList.forEach((id) => {
    const strippedId = id.replace("from", "").replace("to", "");

    if (idIsNotUUID(strippedId)) {
      let mapping;

      if (id.includes("from") || id.includes("to")) {
        mapping = idMap.find(
          ({ oldId, entityType }) =>
            oldId === id && entityType === "childAnswer"
        );
      } else {
        mapping = idMap.find(
          ({ oldId, entityType }) => oldId === id && entityType === "answer"
        );
      }

      if (!mapping) {
        return;
      }

      title = title.replace(mapping.oldId, mapping.newId);
    }
  });

  return title;
};

const remapChildAnswerId = (oldId, idMap, entityType, callback) => {
  const parentIdOld = oldId.replace("from", "").replace("to", "");

  if (!idIsNotUUID(parentIdOld)) {
    return oldId;
  }

  const map = idMap.find(
    ({ oldId, entityType }) => oldId === parentIdOld && entityType === "answer"
  );

  const parentIdNew = map.newId;
  const childIdNew = oldId.replace(parentIdOld, parentIdNew);

  const mapping = { entityType, oldId, newId: childIdNew };

  if (callback) {
    callback(mapping);
  }

  return mapping.newId;
};

module.exports = (questionnaire) => {
  const idMap = [];

  const remappedQuestionnaire = {
    ...questionnaire,
    sections: questionnaire.sections.map((section) => ({
      ...section,
      id: remapEntityId(section.id, "section", (mapping) =>
        idMap.push(mapping)
      ),
      folders: section.folders.map((folder) => ({
        ...folder,
        id: remapEntityId(folder.id, "folder", (mapping) =>
          idMap.push(mapping)
        ),
        pages: folder.pages.map((page) => ({
          ...page,
          id: remapEntityId(page.id, "page", (mapping) => idMap.push(mapping)),
          title: remapPipingInString(page.title, idMap),
          answers: page.answers.map((answer) => ({
            ...answer,
            id: remapEntityId(answer.id, "answer", (mapping) =>
              idMap.push(mapping)
            ),
            options: answer.options?.map((option) => ({
              ...option,
              id: remapEntityId(option.id, "option", (mapping) =>
                idMap.push(mapping)
              ),
            })),
            childAnswers: answer.childAnswers?.map((child) => ({
              ...child,
              id: remapChildAnswerId(
                child.id,
                idMap,
                "childAnswer",
                (mapping) => idMap.push(mapping)
              ),
            })),
          })),
        })),
      })),
    })),
  };

  return remappedQuestionnaire;
};
