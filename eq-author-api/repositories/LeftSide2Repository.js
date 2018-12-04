const { head } = require("lodash/fp");

const deriveType = side => {
  if (side.answerId) {
    return "Answer";
  }
  throw new Error(`Cannot derive type for ${JSON.stringify(side)}`);
};

module.exports = knex => {
  const insert = leftSide => {
    const type = deriveType(leftSide);
    const { expressionId, answerId } = leftSide;
    return knex("LeftSides2")
      .insert({ expressionId, answerId, type })
      .returning("*")
      .then(head);
  };

  const getByExpressionId = expressionId =>
    knex("LeftSides2")
      .select()
      .where({ expressionId })
      .first();

  return { insert, getByExpressionId };
};
