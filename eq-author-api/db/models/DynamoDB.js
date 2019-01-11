const dynamoose = require("dynamoose");

let throughput = "ON_DEMAND";
let questionnanaireTableName = "author-questionnaires";
let questionnanaireVersionsTableName = "author-questionnaire-versions";

if (process.env.DYNAMO_ENDPOINT_OVERRIDE !== "") {
  dynamoose.local(process.env.DYNAMO_ENDPOINT_OVERRIDE);
  throughput = { read: 10, write: 10 }; // DynamoDB local doesn't yet support on-demand
}

if (process.env.DYNAMO_QUESTIONNAIRE_TABLE_NAME !== "") {
  questionnanaireTableName = process.env.DYNAMO_QUESTIONNAIRE_TABLE_NAME;
}

if (process.env.DYNAMO_QUESTIONNAIRE_VERSION_TABLE_NAME !== "") {
  questionnanaireVersionsTableName =
    process.env.DYNAMO_QUESTIONNAIRE_VERSION_TABLE_NAME;
}

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

const questionnanaireSchema = new dynamoose.Schema(baseQuestionnaireSchema, {
  throughput: throughput,
});

const questionnaireVersionsSchema = new dynamoose.Schema(
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

const QuestionnaireModel = dynamoose.model(
  questionnanaireTableName,
  questionnanaireSchema
);

const QuestionnaireVersionsModel = dynamoose.model(
  questionnanaireVersionsTableName,
  questionnaireVersionsSchema
);

module.exports = {
  QuestionnaireModel,
  QuestionnaireVersionsModel,
};
