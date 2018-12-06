const { head } = require("lodash/fp");
module.exports = knex => {
  const getPreviousAnswersForSection = ({
    answerTypes,
    sectionPosition,
    questionnaireId
  }) =>
    knex("Answers")
      .select("Answers.*")
      .join("PagesView", "Answers.questionPageId", "PagesView.id")
      .join("SectionsView", "PagesView.sectionId", "SectionsView.id")
      .whereIn("Answers.type", answerTypes)
      .andWhere("Answers.isDeleted", false)
      .andWhere({ questionnaireId })
      .andWhere("SectionsView.position", "<", sectionPosition);

  const getPreviousAnswersForPage = ({
    id,
    answerTypes,
    select = "Answers.*",
    includeSelf = false
  }) =>
    knex("PagesView")
      .select("SectionsView.position as sectionPosition")
      .select("PagesView.position as pagePosition")
      .select("SectionsView.questionnaireId")
      .join("SectionsView", "PagesView.sectionId", "SectionsView.id")
      .where("PagesView.id", id)
      .then(head)
      .then(({ questionnaireId, sectionPosition, pagePosition }) =>
        knex("PagesView")
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

  const getPreviousQuestionsForPage = ({
    id,
    answerTypes,
    includeSelf = false
  }) =>
    getPreviousAnswersForPage({
      id,
      answerTypes,
      select: "PagesView.*",
      includeSelf
    });

  return {
    getPreviousAnswersForSection,
    getPreviousAnswersForPage,
    getPreviousQuestionsForPage
  };
};
