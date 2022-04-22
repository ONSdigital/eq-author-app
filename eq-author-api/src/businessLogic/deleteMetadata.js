const { logger } = require("../../utils/logger");

module.exports = (deletedMetadata, pages) => {
  logger.info(`Removed MetaData with ID ${deletedMetadata.id}`);

  if (pages) {
    pages.forEach((page) => {
      const { title, description } = page;

      if (title?.includes(deletedMetadata.id)) {
        page.title = page.title.replace(
          deletedMetadata.alias,
          "Deleted metadata"
        );
      }
      if (description?.includes(deletedMetadata.id)) {
        page.description = page.description.replace(
          deletedMetadata.alias,
          "Deleted metadata"
        );
      }
    });
    return pages;
  }
};
