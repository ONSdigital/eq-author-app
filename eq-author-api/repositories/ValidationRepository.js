const Validation = require("../db/Validation");
const { head, flow, keys, remove, first } = require("lodash/fp");
const { DATE, DATE_RANGE } = require("../constants/answerTypes");
const { DATE: METADATA_DATE } = require("../constants/metadataTypes");

module.exports = knex => {
  const {
    getPreviousAnswersForPage
  } = require("./strategies/previousAnswersStrategy")(knex);

  const toggleValidationRule = ({ id, enabled }) => {
    return Validation(knex)
      .update(id, { enabled })
      .then(head);
  };

  const findByAnswerIdAndValidationType = ({ id }, validationType) => {
    return Validation(knex).find({ answerId: id, validationType });
  };

  const getInputType = flow(
    keys,
    remove(key => key === "id"),
    first
  );

  const updateValidationRule = input => {
    const {
      custom,
      entityType,
      previousAnswer: previousAnswerId,
      metadata: metadataId,
      ...config
    } = input[getInputType(input)];

    return Validation(knex)
      .update(input.id, {
        custom: JSON.stringify(custom),
        config: JSON.stringify(config),
        entityType,
        previousAnswerId,
        metadataId
      })
      .then(head);
  };

  const getPreviousAnswersForValidation = id =>
    knex("Answers")
      .select("PagesView.id as pageId")
      .select("Answers.type as answerType")
      .join(
        "Validation_AnswerRules",
        "Answers.id",
        "Validation_AnswerRules.answerId"
      )
      .join("PagesView", "Answers.questionPageId", "PagesView.id")
      .join("SectionsView", "PagesView.sectionId", "SectionsView.id")
      .where("Validation_AnswerRules.id", id)
      .then(head)
      .then(({ answerType, pageId: id }) =>
        getPreviousAnswersForPage({
          id,
          answerTypes: [answerType]
        })
      );

  const getMetadataForValidation = id =>
    knex("Answers")
      .select("SectionsView.questionnaireId")
      .select("Answers.type as answerType")
      .join(
        "Validation_AnswerRules",
        "Answers.id",
        "Validation_AnswerRules.answerId"
      )
      .join("PagesView", "Answers.questionPageId", "PagesView.id")
      .join("SectionsView", "PagesView.sectionId", "SectionsView.id")
      .where("Validation_AnswerRules.id", id)
      .then(head)
      .then(({ answerType, questionnaireId }) => {
        if (answerType === DATE || answerType === DATE_RANGE) {
          return knex("Metadata")
            .select("Metadata.*")
            .andWhere("type", METADATA_DATE)
            .andWhere({ questionnaireId })
            .andWhere({ isDeleted: false });
        } else {
          return []; //Currently do not support validation against any other types
        }
      });

  return {
    toggleValidationRule,
    findByAnswerIdAndValidationType,
    updateValidationRule,
    getPreviousAnswersForValidation,
    getMetadataForValidation
  };
};
