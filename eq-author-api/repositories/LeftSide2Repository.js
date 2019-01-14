const { NULL } = require("../constants/routingNoLeftSide");

const { head } = require("lodash/fp");

const deriveType = side => {
  if (side.answerId) {
    return "Answer";
  }
  if (side.nullReason) {
    return "Null";
  }
  throw new Error(`Cannot derive type for ${JSON.stringify(side)}`);
};

module.exports = knex => {
  const insert = leftSide => {
    const type = deriveType(leftSide);
    const { expressionId, answerId, nullReason } = leftSide;
    return knex("Routing2_LeftSides")
      .insert({ expressionId, answerId, type, nullReason })
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
      .update({ answerId, type, nullReason: NULL })
      .returning("*")
      .then(head);

  const clearByAnswerId = (answerId, nullReason) =>
    knex("Routing2_LeftSides")
      .update({ answerId: null, type: "Null", nullReason })
      .where({ answerId })
      .returning("*");

  const setMissingDefaults = async ({ id, questionPageId }) => {
    const result = await knex.raw(
      `
      update "Routing2_LeftSides" 
        set "answerId" = ?, type = 'Answer', "nullReason"= '${NULL}' 
        where "expressionId" in (
          select binExp.id
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
              routing."pageId" = ? and ls.type = 'Null'
          ) 
        returning *;`,
      [id, questionPageId]
    );
    return result.rows;
  };

  return {
    insert,
    getByExpressionId,
    update,
    setMissingDefaults,
    clearByAnswerId,
  };
};
