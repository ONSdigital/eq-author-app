const db = require("../../db");
const { head } = require("lodash/fp");

module.exports.getPreviousAnswersForSection = ({
  answerTypes,
  sectionPosition,
  questionnaireId
}) =>
  db("Answers")
    .select("Answers.*")
    .join("PagesView", "Answers.questionPageId", "PagesView.id")
    .join("SectionsView", "PagesView.sectionId", "SectionsView.id")
    .whereIn("Answers.type", answerTypes)
    .andWhere("Answers.isDeleted", false)
    .andWhere({ questionnaireId })
    .andWhere("SectionsView.position", "<", sectionPosition);

module.exports.getPreviousAnswersForPage = ({
  id,
  answerTypes,
  select = "Answers.*",
  includeSelf = false
}) =>
  db("PagesView")
    .select("SectionsView.position as sectionPosition")
    .select("PagesView.position as pagePosition")
    .select("SectionsView.questionnaireId")
    .join("SectionsView", "PagesView.sectionId", "SectionsView.id")
    .where("PagesView.id", id)
    .then(head)
    .then(({ questionnaireId, sectionPosition, pagePosition }) =>
      db("PagesView")
        .select(select)
        .join("Answers", "Answers.questionPageId", "PagesView.id")
        .join("SectionsView", "PagesView.sectionId", "SectionsView.id")
        .whereIn("Answers.type", answerTypes)
        .andWhere("Answers.isDeleted", false)
        .andWhere({ questionnaireId })
        .andWhere("SectionsView.position", "<=", sectionPosition)
        .andWhere(query =>
          query
            .where("SectionsView.position", "<", sectionPosition)
            .orWhere(query =>
              query
                .where("SectionsView.position", sectionPosition)
                .andWhere(
                  "PagesView.position",
                  includeSelf ? "<=" : "<",
                  pagePosition
                )
            )
        )
    );

module.exports.getPreviousQuestionsForPage = ({
  id,
  answerTypes,
  includeSelf = false
}) =>
  this.getPreviousAnswersForPage({
    id,
    answerTypes,
    select: "PagesView.*",
    includeSelf
  });
