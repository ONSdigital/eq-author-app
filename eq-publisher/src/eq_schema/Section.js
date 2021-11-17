const Group = require("./Group");
const { getText } = require("../utils/HTMLUtils");
const { flatMap } = require("lodash");

class Section {
  constructor(section, ctx) {
    this.id = `section${section.id}`;
    if (ctx.questionnaireJson.navigation) {
      this.title = getText(section.title);
    }

    const pages = flatMap(section.folders, (folder) =>
      flatMap(folder.pages, (page) =>
        folder.skipConditions
          ? {
              ...page,
              skipConditions: [
                ...folder.skipConditions,
                ...(page.skipConditions || []),
              ],
            }
          : page
      )
    );

    this.groups = [
      new Group(getText(section.title), { ...section, pages }, ctx),
    ];

    if (section.sectionSummary) {
      const sectionSummary = {
        id: `summary-group${section.id}`,
        title: "Section summary",
        blocks: [
          {
            id: `summary${section.id}`,
            type: "SectionSummary",
            collapsible: section.collapsibleSummary,
          },
        ],
      };
      // Hacky way of putting a skip condition on the summary block. Add the first skip from the group first group
      if (this.groups[0].blocks[0].skip_conditions) {
        sectionSummary.skip_conditions =
          this.groups[0].blocks[0].skip_conditions;
      }
      this.groups.push(sectionSummary);
    }
  }
}

module.exports = Section;
