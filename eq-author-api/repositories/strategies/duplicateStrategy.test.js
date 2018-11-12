const { flow, map, omit } = require("lodash/fp");

const db = require("../../db");
const {
  duplicatePageStrategy,
  duplicateSectionStrategy,
  duplicateQuestionnaireStrategy
} = require("./duplicateStrategy");
const SectionRepository = require("../SectionRepository");
const PageRepository = require("../PageRepository");
const AnswerRepository = require("../AnswerRepository");
const OptionRepository = require("../OptionRepository");
const ValidationRepository = require("../ValidationRepository");
const MetadataRepository = require("../MetadataRepository");
const RoutingRepository = require("../RoutingRepository");

const buildTestQuestionnaire = require("../../tests/utils/buildTestQuestionnaire");

const sanitize = omit([
  "id",
  "createdAt",
  "updatedAt",
  "answerId",
  "otherAnswerId",
  "parentAnswerId",
  "questionPageId",
  "sectionId",
  "position",
  "questionnaireId",
  "routingDestinationId",
  "routingRuleSetId",
  "conditionId"
]);
const removeChildren = omit([
  "answers",
  "validation",
  "options",
  "sections",
  "otherAnswer",
  "pages",
  "metadata",
  "ruleSet",
  "routingValue",
  "conditions",
  "goto"
]);

const sanitizeAllProperties = obj =>
  Object.keys(obj).reduce(
    (struct, key) => ({
      ...struct,
      [key]: sanitize(obj[key])
    }),
    {}
  );

const sanitizeParent = flow(
  removeChildren,
  sanitize
);

