const {
  flow,
  head,
  isBoolean,
  isObject,
  map,
  omit,
  assign,
  values,
  includes,
  flatten
} = require("lodash/fp");
const { get, merge } = require("lodash");

const Answer = require("../db/Answer");

const childAnswerParser = require("../utils/childAnswerParser");
const getDefaultAnswerProperties = require("../utils/defaultAnswerProperties");
const { answerTypeMap } = require("../utils/defaultAnswerValidations");

const OptionRepository = require("./OptionRepository");

const {
  createDefaultValidationsForAnswer
} = require("./strategies/validationStrategy");
const {
  createOtherAnswerStrategy,
  deleteOtherAnswerStrategy
} = require("./strategies/multipleChoiceOtherAnswerStrategy");

const {
  handleAnswerDeleted,
  handleAnswerCreated
} = require("./strategies/routingStrategy");

const handleDeprecatedMandatoryFieldFromDb = answer =>
  isObject(answer)
    ? merge({}, answer, { mandatory: get(answer, "properties.required") })
    : answer;

const handleDeprecatedMandatoryFieldToDb = answer =>
  isBoolean(answer.mandatory)
    ? merge({}, answer, { properties: { required: answer.mandatory } })
    : answer;

const fromDb = flow(handleDeprecatedMandatoryFieldFromDb);

const toDb = flow(
  handleDeprecatedMandatoryFieldToDb,
  omit("mandatory")
);

module.exports = knex => {
  const findAll = (where = {}, orderBy = "createdAt", direction = "asc") =>
    Answer(knex)
      .findAll()
      .where({ isDeleted: false, parentAnswerId: null })
      .where(where)
      .orderBy(orderBy, direction)
      .then(map(fromDb));

  const getById = id =>
    Answer(knex)
      .findById(id)
      .where({ isDeleted: false })
      .then(fromDb);

  const insert = (
    {
      description,
      guidance,
      label,
      secondaryLabel,
      qCode,
      type,
      mandatory,
      properties,
      questionPageId
    },
    trx
  ) =>
    trx("Answers")
      .insert(
        toDb({
          description,
          guidance,
          label,
          secondaryLabel,
          qCode,
          type,
          mandatory,
          properties,
          questionPageId
        })
      )
      .returning("*")
      .then(head)
      .then(fromDb)
      .tap(answer => handleAnswerCreated(trx, answer));

  const update = ({
    id,
    description,
    guidance,
    label,
    secondaryLabel,
    qCode,
    type,
    isDeleted,
    parentAnswerId,
    mandatory,
    properties
  }) => {
    if (childAnswerParser(id) === "secondary") {
      secondaryLabel = label;
      label = undefined;
    }
    return Answer(knex)
      .update(
        id,
        toDb({
          description,
          guidance,
          label,
          secondaryLabel,
          qCode,
          type,
          isDeleted,
          parentAnswerId,
          mandatory,
          properties
        })
      )
      .then(head)
      .then(fromDb);
  };

  const createAnswer = async answerConfig => {
    return knex.transaction(async trx => {
      const defaultProperties = getDefaultAnswerProperties(answerConfig.type);
      const input = merge({}, answerConfig, {
        properties: defaultProperties
      });
      const answer = await insert(input, trx);

      if (includes(answer.type, flatten(values(answerTypeMap)))) {
        await createDefaultValidationsForAnswer(answer, trx);
      }

      if (answer.type === "Checkbox" || answer.type === "Radio") {
        const defaultOptions = [];
        const defaultOption = {
          label: "",
          description: "",
          value: "",
          qCode: "",
          answerId: answer.id
        };

        defaultOptions.push(defaultOption);

        if (answer.type === "Radio") {
          defaultOptions.push(defaultOption);
        }

        const promises = defaultOptions.map(it =>
          OptionRepository(trx).insert(it)
        );

        await Promise.all(promises);
      }

      return answer;
    });
  };

  const deleteAnswer = async (trx, id) => {
    const deletedAnswer = await trx("Answers")
      .where({
        id: parseInt(id)
      })
      .update({ isDeleted: true })
      .returning("*")
      .then(head)
      .then(fromDb);

    await handleAnswerDeleted(trx, id);

    return deletedAnswer;
  };

  const remove = id => knex.transaction(trx => deleteAnswer(trx, id));

  const undelete = id =>
    Answer(knex)
      .update(id, { isDeleted: false })
      .then(head)
      .then(fromDb);

  const getOtherAnswer = (
    id,
    where = {},
    orderBy = "createdAt",
    direction = "asc"
  ) =>
    Answer(knex)
      .findAll()
      .where({ isDeleted: false, parentAnswerId: id })
      .where(where)
      .orderBy(orderBy, direction)
      .first()
      .then(fromDb);

  const createOtherAnswer = ({ id }) => {
    return knex.transaction(trx =>
      createOtherAnswerStrategy(trx, { id }).then(fromDb)
    );
  };

  const deleteOtherAnswer = ({ id }) => {
    return knex.transaction(trx =>
      deleteOtherAnswerStrategy(trx, { id }).then(fromDb)
    );
  };

  const splitComposites = answer => {
    const firstAnswer = omit("secondaryLabel", answer);
    const secondAnswer = omit("label", answer);
    return [
      assign(firstAnswer, {
        id: `${answer.id}from`
      }),
      assign(secondAnswer, {
        id: `${answer.id}to`,
        label: secondAnswer.secondaryLabel
      })
    ];
  };

  const lookupComposite = async (where = {}) => {
    return knex("CompositeAnswerView")
      .select("*")
      .where({ isDeleted: false, parentAnswerId: null })
      .where(where)
      .then(head)
      .then(fromDb);
  };

  const getAnswers = async ids => {
    return Promise.all(
      ids.map(id => {
        if (childAnswerParser(id)) {
          return lookupComposite({ id });
        } else {
          return getById(id);
        }
      })
    );
  };

  return {
    findAll,
    getById,
    insert,
    update,
    remove,
    undelete,
    getOtherAnswer,
    createOtherAnswer,
    deleteOtherAnswer,
    splitComposites,
    getAnswers,
    createAnswer
  };
};
