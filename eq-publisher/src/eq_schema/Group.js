/* eslint-disable camelcase */
const Block = require("./Block");
const { getInnerHTML } = require("../utils/HTMLUtils");
const { isEmpty, reject, flatten } = require("lodash");
const {
  buildAuthorConfirmationQuestion,
} = require("./builders/confirmationPage/ConfirmationPage");

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
        when,
      })
    );
  }

  buildBlocks(pages, groupId, introduction, ctx) {
    const blocks = flatten(
      pages.map(page => {
        const block = new Block(page, groupId, ctx);
        if (page.confirmation) {
          return [
            block,
            buildAuthorConfirmationQuestion(
              page,
              groupId,
              page.routingRuleSet,
              page.routing,
              ctx
            ),
          ];
        }
        return block;
      })
    );

    if (introduction.introductionEnabled) {
      return [Block.buildIntroBlock(introduction, groupId, ctx), ...blocks];
    }
    return blocks;
  }
}

module.exports = Group;
