/* eslint-disable camelcase */
const Block = require("./Block");
const { getInnerHTML } = require("../utils/HTMLUtils");
const { isEmpty, reject } = require("lodash");

class Group {
  constructor(id, title, pages, introduction, ctx) {
    this.id = `group${id}`;
    this.title = getInnerHTML(title);
    this.blocks = this.buildBlocks(pages, id, introduction, ctx);

    if (!isEmpty(ctx.routingGotos)) {
      this.filterContext(this.id, ctx);
      const skipConditions = this.buildSkipConditions(this.id, ctx);

      if (!isEmpty(skipConditions)) {
        this.skip_conditions = skipConditions;
      }
    }
  }

  filterContext(currentId, ctx) {
    ctx.routingGotos = reject(
      ctx.routingGotos,
      rule => rule.group === currentId
    );
  }

  buildSkipConditions(currentId, ctx) {
    return reject(ctx.routingGotos, goto => goto.groupId === currentId).map(
      ({ when }) => ({
        when
      })
    );
  }

  buildBlocks(pages, groupId, introduction, ctx) {
    const blocks = pages.map(page => new Block(page, groupId, ctx));
    if (introduction.introductionEnabled) {
      return [Block.buildIntroBlock(introduction, groupId), ...blocks];
    }
    return blocks;
  }
}

module.exports = Group;
