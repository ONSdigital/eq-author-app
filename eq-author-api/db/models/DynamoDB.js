const dynamoose = require("dynamoose");

const Schema = dynamoose.Schema;

const baseQuestionnaireSchema = {
  id: {
    type: String,
    hashKey: true,
    required: true,
  },
  title: {
    type: String,
  },
  createdAt: {
    type: String,
  },
  createdBy: {
    type: String,
  },
  description: {
    type: String,
  },
  legalBasis: {
    type: String,
  },
  navigation: {
    type: Boolean,
  },
  surveyId: {
    type: String,
  },
  theme: {
    type: String,
  },
};

const questionnanaireSchema = new Schema(baseQuestionnaireSchema, {
  throughput: "ON_DEMAND",
});

const questionnaireVersionsSchema = new Schema(
  {
    ...baseQuestionnaireSchema,
    updatedAt: {
      type: String,
      rangeKey: true,
      required: true,
    },
    sections: {
      type: [Array],
      required: true,
    },
    metadata: {
      type: [Array],
    },
  },
  {
    throughput: "ON_DEMAND",
  }
);

const QuestionnanaireModel = dynamoose.model(
  "author-questionnaires",
  questionnanaireSchema
);

const QuestionnanaireVersionsModel = dynamoose.model(
  "author-questionnaire-versions",
  questionnaireVersionsSchema
);

module.exports = {
  QuestionnanaireModel,
  QuestionnanaireVersionsModel,
};
