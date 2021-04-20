const Resolvers = {};
const { returnValidationErrors } = require("../../utils");
const { getPageById, getSectionById } = require("../../utils");

Resolvers.Destination2 = {
  page: ({ pageId }, args, ctx) => (pageId ? getPageById(ctx, pageId) : null),
  section: ({ sectionId }, args, ctx) =>
    sectionId ? getSectionById(ctx, sectionId) : null,
  validationErrorInfo: ({ id }, _args, ctx) =>
    returnValidationErrors(
      ctx,
      id,
      ({ destinationId }) => destinationId === id
    ),
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
