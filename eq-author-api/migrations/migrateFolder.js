module.exports = (questionnaire) => {
  questionnaire.sections.forEach((section) => {
    const newFolders = section.folders.reduce((folders, folder) => {
      if (!folders && folder) {
        folder.push(folder);
        return folders;
      }
      if (
        folder.enabled === false &&
        folders[folders.length - 1].enabled === false
      ) {
        folders[folders.length - 1].pages.push(folder.pages);
      }
      folder.push(folder);
      return folders;
    }, []);
    section.folders = newFolders;
  });

  return questionnaire;
};
