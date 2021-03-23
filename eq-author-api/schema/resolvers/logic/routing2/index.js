const Resolvers = {};
const { getSectionById } = require("../../utils/sections");
const { getPageById } = require("../../utils/pages");

Resolvers.Destination2 = {
  page: ({ pageId }, args, ctx) => (pageId ? getPageById(ctx, pageId) : null),
  section: ({ sectionId }, args, ctx) =>
    sectionId ? getSectionById(ctx, sectionId) : null,
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
