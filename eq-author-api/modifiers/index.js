module.exports = repositories => {
  const modifiers = {};
  modifiers.BinaryExpression = require("./BinaryExpression")({
    repositories,
    modifiers
  });
  modifiers.Routing = require("./Routing")({ repositories, modifiers });
  modifiers.RoutingRule = require("./RoutingRule")({
    repositories,
    modifiers
  });

  return modifiers;
};
