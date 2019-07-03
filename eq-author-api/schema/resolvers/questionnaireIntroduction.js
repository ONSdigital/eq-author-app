const { find, omit, first, remove } = require("lodash");
const uuid = require("uuid").v4;

const { NOTICE_1 } = require("../../constants/legalBases");

const { createMutation } = require("./createMutation");

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
};

Resolvers.Collapsible = {
  introduction: (root, args, ctx) => ctx.questionnaire.introduction,
};

module.exports = [Resolvers];
module.exports.createQuestionnaireIntroduction = metadata => {
  return {
    id: uuid.v4(),
    title: `<p>You are completing this for <span data-piped="metadata" data-id="${
      find(metadata, { key: "trad_as" }).id
    }">trad_as</span> (<span data-piped="metadata" data-id="${
      find(metadata, { key: "ru_name" }).id
    }">ru_name</span>)</p>`,
    description:
      "<ul><li>Data should relate to all sites in England, Scotland, Wales and Northern Ireland unless otherwise stated. </li><li>You can provide info estimates if actual figures aren’t available.</li><li>We will treat your data securely and confidentially.</li></ul>",
    legalBasis: NOTICE_1,
    secondaryTitle: "<p>Information you need</p>",
    secondaryDescription:
      "<p>You can select the dates of the period you are reporting for, if the given dates are not appropriate.</p>",
    collapsibles: [],
    tertiaryTitle: "<p>How we use your data</p>",
    tertiaryDescription:
      "<ul><li>You cannot appeal your selection. Your business was selected to give us a comprehensive view of the UK economy.</li><li>The information you provide contributes to Gross Domestic Product (GDP).</li></ul>",
  };
};
