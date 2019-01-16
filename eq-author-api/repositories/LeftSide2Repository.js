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
    return knex("Routing2_LeftSides")
      .insert({ expressionId, answerId, type })
      .returning("*")
      .then(head);
  };

  const getByExpressionId = expressionId =>
    knex("Routing2_LeftSides")
      .select()
      .where({ expressionId })
      .first();

  const update = ({ id, answerId, type }) =>
    knex("Routing2_LeftSides")
      .where({ id })
      .update({ answerId, type })
      .returning("*")
      .then(head);

  const deleteByAnswerId = answerId =>
    knex("Routing2_LeftSides")
      .where({ answerId })
      .del()
      .returning("*");

  const insertMissingDefaults = async ({ id, questionPageId }) => {
    const result = await knex.raw(
      `
      insert into "Routing2_LeftSides" ("expressionId", "answerId", "type")(
        select binExp.id, ?, 'Answer'
        from 
          "Routing2_Routing" as routing
          inner join "Routing2_Rules" as rules
            on rules."routingId" = routing.id
          inner join "Routing2_ExpressionGroups" as expGroup
            on expGroup."ruleId" = rules.id
          inner join "Routing2_BinaryExpressions" as binExp
            on binExp."expressionGroupId" = expGroup.id
          left outer join "Routing2_LeftSides" as ls 
            on ls."expressionId" = binExp.id
        where
          routing."pageId" = ? and ls.id is null
    ) returning *;`,
      [id, questionPageId]
    );
    return result.rows;
  };

  return {
    insert,
    getByExpressionId,
    update,
    insertMissingDefaults,
    deleteByAnswerId,
  };
};
