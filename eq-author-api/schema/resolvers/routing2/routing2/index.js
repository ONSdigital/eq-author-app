const isMutuallyExclusive = require("../../../../utils/isMutuallyExclusive");

const isMutuallyExclusiveDestination = isMutuallyExclusive([
  "sectionId",
  "pageId",
  "logical",
]);

const { flatMap, find } = require("lodash/fp");
const save = require("../../../../utils/saveQuestionnaire");
const createRouting = require("../../../../src/businessLogic/createRouting");

const Resolvers = {};

Resolvers.Routing2 = {
  else: routing => routing.else,
  page: ({ id }, args, ctx) => {
    const pages = flatMap(section => section.pages, ctx.questionnaire.sections);
    return find(page => {
      if (page.routing && page.routing.id === id) {
        return page;
      }
    }, pages);
  },
  rules: routing => routing.rules,
};

Resolvers.Mutation = {
  createRouting2: async (root, { input }, ctx) => {
    const pages = flatMap(section => section.pages, ctx.questionnaire.sections);
    const page = find({ id: input.pageId }, pages);

    if (page.routing) {
      throw new Error("Can only have one Routing per Page.");
    }

    page.routing = createRouting();
    save(ctx.questionnaire);
    return page.routing;
  },
  updateRouting2: async (root, { input }, ctx) => {
    if (!isMutuallyExclusiveDestination(input.else)) {
      throw new Error("Can only provide one destination.");
    }

    return ctx.modifiers.Routing.update({
      id: input.id,
      else: input.else,
    });
  },
};

module.exports = Resolvers;
