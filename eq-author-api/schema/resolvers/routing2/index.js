const Resolvers = {};

Resolvers.Destination2 = {
  page: ({ pageId }, args, ctx) =>
    pageId ? ctx.repositories.QuestionPage.getById(pageId) : null,
  section: ({ sectionId }, args, ctx) =>
    sectionId ? ctx.repositories.Section.getById(sectionId) : null,
};

Resolvers.Expression2 = {
  __resolveType: () => "BinaryExpression2",
};

module.exports = [
  Resolvers,
  require("./routing2"),
  require("./routingRule2"),
  require("./expressionGroup2"),
  require("./binaryExpression2"),
];
