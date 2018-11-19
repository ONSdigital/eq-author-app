const db = require("../../db");

const getAnswers = ({ answerTypes, questionnaireId }) =>
  db("Answers")
    .select("Answers.*")
    .join("PagesView", "Answers.questionPageId", "PagesView.id")
    .join("SectionsView", "PagesView.sectionId", "SectionsView.id")
    .whereIn("Answers.type", answerTypes)
    .andWhere("Answers.isDeleted", false)
    .andWhere({ questionnaireId });

module.exports.getPreviousAnswersForSection = ({
  answerTypes,
  sectionPosition,
  questionnaireId
}) =>
  getAnswers({ answerTypes, questionnaireId }).andWhere(
    "SectionsView.position",
    "<",
    sectionPosition
  );

module.exports.getPreviousAnswersForSectionAndPage = ({
  answerTypes,
  sectionPosition,
  pagePosition,
  questionnaireId
}) =>
  getAnswers({ answerTypes, questionnaireId }).andWhere(query =>
    query
      .where("SectionsView.position", "<", sectionPosition)
      .orWhere(query =>
        query
          .where("SectionsView.position", sectionPosition)
          .andWhere("PagesView.position", "<", pagePosition)
      )
  );
