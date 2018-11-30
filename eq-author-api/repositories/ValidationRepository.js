const db = require("../db");
const Validation = require("../db/Validation");
const { head, flow, keys, remove, first } = require("lodash/fp");
const {
  getPreviousAnswersForSectionAndPage
} = require("./strategies/previousAnswersStrategy");
const { DATE: ANSWER_DATE } = require("../constants/answerTypes");
const { DATE: METADATA_DATE } = require("../constants/metadataTypes");

const toggleValidationRule = ({ id, enabled }) => {
  return Validation.update(id, { enabled }).then(head);
};

const findByAnswerIdAndValidationType = ({ id }, validationType) => {
  return Validation.find({ answerId: id, validationType });
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

  return Validation.update(input.id, {
    custom: JSON.stringify(custom),
    config: JSON.stringify(config),
    entityType,
    previousAnswerId,
    metadataId
  }).then(head);
};

const getPreviousAnswersForValidation = id =>
  db("Answers")
    .select("SectionsView.position as sectionPosition")
    .select("PagesView.position as pagePosition")
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
    .then(({ answerType, ...rest }) =>
      getPreviousAnswersForSectionAndPage({
        answerTypes: [answerType],
        ...rest
      })
    );

const getMetadataForValidation = id =>
  db("Answers")
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
      if (answerType === ANSWER_DATE) {
        return db("Metadata")
          .select("Metadata.*")
          .andWhere("type", METADATA_DATE)
          .andWhere({ questionnaireId })
          .andWhere({ isDeleted: false });
      } else {
        return []; //Currently do not support validation against any other types
      }
    });

Object.assign(module.exports, {
  toggleValidationRule,
  findByAnswerIdAndValidationType,
  updateValidationRule,
  getPreviousAnswersForValidation,
  getMetadataForValidation
});
