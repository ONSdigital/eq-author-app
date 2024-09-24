const { v4: uuidv4 } = require("uuid");

const mockQuestionnaire = ({
  title,
  ownerId,
  createdAt,
  isPublic,
  editors,
  shortTitle,
}) => {
  const questionnaire = {
    title: title || "Default questionnaire title",
    shortTitle,
    theme: "business",
    legalBasis: "Voluntary",
    navigation: false,
    metadata: [],
    sections: [
      {
        id: uuidv4(),
        title: "",
        introductionEnabled: false,
        pages: [
          {
            id: uuidv4(),
            pageType: "QuestionPage",
            title: "",
            description: "",
            descriptionEnabled: false,
            guidanceEnabled: false,
            definitionEnabled: false,
            additionalInfoEnabled: false,
            answers: [],
            routing: null,
            alias: null,
          },
        ],
        alias: "",
      },
    ],
    summary: false,
    version: 13,
    surveyVersion: 1,
    editors: editors || [],
    isPublic: isPublic ?? true,
    publishStatus: "Unpublished",
    createdBy: ownerId || "test-user",
    createdAt,
  };
  return questionnaire;
};

module.exports = mockQuestionnaire;
