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
      .andWhere("SectionsView.position", "<", sectionPosition)
      .orderBy("SectionsView.position", "asc")
      .orderBy("PagesView.position", "asc")
      .orderBy("Answers.id", "asc");

  const getPreviousAnswersForPage = async ({
    id,
    answerTypes,
    select = "Answers.*",
    includeSelf = false
  }) => {
    const { questionnaireId, sectionPosition, pagePosition } = await knex(
      "PagesView"
    )
      .select("SectionsView.position as sectionPosition")
      .select("PagesView.position as pagePosition")
      .select("SectionsView.questionnaireId")
      .join("SectionsView", "PagesView.sectionId", "SectionsView.id")
      .where("PagesView.id", id)
      .first();

    return knex("PagesView")
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
      .orderBy("SectionsView.position", "asc")
      .orderBy("PagesView.position", "asc")
      .orderBy("Answers.id", "asc");
  };

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
