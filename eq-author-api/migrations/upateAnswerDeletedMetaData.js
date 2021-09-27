const { getPages } = require("../schema/resolvers/utils");

module.exports = (questionnaire) => {
  const ctx = {
    questionnaire,
  };
  const { metadata } = questionnaire;
  const pages = getPages(ctx);
  console.log(`pages`, pages);

  pages.map((page) => {
    console.log(`metadata`, metadata);

    if (page?.title.includes("metadata")) {
      console.log(`page.title`, page.title);

      //   page.title = page.title.replace(
      //     "[deletedMetadata.alias,]",
      //     "[Deleted metadata]"
      //   );

      const splitTitleToArray = page.title.split("/span");
      console.log(`splitTitleToArray`, splitTitleToArray);

      const regexp =
        // /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89AB][0-9a-f]{3}-[0-9a-f]{12}$/gi;
        /[\w]{8}-[\w]{4}-[\w]{4}-[\w]{4}-[\w]{12}/i;

      splitTitleToArray.map((titlePart) => {
        console.log(`thisTitle`, titlePart);

        const idExists = regexp.exec(titlePart);

        console.log(`idExists`, idExists);

        if (idExists !== null && titlePart.includes("metadata")) {
          console.log(`result INSIDE`, idExists);
          // console.log(
          //   `splitTitleToArray indexOf`,
          //   splitTitleToArray.indexOf(titlePart)
          // );
          const index = splitTitleToArray.indexOf(titlePart);

          const titleMetadtaId = idExists[0];
          console.log(`titleMetadtaId`, titleMetadtaId);
          if (
            metadata.some((thisMetaData) => thisMetaData.id === titleMetadtaId)
          ) {
            console.log(`FOUND`);
          } else {
            console.log(`"NOT FOUND"`, titlePart);
            // var titlePart2 = titlePart.replace(/[.*]/, "[Deleted metadata]");
            titlePart = titlePart.replace(/\[.*?\]/, "[Deleted metadata]");

            console.log(`index`, index);
            splitTitleToArray[index] = titlePart;
            console.log(`NEW titlePart`, titlePart);
          }
        }
      });
      console.log(`NEW splitTitleToArray`, splitTitleToArray);

      console.log(`page.title OLD`, page.title);

      page.title = splitTitleToArray.join("");
      console.log(`page.title NEW`, page.title);
    }

    // if (description.includes(deletedMetadata.id)) {
    //   page.description = page.description.replace(
    //     deletedMetadata.alias,
    //     "Deleted metadata"
    //   );
    // }
  });

  console.log(`questionnaire`, JSON.stringify(questionnaire, null, 7));

  return questionnaire;
};
