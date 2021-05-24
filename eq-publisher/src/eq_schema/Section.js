const Group = require("./Group");
const { getText } = require("../utils/HTMLUtils");
const { buildIntroBlock } = require("./Block");
const { cloneDeep } = require("lodash/fp");

class Section {
  static mergeDisabledFolders(oldFolders) {
    const folders = cloneDeep(oldFolders);
    const newFolders = [folders.shift()];

    folders.forEach((folder) => {
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
  }

  constructor(section, ctx) {
    this.id = `section${section.id}`;
    if (ctx.questionnaireJson.navigation) {
      this.title = getText(section.title);
    }

    const folderGroups = Section.mergeDisabledFolders(section.folders).map(
      (folder) => new Group(getText(section.title), folder, ctx)
    );

    // The Great Flattening:
    // flatten all folders down into one group for now
    // avoids issues with runner v2: calculated summaries, repeated routing summaries, section summaries
    this.groups = [
      {
        title: getText(section.title),
        id: `group${section.id}`,
        blocks: folderGroups.reduce(
          (acc, group) => [
            ...acc,
            ...group.blocks.map((block) =>
              group.skip_conditions
                ? { ...block, skip_conditions: group.skip_conditions }
                : block
            ),
          ],
          []
        ),
      },
    ];

    if (section.introductionTitle || section.introductionContent) {
      // Add introduction page if present
      this.groups[0].blocks.unshift(
        buildIntroBlock(
          section.introductionTitle,
          section.introductionContent,
          section.id,
          ctx
        )
      );
    }
  }
}

module.exports = Section;
