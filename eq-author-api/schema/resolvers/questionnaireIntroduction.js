const { omit, first, remove } = require("lodash");
const uuid = require("uuid").v4;

const { createMutation } = require("./createMutation");
const { getCommentsForQuestionnaire } = require("../../utils/datastore");

const createCollapsible = options => ({
  id: uuid(),
  title: "",
  description: "",
  ...options,
});

const Resolvers = {};
Resolvers.Query = {
  questionnaireIntroduction: (root, args, ctx) =>
    ctx.questionnaire.introduction,
};
Resolvers.Mutation = {
  updateQuestionnaireIntroduction: createMutation((_, { input }, ctx) => {
    const introduction = ctx.questionnaire.introduction;
    Object.assign(introduction, omit(input, "id"));
    return introduction;
  }),
  createCollapsible: createMutation((_, { input }, ctx) => {
    const collapsible = createCollapsible(omit(input, "introductionId"));
    ctx.questionnaire.introduction.collapsibles.push(collapsible);
    return collapsible;
  }),
  updateCollapsible: createMutation((_, { input: { id, ...rest } }, ctx) => {
    const collapsible = ctx.questionnaire.introduction.collapsibles.find(
      c => c.id === id
    );
    Object.assign(collapsible, rest);
    return collapsible;
  }),
  moveCollapsible: createMutation((_, { input: { id, position } }, ctx) => {
    const introduction = ctx.questionnaire.introduction;
    const collapsibleMoving = first(remove(introduction.collapsibles, { id }));
    introduction.collapsibles.splice(position, 0, collapsibleMoving);
    return collapsibleMoving;
  }),
  deleteCollapsible: createMutation((_, { input: { id } }, ctx) => {
    const introduction = ctx.questionnaire.introduction;
    remove(introduction.collapsibles, { id });
    return introduction;
  }),
};
Resolvers.QuestionnaireIntroduction = {
  availablePipingMetadata: (root, args, ctx) => ctx.questionnaire.metadata,
  availablePipingAnswers: () => [],
  comments: async ({ id }, args, ctx) => {
    console.log(
      "\nQuestionnaireIntroduction.js/.Resolvers.QuestionnaireIntroduction.comments ***** - id :",
      id
    );

    const questionnaireId = ctx.questionnaire.id;
    const questionnareComments = await getCommentsForQuestionnaire(
      questionnaireId
    );
    console.log(
      "\n questionnaireIntroduction.js/Resolvers.questionnaireIntroduction.comments - return :",
      questionnareComments.comments[id]
    );
    return questionnareComments.comments[id] || [];
  },
};

Resolvers.Collapsible = {
  introduction: (root, args, ctx) => ctx.questionnaire.introduction,
};

module.exports = [Resolvers];
