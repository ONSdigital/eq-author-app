const Resolvers = {};

const { find, flatMap } = require("lodash/fp");

Resolvers.Destination2 = {
  page: ({ pageId }, args, ctx) =>
    pageId
      ? find(
          { id: pageId },
          flatMap(section => section.pages, ctx.questionnaire.sections)
        )
      : null,
  section: ({ sectionId }, args, ctx) =>
    sectionId ? find({ id: sectionId }, ctx.questionnaire.sections) : null,
};

Resolvers.Expression2 = {
  __resolveType: () => "BinaryExpression2",
};

module.exports = [
  Resolvers,
  require("./routing2"),
  require("./routingRule2"),
  require("./expressionGroup2"),
];
