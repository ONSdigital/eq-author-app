const dynamoose = require("dynamoose");

let throughput = "ON_DEMAND";
let questionnanaireTableName = "questionnaires";
let questionnanaireVersionsTableName = "questionnaire-versions";

if (process.env.DYNAMO_ENDPOINT !== "") {
  dynamoose.local(process.env.DYNAMO_ENDPOINT);
  throughput = { read: 10, write: 10 }; // DynamoDB local doesn't yet support on-demand
}

if (process.env.DYNAMO_QUESTIONNAIRE_TABLE_NAME !== "") {
  questionnanaireTableName = process.env.DYNAMO_QUESTIONNAIRE_TABLE_NAME;
}

if (process.env.DYNAMO_QUESTIONNAIRE_VERSION_TABLE_NAME !== "") {
  questionnanaireVersionsTableName =
    process.env.DYNAMO_QUESTIONNAIRE_VERSION_TABLE_NAME;
}

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
  throughput: throughput,
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
    throughput: throughput,
  }
);

const QuestionnanaireModel = dynamoose.model(
  questionnanaireTableName,
  questionnanaireSchema
);

const QuestionnanaireVersionsModel = dynamoose.model(
  questionnanaireVersionsTableName,
  questionnaireVersionsSchema
);

module.exports = {
  QuestionnanaireModel,
  QuestionnanaireVersionsModel,
};
