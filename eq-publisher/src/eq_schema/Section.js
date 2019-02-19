const Group = require("./Group");
const { getText } = require("../utils/HTMLUtils");

class Section {
  constructor(section, ctx) {
    this.id = `section${section.id}`;
    if (ctx.questionnaireJson.navigation) {
      this.title = getText(section.title);
    }
    this.groups = this.buildGroups(section, ctx);
  }

  buildGroups(section, ctx) {
    // Sections always contain a single group currently
    return [new Group(getText(section.title), section, ctx)];
  }
}

module.exports = Section;
