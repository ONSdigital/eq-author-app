const Group = require("./Group");
const { getText } = require("../utils/HTMLUtils");

const mergeDisabledFolders = oldFolders => {
  const folders = [...oldFolders];
  const newFolders = [folders.pop()];

  folders.forEach(folder => {
    if (folder.enabled) {
      newFolders.push(folder);
    } else {
      const lastMergedFolder = newFolders[newFolders.length - 1];
      if (lastMergedFolder.enabled) {
        newFolders.push(folder);
      } else {
        lastMergedFolder.pages.push(...folder.pages);
      }
    }
  });

  return newFolders;
};

class Section {
  constructor(section, ctx) {
    this.id = `section${section.id}`;
    if (ctx.questionnaireJson.navigation) {
      this.title = getText(section.title);
    }

    // Map folders to eq-runner "groups"
    // No need to make a group for each; we merge disabled (hidden) folders together where possible
    this.groups = mergeDisabledFolders(section.folders).map(
      folder => new Group(getText(section.title), folder, ctx)
    );
  }
}

module.exports = Section;