describe("Duplicate strategy tests", () => {
  beforeAll(() => db.migrate.latest());
  afterAll(() => db.destroy());
  afterEach(async () => {
    await db.transaction(async trx => {
      await trx.table("Questionnaires").delete();
    });
  });

  describe("Page", () => {
    it("will duplicate a page", async () => {
      const questionnaire = await buildTestQuestionnaire({
        sections: [
          {
            pages: [
              {
                title: "My page"
              }
            ]
          }
        ]
      });

      const page = questionnaire.sections[0].pages[0];

      const duplicatePage = await db.transaction(trx =>
        duplicatePageStrategy(trx, removeChildren(page))
      );
      expect(sanitize(duplicatePage)).toMatchObject({
        ...sanitize(removeChildren(page)),
        order: page.order + 1000
      });
    });

    it("will not duplicate deleted answers", async () => {
      const questionnaire = await buildTestQuestionnaire({
        sections: [
          {
            pages: [
              {
                title: "MyPage",
                answers: [
                  {
                    label: "Is deleted",
                    isDeleted: true
                  },
                  {
                    label: "Is not deleted",
                    isDeleted: false
                  }
                ]
              }
            ]
          }
        ]
      });

      const page = questionnaire.sections[0].pages[0];

      const duplicatePage = await db.transaction(trx =>
        duplicatePageStrategy(trx, removeChildren(page))
      );

      const duplicateAnswers = await AnswerRepository.findAll({
        questionPageId: duplicatePage.id
      });

      expect(duplicateAnswers).toHaveLength(1);
      expect(duplicateAnswers.map(sanitize)).toMatchObject(
        page.answers
          .filter(a => !a.isDeleted)
          .map(a => sanitize(removeChildren(a)))
      );
    });

    it("will duplicate piping references in a page", async () => {
      const questionnaire = await buildTestQuestionnaire({
        metadata: [{ key: "foo", id: "m1" }],
        sections: [
          {
            pages: [
              {
                title:
                  'MyPage <span data-piped="metadata" data-id="m1" data-type="Text">{{foo}}</span>',
                answers: []
              }
            ]
          }
        ]
      });

      const page = questionnaire.sections[0].pages[0];

      const duplicatePage = await db.transaction(trx =>
        duplicatePageStrategy(trx, removeChildren(page))
      );

      expect(duplicatePage.title).toEqual(
        `MyPage <span data-piped="metadata" data-id="${
          questionnaire.metadata[0].id
        }" data-type="Text">{{foo}}</span>`
      );
    });

    it("will duplicate routing from the page - checkbox answers", async () => {
      const questionnaire = await buildTestQuestionnaire({
        sections: [
          {
            pages: [
              {
                id: "page1",
                answers: [
                  {
                    id: "answer1",
                    type: "Radio",
                    options: [
                      {
                        id: "yes",
                        label: "Yes"
                      },
                      {
                        id: "no",
                        label: "No"
                      }
                    ]
                  }
                ],
                routingRuleSet: {
                  else: {
                    logicalDestination: "EndOfQuestionnaire"
                  },
                  routingRules: [
                    {
                      goto: {
                        absoluteDestination: {
                          id: "section2",
                          __typename: "Section"
                        }
                      },
                      conditions: [
                        {
                          answer: { id: "answer1" },
                          routingValue: {
                            value: ["yes"]
                          }
                        }
                      ]
                    }
                  ]
                }
              }
            ]
          },
          {
            id: "section2",
            pages: [{}]
          }
        ]
      });

      const page = questionnaire.sections[0].pages[0];

      const duplicatePage = await db.transaction(trx =>
        duplicatePageStrategy(trx, removeChildren(page))
      );

      const duplicateRuleSet = await RoutingRepository.findRoutingRuleSetByQuestionPageId(
        { questionPageId: duplicatePage.id }
      );
      const duplicateRuleSetDestination = await RoutingRepository.getRoutingDestination(
        duplicateRuleSet.routingDestinationId
      );
      expect(duplicateRuleSetDestination.logicalDestination).toEqual(
        "EndOfQuestionnaire"
      );

      const duplicateRules = await RoutingRepository.findAllRoutingRules({
        routingRuleSetId: duplicateRuleSet.id
      });
      const duplicateRuleDestination = await RoutingRepository.getRoutingDestination(
        duplicateRules[0].routingDestinationId
      );
      expect(duplicateRuleDestination.absoluteDestination.id).toEqual(
        questionnaire.sections[1].id
      );
      expect(duplicateRules[0]).toMatchObject({
        ...sanitizeParent(page.ruleSet.rules[0])
      });

      const duplicateConditions = await RoutingRepository.findAllRoutingConditions(
        {
          routingRuleId: duplicateRules[0].id
        }
      );
      const duplicateAnswers = await AnswerRepository.findAll({
        questionPageId: duplicatePage.id
      });
      expect(duplicateConditions[0]).toMatchObject({
        ...sanitizeParent(page.ruleSet.rules[0].conditions[0]),
        routingRuleId: duplicateRules[0].id,
        answerId: duplicateAnswers[0].id
      });

      const duplicateValues = await RoutingRepository.findAllRoutingConditionValues(
        {
          conditionId: duplicateConditions[0].id
        }
      );
      const duplicateOptions = await OptionRepository.findAll({
        answerId: duplicateAnswers[0].id
      });

      expect(duplicateValues).toMatchObject([
        {
          ...sanitize(
            page.ruleSet.rules[0].conditions[0].routingValue.value[0]
          ),
          optionId: duplicateOptions[0].id
        }
      ]);
    });

    it("will duplicate routing based on a number", async () => {
      const questionnaire = await buildTestQuestionnaire({
        sections: [
          {
            pages: [
              {
                id: "page1",
                answers: [
                  {
                    id: "answer1",
                    type: "Number"
                  }
                ],
                routingRuleSet: {
                  else: {
                    logicalDestination: "EndOfQuestionnaire"
                  },
                  routingRules: [
                    {
                      goto: {
                        absoluteDestination: {
                          __typename: "Section",
                          id: "section2"
                        }
                      },
                      conditions: [
                        {
                          comparator: "Equal",
                          answer: { id: "answer1" },
                          routingValue: {
                            numberValue: 2
                          }
                        }
                      ]
                    }
                  ]
                }
              }
            ]
          },
          {
            id: "section2",
            pages: [{}]
          }
        ]
      });

      const page = questionnaire.sections[0].pages[0];

      const duplicatePage = await db.transaction(trx =>
        duplicatePageStrategy(trx, removeChildren(page))
      );

      const duplicateRuleSet = await RoutingRepository.findRoutingRuleSetByQuestionPageId(
        { questionPageId: duplicatePage.id }
      );
      const duplicateRules = await RoutingRepository.findAllRoutingRules({
        routingRuleSetId: duplicateRuleSet.id
      });
      const duplicateConditions = await RoutingRepository.findAllRoutingConditions(
        {
          routingRuleId: duplicateRules[0].id
        }
      );

      expect(duplicateConditions[0].comparator).toEqual("Equal");

      const duplicateConditionValues = await RoutingRepository.findAllRoutingConditionValues(
        {
          conditionId: duplicateConditions[0].id
        }
      );

      expect(duplicateConditionValues[0]).toMatchObject({
        customNumber: 2
      });
    });

    describe("Answer", () => {
      it("will duplicate an answer with an option", async () => {
        const questionnaire = await buildTestQuestionnaire({
          sections: [
            {
              pages: [
                {
                  answers: [
                    {
                      type: "Radio",
                      options: [{}]
                    }
                  ]
                }
              ]
            }
          ]
        });

        const page = questionnaire.sections[0].pages[0];
        const option = page.answers[0].options[0];

        const duplicatePage = await db.transaction(trx =>
          duplicatePageStrategy(trx, removeChildren(page))
        );

        const duplicateAnswers = await AnswerRepository.findAll({
          questionPageId: duplicatePage.id
        });
        const duplicateOptions = await OptionRepository.findAll({
          answerId: duplicateAnswers[0].id
        });

        expect(sanitize(duplicateOptions[0])).toMatchObject(sanitize(option));
      });

      it("will ensure the option order is maintained", async () => {
        const questionnaire = await buildTestQuestionnaire({
          sections: [
            {
              pages: [
                {
                  answers: [
                    {
                      type: "Radio",
                      options: [
                        { label: "1" },
                        { label: "2" },
                        { label: "3" },
                        { label: "4" }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        });

        const page = questionnaire.sections[0].pages[0];

        const duplicatePage = await db.transaction(trx =>
          duplicatePageStrategy(trx, removeChildren(page))
        );

        const duplicateAnswers = await AnswerRepository.findAll({
          questionPageId: duplicatePage.id
        });
        const duplicateOptions = await OptionRepository.findAll({
          answerId: duplicateAnswers[0].id
        });

        const optionLabels = map(o => o.label);

        expect(optionLabels(duplicateOptions)).toMatchObject([
          "1",
          "2",
          "3",
          "4"
        ]);
      });

      it("will duplicate an answer with an other option", async () => {
        const questionnaire = await buildTestQuestionnaire({
          sections: [
            {
              pages: [
                {
                  answers: [
                    {
                      type: "Radio",
                      options: [{ label: "1" }, { label: "2" }],
                      other: {
                        answer: {
                          label: "Other answer label"
                        },
                        option: {
                          label: "Other option label"
                        }
                      }
                    }
                  ]
                }
              ]
            }
          ]
        });

        const page = questionnaire.sections[0].pages[0];

        const answer = page.answers[0];
        const otherAnswer = answer.otherAnswer;
        const otherOption = otherAnswer.options[0];

        const duplicatePage = await db.transaction(trx =>
          duplicatePageStrategy(trx, removeChildren(page))
        );
        const dupAnswers = await AnswerRepository.findAll({
          questionPageId: duplicatePage.id
        });
        const duplicateAnswer = dupAnswers[0];
        const duplicateOtherAnswer = await AnswerRepository.getOtherAnswer(
          duplicateAnswer.id
        );
        const duplicateOtherOption = await OptionRepository.getOtherOption(
          duplicateOtherAnswer.id
        );

        expect(sanitize(duplicateAnswer)).toMatchObject(sanitizeParent(answer));
        expect(duplicateOtherAnswer.parentAnswerId).toEqual(duplicateAnswer.id);
        expect(sanitize(duplicateOtherAnswer)).toMatchObject({
          ...sanitizeParent(otherAnswer),
          label: "Other answer label"
        });
        expect(sanitize(duplicateOtherOption)).toMatchObject({
          ...sanitize(otherOption),
          label: "Other option label"
        });
      });

      it("will duplicate a mutually exclusive option", async () => {
        const questionnaire = await buildTestQuestionnaire({
          sections: [
            {
              pages: [
                {
                  answers: [
                    {
                      type: "Radio",
                      options: [{ label: "1" }, { label: "2" }],
                      mutuallyExclusiveOption: {
                        label: "3"
                      }
                    }
                  ]
                }
              ]
            }
          ]
        });

        const page = questionnaire.sections[0].pages[0];
        const duplicatePage = await db.transaction(trx =>
          duplicatePageStrategy(trx, removeChildren(page))
        );
        const dupAnswers = await AnswerRepository.findAll({
          questionPageId: duplicatePage.id
        });
        const duplicateAnswer = dupAnswers[0];
        const duplicateMutuallyExclusiveOption = await OptionRepository.findExclusiveOptionByAnswerId(
          duplicateAnswer.id
        );

        expect(sanitize(duplicateMutuallyExclusiveOption)).toMatchObject(
          sanitize(page.answers[0].mutuallyExclusiveOption)
        );
      });

      it("will duplicate the validations for a number answer", async () => {
        const questionnaire = await buildTestQuestionnaire({
          sections: [
            {
              pages: [
                {
                  answers: [
                    {
                      type: "Number",
                      validation: {
                        minValue: {
                          enabled: true,
                          custom: 5,
                          inclusive: true
                        }
                      }
                    }
                  ]
                }
              ]
            }
          ]
        });

        const page = questionnaire.sections[0].pages[0];

        const answer = page.answers[0];

        const duplicatePage = await db.transaction(trx =>
          duplicatePageStrategy(trx, removeChildren(page))
        );

        const dupAnswers = await AnswerRepository.findAll({
          questionPageId: duplicatePage.id
        });

        const duplicatedAnswer = dupAnswers[0];

        const duplicatedValidations = {
          minValue: await ValidationRepository.findByAnswerIdAndValidationType(
            duplicatedAnswer,
            "minValue"
          ),
          maxValue: await ValidationRepository.findByAnswerIdAndValidationType(
            duplicatedAnswer,
            "maxValue"
          )
        };

        expect(sanitizeAllProperties(duplicatedValidations)).toMatchObject(
          sanitizeAllProperties(answer.validation)
        );
      });

      it("will duplicate the validations for date answer", async () => {
        const questionnaire = await buildTestQuestionnaire({
          sections: [
            {
              pages: [
                {
                  answers: [
                    {
                      type: "Date",
                      validation: {
                        earliestDate: {
                          enabled: true,
                          offset: { unit: "Days", value: 0 },
                          relativePosition: "Before",
                          custom: "2018-10-10T00:00:00.000Z",
                          entityType: "Custom",
                          previousAnswerId: null,
                          metadataId: null
                        }
                      }
                    }
                  ]
                }
              ]
            }
          ]
        });

        const page = questionnaire.sections[0].pages[0];

        const answer = page.answers[0];

        const duplicatePage = await db.transaction(trx =>
          duplicatePageStrategy(trx, removeChildren(page))
        );

        const dupAnswers = await AnswerRepository.findAll({
          questionPageId: duplicatePage.id
        });

        const duplicatedAnswer = dupAnswers[0];

        const duplicatedValidations = {
          earliestDate: await ValidationRepository.findByAnswerIdAndValidationType(
            duplicatedAnswer,
            "earliestDate"
          ),
          latestDate: await ValidationRepository.findByAnswerIdAndValidationType(
            duplicatedAnswer,
            "latestDate"
          )
        };

        expect(sanitizeAllProperties(duplicatedValidations)).toMatchObject(
          sanitizeAllProperties(answer.validation)
        );
        expect(duplicatedValidations.earliestDate).toMatchObject({
          entityType: "Custom",
          custom: "2018-10-10T00:00:00.000Z"
        });
      });

      it("will duplicate the validations associated with metadata", async () => {
        const questionnaire = await buildTestQuestionnaire({
          metadata: [{ id: "metadata1" }],
          sections: [
            {
              pages: [
                {
                  answers: [
                    {
                      type: "Date",
                      validation: {
                        earliestDate: {
                          enabled: true,
                          offset: { unit: "Days", value: 0 },
                          relativePosition: "Before",
                          custom: null,
                          entityType: "Metadata",
                          previousAnswer: null,
                          metadata: {
                            id: "metadata1"
                          }
                        }
                      }
                    }
                  ]
                }
              ]
            }
          ]
        });

        const page = questionnaire.sections[0].pages[0];

        const duplicatePage = await db.transaction(trx =>
          duplicatePageStrategy(trx, removeChildren(page))
        );

        const dupAnswers = await AnswerRepository.findAll({
          questionPageId: duplicatePage.id
        });

        const duplicatedAnswer = dupAnswers[0];

        const duplicatedValidations = {
          earliestDate: await ValidationRepository.findByAnswerIdAndValidationType(
            duplicatedAnswer,
            "earliestDate"
          )
        };

        expect(duplicatedValidations.earliestDate).toMatchObject({
          entityType: "Metadata",
          metadataId: questionnaire.metadata[0].id
        });
      });

      it("will duplicate the validations associated with previous answer", async () => {
        const questionnaire = await buildTestQuestionnaire({
          sections: [
            {
              pages: [
                {
                  answers: [
                    {
                      id: "answer1",
                      type: "Date"
                    },
                    {
                      type: "Date",
                      validation: {
                        earliestDate: {
                          enabled: true,
                          offset: { unit: "Days", value: 0 },
                          relativePosition: "Before",
                          custom: null,
                          entityType: "PreviousAnswer",
                          previousAnswer: { id: "answer1" },
                          metadataId: null
                        }
                      }
                    }
                  ]
                }
              ]
            }
          ]
        });

        const page = questionnaire.sections[0].pages[0];

        const duplicatePage = await db.transaction(trx =>
          duplicatePageStrategy(trx, removeChildren(page))
        );

        // Returns answers on page in reverse order if created at the same time
        const dupAnswers = await AnswerRepository.findAll(
          {
            questionPageId: duplicatePage.id
          },
          "id",
          "asc"
        );

        const duplicatedAnswer = dupAnswers[1];

        const duplicatedValidations = {
          earliestDate: await ValidationRepository.findByAnswerIdAndValidationType(
            duplicatedAnswer,
            "earliestDate"
          )
        };
        expect(duplicatedValidations.earliestDate).toMatchObject({
          entityType: "PreviousAnswer",
          previousAnswerId: dupAnswers[0].id
        });
      });
    });
  });

  describe("Section", () => {
    it("will duplicate a section to the position specified", async () => {
      const questionnaire = await buildTestQuestionnaire({
        sections: [
          {
            title: "My section",
            pages: [{}]
          }
        ]
      });

      const section = questionnaire.sections[0];

      const duplicateSection = await db.transaction(trx => {
        return duplicateSectionStrategy(trx, removeChildren(section), 1);
      });

      expect(sanitize(duplicateSection)).toMatchObject(sanitizeParent(section));

      const position = await SectionRepository.getPosition(duplicateSection);
      expect(position).toEqual(1);
    });

    it("will duplicate pages for a section but not deleted ones", async () => {
      const questionnaire = await buildTestQuestionnaire({
        sections: [
          {
            title: "My section",
            pages: [
              {
                title: "Question 1",
                isDeleted: false
              },
              {
                title: "Question 2",
                isDeleted: true
              },
              {
                title: "Question 3",
                isDeleted: false
              }
            ]
          }
        ]
      });

      const section = questionnaire.sections[0];

      const duplicateSection = await db.transaction(trx =>
        duplicateSectionStrategy(trx, removeChildren(section), 1)
      );

      const duplicatePages = await PageRepository.findAll({
        sectionId: duplicateSection.id
      });

      expect(duplicatePages).toHaveLength(2);
      expect(duplicatePages.map(sanitize)).toEqual(
        section.pages
          .filter(p => !p.isDeleted)
          .map(p => sanitize(removeChildren(p)))
      );
    });

    it("will update piping to references within the section", async () => {
      const questionnaire = await buildTestQuestionnaire({
        sections: [
          {
            title: "My section",
            pages: [
              {
                title: "Question 1",
                answers: [{ id: "a1", label: "Answer 1" }]
              },
              {
                title:
                  'Title <span data-piped="answers" data-id="a1" data-type="TextField">{{Answer 1}}</span>',
                description:
                  'Description <span data-piped="answers" data-id="a1" data-type="TextField">{{Answer 1}}</span>',
                guidance:
                  'Guidance <span data-piped="answers" data-id="a1" data-type="TextField">{{Answer 1}}</span>'
              }
            ]
          }
        ]
      });

      const section = questionnaire.sections[0];

      const duplicateSection = await db.transaction(trx =>
        duplicateSectionStrategy(trx, removeChildren(section), 1)
      );

      const duplicatePages = await PageRepository.findAll({
        sectionId: duplicateSection.id
      });

      const duplicateFirstPageAnswers = await AnswerRepository.findAll({
        questionPageId: duplicatePages[0].id
      });
      const newPipedAnswerId = duplicateFirstPageAnswers[0].id;

      const secondPage = duplicatePages[1];

      expect(secondPage.title).toEqual(
        `Title <span data-piped="answers" data-id="${newPipedAnswerId}" data-type="TextField">{{Answer 1}}</span>`
      );
      expect(secondPage.description).toEqual(
        `Description <span data-piped="answers" data-id="${newPipedAnswerId}" data-type="TextField">{{Answer 1}}</span>`
      );
      expect(secondPage.guidance).toEqual(
        `Guidance <span data-piped="answers" data-id="${newPipedAnswerId}" data-type="TextField">{{Answer 1}}</span>`
      );
    });

    it("will not update piping with references outside of the secontion", async () => {
      const questionnaire = await buildTestQuestionnaire({
        metadata: [
          {
            id: "m1",
            key: "foo",
            type: "Text",
            textValue: "Hello world"
          }
        ],
        sections: [
          {
            title: "My section 1",
            pages: [
              {
                title: "Question 1",
                answers: [{ id: "s1q1a1", label: "S1Q1A1" }]
              }
            ]
          },
          {
            title: "My section 2",
            pages: [
              {
                title:
                  'Question <span data-piped="answers" data-id="s1q1a1" data-type="TextField">{{S1Q1A1}}</span>',
                description:
                  'Description <span data-piped="metadata" data-id="m1" data-type="Text">{{foo}}</span>'
              }
            ]
          }
        ]
      });

      const section = questionnaire.sections[1];

      const duplicateSection = await db.transaction(trx =>
        duplicateSectionStrategy(trx, removeChildren(section), 1)
      );

      const duplicatePages = await PageRepository.findAll({
        sectionId: duplicateSection.id
      });
      const referencedAnswerId =
        questionnaire.sections[0].pages[0].answers[0].id;

      expect(duplicatePages[0].title).toEqual(
        `Question <span data-piped="answers" data-id="${referencedAnswerId}" data-type="TextField">{{S1Q1A1}}</span>`
      );
      expect(duplicatePages[0].description).toEqual(
        `Description <span data-piped="metadata" data-id="${
          questionnaire.metadata[0].id
        }" data-type="Text">{{foo}}</span>`
      );
    });

    it("will duplicate routing and keep references inside a section and update those outside", async () => {
      const questionnaire = await buildTestQuestionnaire({
        sections: [
          {
            pages: [
              {
                id: "page1",
                answers: [
                  {
                    id: "answer1",
                    type: "Radio",
                    options: [
                      {
                        id: "yes",
                        label: "Yes"
                      },
                      {
                        id: "no",
                        label: "No"
                      }
                    ]
                  }
                ],
                routingRuleSet: {
                  else: {
                    absoluteDestination: {
                      id: "page2",
                      __typename: "QuestionPage"
                    }
                  },
                  routingRules: [
                    {
                      goto: {
                        absoluteDestination: {
                          id: "section2",
                          __typename: "Section"
                        }
                      },
                      conditions: [
                        {
                          answer: { id: "answer1" },
                          routingValue: {
                            value: ["yes"]
                          }
                        }
                      ]
                    }
                  ]
                }
              },
              {
                id: "page2"
              }
            ]
          },
          {
            id: "section2",
            pages: [{}]
          }
        ]
      });

      const section = questionnaire.sections[0];

      const duplicateSection = await db.transaction(trx =>
        duplicateSectionStrategy(trx, removeChildren(section), 1)
      );

      const duplicatePages = await PageRepository.findAll({
        sectionId: duplicateSection.id
      });

      const duplicatedPage = duplicatePages[0];
      const duplicatedPageRuleSet = await RoutingRepository.findRoutingRuleSetByQuestionPageId(
        { questionPageId: duplicatedPage.id }
      );
      const duplicateRuleSetDestination = await RoutingRepository.getRoutingDestination(
        duplicatedPageRuleSet.routingDestinationId
      );
      // Internal reference updated
      expect(duplicateRuleSetDestination).toMatchObject({
        absoluteDestination: {
          id: duplicatePages[1].id
        }
      });

      const duplicateRules = await RoutingRepository.findAllRoutingRules({
        routingRuleSetId: duplicatedPageRuleSet.id
      });
      const duplicateRuleDestination = await RoutingRepository.getRoutingDestination(
        duplicateRules[0].routingDestinationId
      );
      // External reference still pointing to section
      expect(duplicateRuleDestination.absoluteDestination.id).toEqual(
        questionnaire.sections[1].id
      );
    });
  });

  describe("Questionnaire", () => {
    it("will duplicate a questionnaire", async () => {
      const questionnaire = await buildTestQuestionnaire({
        sections: [
          {
            pages: [{}]
          }
        ]
      });

      const duplicateQuestionnaire = await db.transaction(trx => {
        return duplicateQuestionnaireStrategy(
          trx,
          removeChildren(questionnaire)
        );
      });

      expect(sanitize(duplicateQuestionnaire)).toMatchObject(
        sanitizeParent(questionnaire)
      );
    });

    it("will duplicate child entities", async () => {
      const questionnaire = await buildTestQuestionnaire({
        sections: [
          {
            pages: [{}]
          }
        ]
      });

      const duplicateQuestionnaire = await db.transaction(trx =>
        duplicateQuestionnaireStrategy(trx, removeChildren(questionnaire))
      );

      const duplicateSections = await SectionRepository.findAll({
        questionnaireId: duplicateQuestionnaire.id
      });
      const duplicatePages = await PageRepository.findAll({
        sectionId: duplicateSections[0].id
      });

      expect(sanitize(duplicateSections[0])).toMatchObject(
        sanitizeParent(questionnaire.sections[0])
      );
      expect(sanitize(duplicatePages[0])).toMatchObject(
        sanitizeParent(questionnaire.sections[0].pages[0])
      );
    });

    it("will duplicate metadata", async () => {
      const questionnaire = await buildTestQuestionnaire({
        metadata: [{ key: "foo", type: "Text", textValue: "Hello world" }],
        sections: [
          {
            pages: [{}]
          }
        ]
      });

      const duplicateQuestionnaire = await db.transaction(trx =>
        duplicateQuestionnaireStrategy(trx, removeChildren(questionnaire))
      );

      const duplicateMetadata = await MetadataRepository.findAll({
        questionnaireId: duplicateQuestionnaire.id
      });

      expect(duplicateMetadata.map(sanitize)).toMatchObject(
        questionnaire.metadata.map(sanitize)
      );
    });

    it("will update all piping references", async () => {
      const questionnaire = await buildTestQuestionnaire({
        metadata: [
          {
            id: "m1",
            key: "foo",
            type: "Text",
            textValue: "Hello world"
          }
        ],
        sections: [
          {
            title: "Section 1",
            pages: [
              {
                title:
                  'Page title <span data-piped="metadata" data-id="m1" data-type="TextField">{{foo}}</span>',
                answers: [
                  {
                    id: "a1",
                    label: "Answer 1"
                  }
                ]
              }
            ]
          },
          {
            title: "Section 2",
            pages: [
              {
                guidance:
                  'Section 2 title <span data-piped="answers" data-id="a1" data-type="TextField">{{Answer 1}}</span>'
              }
            ]
          }
        ]
      });

      const duplicateQuestionnaire = await db.transaction(trx =>
        duplicateQuestionnaireStrategy(trx, removeChildren(questionnaire))
      );

      const duplicateMetadata = await MetadataRepository.findAll({
        questionnaireId: duplicateQuestionnaire.id
      });
      const duplicateSections = await SectionRepository.findAll({
        questionnaireId: duplicateQuestionnaire.id
      });

      const dupSection1 = duplicateSections[0];
      const dupSection1Pages = await PageRepository.findAll({
        sectionId: dupSection1.id
      });
      const dupSection1Page1 = dupSection1Pages[0];

      expect(dupSection1Page1.title).toEqual(
        `Page title <span data-piped="metadata" data-id="${
          duplicateMetadata[0].id
        }" data-type="TextField">{{foo}}</span>`
      );

      const dupSection1Page1Answers = await AnswerRepository.findAll({
        questionPageId: dupSection1Page1.id
      });
      const dupSection1Page1Answer1 = dupSection1Page1Answers[0];

      const dupSection2 = duplicateSections[1];
      const dupSection2Pages = await PageRepository.findAll({
        sectionId: dupSection2.id
      });
      const dupSection2Page1 = dupSection2Pages[0];

      expect(dupSection2Page1.guidance).toEqual(
        `Section 2 title <span data-piped="answers" data-id="${
          dupSection1Page1Answer1.id
        }" data-type="TextField">{{Answer 1}}</span>`
      );
    });

    it("will update all routing references", async () => {
      const questionnaire = await buildTestQuestionnaire({
        sections: [
          {
            pages: [
              {
                id: "page1",
                answers: [
                  {
                    id: "answer1",
                    type: "Radio",
                    options: [
                      {
                        id: "yes",
                        label: "Yes"
                      },
                      {
                        id: "no",
                        label: "No"
                      }
                    ]
                  }
                ],
                routingRuleSet: {
                  else: {
                    absoluteDestination: {
                      id: "page2",
                      __typename: "QuestionPage"
                    }
                  },
                  routingRules: [
                    {
                      goto: {
                        absoluteDestination: {
                          id: "section2",
                          __typename: "Section"
                        }
                      },
                      conditions: [
                        {
                          answer: { id: "answer1" },
                          routingValue: {
                            value: ["yes"]
                          }
                        }
                      ]
                    }
                  ]
                }
              },
              {
                id: "page2"
              }
            ]
          },
          {
            id: "section2",
            pages: [{}]
          }
        ]
      });

      const duplicateQuestionnaire = await db.transaction(trx =>
        duplicateQuestionnaireStrategy(trx, removeChildren(questionnaire))
      );

      const duplicateSections = await SectionRepository.findAll({
        questionnaireId: duplicateQuestionnaire.id
      });

      const duplicatePages = await PageRepository.findAll({
        sectionId: duplicateSections[0].id
      });

      const duplicatedPage = duplicatePages[0];
      const duplicatedPageRuleSet = await RoutingRepository.findRoutingRuleSetByQuestionPageId(
        { questionPageId: duplicatedPage.id }
      );
      const duplicateRuleSetDestination = await RoutingRepository.getRoutingDestination(
        duplicatedPageRuleSet.routingDestinationId
      );
      // Internal reference updated
      expect(duplicateRuleSetDestination).toMatchObject({
        absoluteDestination: {
          id: duplicatePages[1].id
        }
      });

      const duplicateRules = await RoutingRepository.findAllRoutingRules({
        routingRuleSetId: duplicatedPageRuleSet.id
      });
      const duplicateRuleDestination = await RoutingRepository.getRoutingDestination(
        duplicateRules[0].routingDestinationId
      );
      // Internal reference updated
      expect(duplicateRuleDestination.absoluteDestination.id).toEqual(
        duplicateSections[1].id
      );
    });
  });
});
