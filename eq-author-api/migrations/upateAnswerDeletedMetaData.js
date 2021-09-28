const { getPages } = require("../schema/resolvers/utils");

module.exports = (questionnaire) => {
  const ctx = {
    questionnaire,
  };
  const { metadata } = questionnaire;
  const pages = getPages(ctx);
  const regexp = /[\w]{8}-[\w]{4}-[\w]{4}-[\w]{4}-[\w]{12}/i;

  pages.map((page) => {
    if (page?.title?.includes("metadata")) {
      const splitTitleToArray = page.title.split(/(?<=\/span)/);

      splitTitleToArray.map((titlePart) => {
        const idExists = regexp.exec(titlePart);

        if (idExists !== null && titlePart.includes("metadata")) {
          const index = splitTitleToArray.indexOf(titlePart);

          const titleMetadataId = idExists[0];
          if (
            !metadata.some((thisMetaData) => thisMetaData.id === titleMetadataId)
          ) {
            titlePart = titlePart.replace(/\[.*?\]/, "[Deleted metadata]");
            splitTitleToArray[index] = titlePart;
          }
        }
      });
      page.title = splitTitleToArray.join("");
    }

    if (page?.description?.includes("metadata")) {
      const splitdescriptionToArray = page.description.split(/(?<=\/span)/);

      splitdescriptionToArray.map((titlePart) => {
        const idExists = regexp.exec(titlePart);

        if (idExists !== null && titlePart.includes("metadata")) {
          const index = splitdescriptionToArray.indexOf(titlePart);
          const titleMetadataId = idExists[0];
          if (
            !metadata.some((thisMetaData) => thisMetaData.id === titleMetadtaId)
          ) {
            titlePart = titlePart.replace(/\[.*?\]/, "[Deleted metadata]");
            splitdescriptionToArray[index] = titlePart;
          }
        }
      });
      page.description = splitdescriptionToArray.join("");
    }
  });

  return questionnaire;
};
