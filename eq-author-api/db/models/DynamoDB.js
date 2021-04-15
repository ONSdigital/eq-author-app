const dynamoose = require("dynamoose");
const { pick } = require("lodash/fp");

let throughput = "ON_DEMAND";
let questionnanaireTableName = "author-questionnaires";
let questionnanaireVersionsTableName = "author-questionnaire-versions";
let userTableName = "author-users";
let commentsTableName = "author-comments";

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
if (process.env.DYNAMO_COMMENTS_TABLE_NAME) {
  commentsTableName = process.env.DYNAMO_COMMENTS_TABLE_NAME;
}

const baseQuestionnaireSchema = {
  id: {
    type: String,
    hashKey: true,
    required: true,
  },
  isPublic: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
  },
  createdBy: {
    type: String,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  shortTitle: {
    type: String,
  },
  publishStatus: {
    type: String,
  },
  introduction: {
    type: Object,
  },
  editors: {
    type: Array,
  },
  previewTheme: {
    type: String,
    required: true,
  },
  themes: {
    type: Array,
    required: true,
  },
  locked: {
    type: Boolean,
  },
};

const questionnanaireSchema = new dynamoose.Schema(
  {
    ...baseQuestionnaireSchema,
    updatedAt: {
      type: Date,
      required: true,
    },
    history: {
      type: Array,
      required: true,
    },
  },
  {
    throughput: throughput,
  }
);

const LIST_FIELDS = [
  ...Object.keys(baseQuestionnaireSchema),
  "updatedAt",
  "history",
];
const justListFields = pick(LIST_FIELDS);

const questionnaireVersionsSchema = new dynamoose.Schema(
  {
    ...baseQuestionnaireSchema,
    version: {
      type: Number,
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
    summary: {
      type: Boolean,
    },
    collapsibleSummary: {
      type: Boolean,
    },
    sections: {
      type: Array,
      required: true,
    },
    metadata: {
      type: Array,
      required: true,
    },
    updatedAt: {
      type: Date,
      required: true,
      rangeKey: true,
    },
    publishDetails: {
      type: Object,
    },
    surveyVersion: {
      type: String,
    },
  },
  {
    throughput: throughput,
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
    externalId: {
      type: String,
      required: true,
    },
    picture: {
      type: String,
    },
    starredQuestionnaires: {
      type: Object,
    },
  },
  {
    throughput,
    timestamps: true,
  }
);

const commentsSchema = new dynamoose.Schema({
  questionnaireId: { type: String, hashKey: true, required: true },
  comments: {
    type: Object,
  },
});

const QuestionnaireModel = dynamoose.model(
  questionnanaireTableName,
  questionnanaireSchema
);

const QuestionnaireVersionsModel = dynamoose.model(
  questionnanaireVersionsTableName,
  questionnaireVersionsSchema
);

const UserModel = dynamoose.model(userTableName, userSchema);

const CommentsModel = dynamoose.model(commentsTableName, commentsSchema);

module.exports = {
  QuestionnaireModel,
  QuestionnaireVersionsModel,
  dynamoose,
  justListFields,
  UserModel,
  CommentsModel,
};
