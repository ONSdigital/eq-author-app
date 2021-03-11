const Block = require("./Block");
const { isEmpty, reject, flatten, uniqWith, isEqual } = require("lodash");
const {
  buildAuthorConfirmationQuestion,
} = require("./builders/confirmationPage/ConfirmationPage");
const translateAuthorSkipconditions = require("./builders/skipConditions");

class Group {
  constructor(title, folder, ctx) {
    this.id = `group${folder.id}`;
    this.title = ctx.questionnaireJson.navigation ? title : "";
    this.blocks = this.buildBlocks(folder, ctx);

    this.skip_conditions = [];

    if (folder.skipConditions) {
      this.skip_conditions.push(
        ...translateAuthorSkipconditions(folder.skipConditions, ctx)
      );
    }

    if (!isEmpty(ctx.routingGotos)) {
      this.filterContext(this.id, ctx);
      const skipConditions = uniqWith(
        this.buildSkipConditions(this.id, ctx),
        isEqual
      );
      this.skip_conditions.push(...skipConditions);
    }

    if (!this.skip_conditions.length) {
      delete this.skip_conditions;
    }
  }

  filterContext(currentId, ctx) {
    ctx.routingGotos = reject(
      ctx.routingGotos,
      (rule) => rule.group === currentId
    );
  }

  buildSkipConditions(currentId, ctx) {
    return reject(ctx.routingGotos, (goto) => goto.groupId === currentId).map(
      ({ when }) => ({
        when,
      })
    );
  }

  buildBlocks(folder, ctx) {
    return flatten(
      folder.pages.map((page) => {
        const block = new Block(page, folder.id, ctx);
        if (page.confirmation) {
          return [
            block,
            buildAuthorConfirmationQuestion(
              page,
              folder.id,
              page.routingRuleSet,
              page.routing,
              ctx
            ),
          ];
        }
        return block;
      })
    );
  }
}

module.exports = Group;
