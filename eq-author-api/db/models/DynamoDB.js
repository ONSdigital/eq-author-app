const dynamoose = require("dynamoose");

let throughput = "ON_DEMAND";
let questionnanaireTableName = "author-questionnaires";
let questionnanaireVersionsTableName = "author-questionnaire-versions";
let userTableName = "author-users";

if (process.env.DYNAMO_ENDPOINT_OVERRIDE) {
  dynamoose.local(process.env.DYNAMO_ENDPOINT_OVERRIDE);
  throughput = { read: 10, write: 10 }; // DynamoDB local doesn't yet support on-demand
}

if (process.env.DYNAMO_QUESTIONNAIRE_TABLE_NAME) {
  questionnanaireTableName = process.env.DYNAMO_QUESTIONNAIRE_TABLE_NAME;
}

if (process.env.DYNAMO_QUESTIONNAIRE_VERSION_TABLE_NAME) {
  questionnanaireVersionsTableName =
    process.env.DYNAMO_QUESTIONNAIRE_VERSION_TABLE_NAME;
}

if (process.env.DYNAMO_USER_TABLE_NAME) {
  userTableName = process.env.DYNAMO_USER_TABLE_NAME;
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
  createdBy: {
    type: String,
  },
  version: {
    type: Number,
  },
};

const questionnanaireSchema = new dynamoose.Schema(
  {
    ...baseQuestionnaireSchema,
    latestVersion: {
      type: Date,
      required: true,
    },
  },
  {
    throughput: throughput,
    timestamps: true,
  }
);

const questionnaireVersionsSchema = new dynamoose.Schema(
  {
    ...baseQuestionnaireSchema,
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
    summary: {
      type: Boolean,
    },
    createdAt: {
      type: Date,
    },
    updatedAt: {
      type: Date,
      required: true,
      rangeKey: true,
    },
    sections: {
      type: Array,
      required: true,
    },
    metadata: {
      type: Array,
    },
  },
  {
    throughput,
  }
);

const userSchema = new dynamoose.Schema(
  {
    id: {
      type: String,
      hashKey: true,
      required: true,
    },
    email: {
      type: String,
    },
    name: {
      type: String,
    },
    sub: {
      type: String,
      required: true,
    },
    picture: {
      type: String,
    },
  },
  {
    throughput,
    timestamps: true,
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

const UserModel = dynamoose.model(userTableName, userSchema);

module.exports = {
  QuestionnaireModel,
  QuestionnaireVersionsModel,
  dynamoose,
  UserModel,
};
