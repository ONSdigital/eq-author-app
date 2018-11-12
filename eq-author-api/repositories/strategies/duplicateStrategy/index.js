const { head, isString } = require("lodash");

const { selectData, duplicateRecord, duplicateTree } = require("./utils");
const updatePiping = require("./piping");
const duplicateDestinations = require("./destinations");

const getDefaultReferenceStructure = () => ({
  options: {},
  answers: {},
  pages: {},
  sections: {},
  metadata: {},
  questionnaires: {}
});

const ENTITY_TREE = [
  [
    {
      name: "sections",
      table: "Sections",
      links: [
        {
          column: "questionnaireId",
          entityName: "questionnaires",
          parent: true
        }
      ]
    },
    {
      name: "metadata",
      table: "Metadata",
      links: [
        {
          column: "questionnaireId",
          entityName: "questionnaires",
          parent: true
        }
      ]
    }
  ],
  {
    name: "pages",
    table: "Pages",
    links: [{ column: "sectionId", entityName: "sections", parent: true }]
  },
  {
    name: "answers",
    table: "Answers",
    links: [
      {
        column: "questionPageId",
        entityName: "pages",
        parent: true
      }
    ],
    where: '"parentAnswerId" is null'
  },
  [
    // Other answers
    {
      name: "answers",
      table: "Answers",
      links: [
        {
          column: "parentAnswerId",
          entityName: "answers",
          parent: true
        }
      ]
    },
    {
      name: "validations",
      table: "Validation_AnswerRules",
      links: [
        {
          column: "answerId",
          entityName: "answers",
          parent: true
        },
        {
          column: "previousAnswerId",
          entityName: "answers"
        },
        {
          column: "metadataId",
          entityName: "metadata"
        }
      ],
      transform: ({ custom, ...rest }) => ({
        ...rest,
        //Required as it's stored as JSONB
        custom: isString(custom) ? `"${custom}"` : custom
      }),
      noIsDeleted: true
    }
  ],
  {
    name: "options",
    table: "Options",
    links: [
      {
        column: "answerId",
        entityName: "answers",
        parent: true
      },
      {
        column: "otherAnswerId",
        entityName: "answers",
        parent: true
      }
    ]
  },
  {
    name: "routingRuleSets",
    table: "Routing_RuleSets",
    links: [
      {
        column: "questionPageId",
        entityName: "pages",
        parent: true
      }
    ]
  },
  {
    name: "routingRules",
    table: "Routing_Rules",
    links: [
      {
        column: "routingRuleSetId",
        entityName: "routingRuleSets",
        parent: true
      }
    ]
  },
  {
    name: "routingConditions",
    table: "Routing_Conditions",
    links: [
      {
        column: "routingRuleId",
        entityName: "routingRules",
        parent: true
      },
      {
        column: "questionPageId",
        entityName: "pages"
      },
      {
        column: "answerId",
        entityName: "answers"
      }
    ],
    noIsDeleted: true
  },
  {
    name: "routingConditionValues",
    table: "Routing_ConditionValues",
    links: [
      {
        column: "conditionId",
        entityName: "routingConditions",
        parent: true
      },
      {
        column: "optionId",
        entityName: "options"
      }
    ],
    noIsDeleted: true
  }
];

const duplicatePageStrategy = async (
  trx,
  page,
  position,
  overrides = {},
  references = getDefaultReferenceStructure()
) => {
  const duplicatePage = await duplicateRecord(
    trx,
    "Pages",
    page,
    {
      ...overrides
    },
    position
  );

  references.pages[page.id] = duplicatePage.id;

  await duplicateTree(trx, ENTITY_TREE, references);
  await duplicateDestinations(trx, references);

  return selectData(trx, "Pages", "*", { id: duplicatePage.id }).then(head);
};

const duplicateSectionStrategy = async (
  trx,
  section,
  position,
  overrides = {},
  references = getDefaultReferenceStructure()
) => {
  const duplicateSection = await duplicateRecord(
    trx,
    "Sections",
    section,
    overrides,
    position
  );

  references.sections[section.id] = duplicateSection.id;

  await duplicateTree(trx, ENTITY_TREE, references);
  await Promise.all([
    duplicateDestinations(trx, references),
    updatePiping(trx, references)
  ]);

  return duplicateSection;
};

const duplicateQuestionnaireStrategy = async (
  trx,
  questionnaire,
  overrides = {}
) => {
  const duplicateQuestionnaire = await duplicateRecord(
    trx,
    "Questionnaires",
    questionnaire,
    overrides
  );

  const references = getDefaultReferenceStructure();

  references.questionnaires[questionnaire.id] = duplicateQuestionnaire.id;

  await duplicateTree(trx, ENTITY_TREE, references);
  await Promise.all([
    duplicateDestinations(trx, references),
    updatePiping(trx, references)
  ]);

  return duplicateQuestionnaire;
};

Object.assign(module.exports, {
  duplicatePageStrategy,
  duplicateSectionStrategy,
  duplicateQuestionnaireStrategy
});
