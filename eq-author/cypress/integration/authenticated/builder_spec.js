import {
  addQuestionnaire,
  setQuestionnaireSettings,
  addAnswerType,
  assertHash,
  typeIntoDraftEditor,
  findByLabel,
  addSection,
  addQuestionPage,
  testId,
  navigateToFirstSection,
  questionPageRegex,
  sectionRegex,
} from "../../utils";
import { times, includes } from "lodash";
import { Routes } from "../../../src/utils/UrlUtils";
import {
  NUMBER,
  RADIO,
  PERCENTAGE,
  CURRENCY,
  CHECKBOX,
  DATE,
  DATE_RANGE,
  TEXTAREA,
  TEXTFIELD,
} from "../../../src/constants/answer-types";

const questionnaireTitle = "My Questionnaire Title";

describe("builder", () => {
  const checkIsOnDesignPage = () => cy.hash().should("match", /\/design$/);

  beforeEach(() => {
    cy.visit("/");
    cy.login();
    addQuestionnaire(questionnaireTitle);
  });

  afterEach(() => {
    cy.deleteQuestionnaire(questionnaireTitle);
  });

  it("Can edit page title, alias and description", () => {
    cy.get(testId("page-item")).click();

    cy.get(testId("alias")).type("question alias");

    typeIntoDraftEditor(
      testId("txt-question-title", "testid"),
      "goodbye world"
    );

    typeIntoDraftEditor(
      testId("txt-question-description", "testid"),
      "my new question description"
    );

    cy.get(testId("side-nav")).should("contain", "question alias");
  });

  it("Can create a new page", () => {
    let prevHash;

    checkIsOnDesignPage();

    cy.hash()
      .then(hash => {
        prevHash = hash;
        addQuestionPage();
      })
      .then(() => {
        assertHash({
          previousPath: Routes.PAGE,
          previousHash: prevHash,
          currentPath: Routes.PAGE,
          equality: {
            questionnaireId: true,
            sectionId: true,
            pageId: false,
          },
        });
      });

    cy.get(testId("page-item")).should("have.length", 2);
  });

  it("Can edit question guidance", () => {
    const guidance = "this is some guidance";
    typeIntoDraftEditor(testId("txt-question-guidance", "testid"), guidance);

    cy.get(testId("page-item"))
      .first()
      .click();

    cy.get(testId("page-item"))
      .last()
      .click();

    cy.get(testId("txt-question-guidance", "testid")).should(
      "contain",
      guidance
    );
  });

  it("Can edit question definition", () => {
    const definitionLabel = "this is some definition label";
    cy.get(testId("txt-question-definition-label")).type(definitionLabel);
    cy.get(testId("txt-question-definition-label")).should(
      "contain",
      definitionLabel
    );

    const definitionContent = "this is some definition content";
    typeIntoDraftEditor(
      testId("txt-question-definition-content", "testid"),
      definitionContent
    );
    cy.get(testId("txt-question-definition-content", "testid")).should(
      "contain",
      definitionContent
    );
  });

  it("Can edit question additional information", () => {
    const additionalInfoLabel = "this is some additionalInfo label";
    cy.get(testId("txt-question-additional-info-label")).type(
      additionalInfoLabel
    );
    cy.get(testId("txt-question-additional-info-label")).should(
      "contain",
      additionalInfoLabel
    );

    const additionalInfoContent = "this is some additionalInfo content";
    typeIntoDraftEditor(
      testId("txt-question-additional-info-content", "testid"),
      additionalInfoContent
    );
    cy.get(testId("txt-question-additional-info-content", "testid")).should(
      "contain",
      additionalInfoContent
    );
  });

  it("Can delete a page", () => {
    checkIsOnDesignPage();

    addQuestionPage();

    cy.get(testId("page-item")).should("have.length", 2);

    cy.get(testId("btn-delete")).click();

    cy.get(testId("delete-confirm-modal")).within(() => {
      cy.get("button")
        .contains("Delete")
        .click();
    });

    cy.get(testId("page-item")).should("have.length", 1);
  });

  const changeQuestionnaireTitle = newTitle => {
    cy.get(testId("settings-btn")).click();
    setQuestionnaireSettings(newTitle);
    cy.get(testId("questionnaire-title")).should("contain", newTitle);
  };

  it("Can change the questionnaire title", () => {
    changeQuestionnaireTitle("Test Questionnaire");
    changeQuestionnaireTitle(questionnaireTitle);
  });

  describe("Section", () => {
    it("Can create a new section", () => {
      checkIsOnDesignPage();

      let prevHash;

      cy.hash()
        .then(hash => {
          prevHash = hash;
          addSection();
        })
        .then(() => {
          assertHash({
            previousPath: Routes.PAGE,
            previousHash: prevHash,
            currentPath: Routes.SECTION,
            equality: {
              questionnaireId: true,
              sectionId: false,
            },
          });
        });
    });

    it("Can navigate to a section", () => {
      checkIsOnDesignPage();

      const initialHash = cy
        .hash()
        .should("match", questionPageRegex)
        .then(hash => hash);

      addSection();

      cy.hash().should("not.eq", initialHash);
      const resultingHash = cy
        .hash()
        .should("match", sectionRegex)
        .then(hash => hash);

      navigateToFirstSection();

      cy.hash()
        .should("match", sectionRegex)
        .and("not.eq", resultingHash);
    });

    it("Can edit section alias, title and introduction details", () => {
      checkIsOnDesignPage();

      navigateToFirstSection();

      cy.get(testId("alias")).type("section alias");

      typeIntoDraftEditor(
        testId("txt-section-title", "testid"),
        "my new section"
      );

      typeIntoDraftEditor(
        testId("txt-introduction-title", "testid"),
        "Section Introduction Title"
      );
      typeIntoDraftEditor(
        testId("txt-introduction-content", "testid"),
        "Section Introduction Content"
      );

      cy.get(testId("nav-section-link")).should("contain", "section alias");
    });

    it("Can preview a section once it has introduction content", () => {
      checkIsOnDesignPage();

      navigateToFirstSection();

      cy.get(testId("preview")).click();
      cy.hash().should("match", /\/design$/);

      typeIntoDraftEditor(
        testId("txt-introduction-title", "testid"),
        "Section Introduction Title"
      );
      typeIntoDraftEditor(
        testId("txt-introduction-content", "testid"),
        "Section Introduction Content"
      );

      cy.get(testId("preview")).click();
      cy.hash().should("match", /\/preview$/);
    });

    it("Can delete a section", () => {
      checkIsOnDesignPage();

      addSection();

      navigateToFirstSection();

      let prevHash;

      cy.hash().then(hash => {
        prevHash = hash;
      });

      cy.get(testId("btn-delete")).click();
      cy.get(testId("delete-confirm-modal")).within(() => {
        cy.get("button")
          .contains("Delete")
          .click();
      });

      cy.then(() => {
        assertHash({
          previousPath: Routes.SECTION,
          previousHash: prevHash,
          currentPath: Routes.PAGE,
          equality: {
            questionnaireId: true,
            sectionId: false,
            pageId: false,
          },
        });
      });
    });
  });

  it("Can create checkboxes", () => {
    addAnswerType(CHECKBOX);
    cy.get(testId("btn-add-option")).click();
    cy.get(testId("option-label")).should("have.length", 2);
    cy.get(testId("option-label"))
      .first()
      .type("Checkbox label");
    cy.get(testId("option-description"))
      .first()
      .type("Checkbox description");
  });

  it("Can delete checkboxes", () => {
    addAnswerType(CHECKBOX);
    cy.get(testId("btn-add-option")).click();
    cy.get(testId("btn-delete-option"))
      .last()
      .click();
    cy.get(testId("option-label")).should("have.length", 1);
    cy.get(testId("btn-delete-answer")).click();
    cy.get(testId("btn-delete-answer")).should("not.exist");
  });

  it("Can create radio buttons", () => {
    addAnswerType(RADIO);
    cy.get(testId("btn-add-option")).click();
    cy.get(testId("option-label")).should("have.length", 3);
    cy.get(testId("option-label"))
      .first()
      .type("Radio label");
    cy.get(testId("option-description"))
      .first()
      .type("Radio description");
  });

  it("Can delete radio buttons", () => {
    addAnswerType(RADIO);
    cy.get(testId("btn-add-option")).click();
    cy.get(testId("btn-delete-option"))
      .last()
      .click();
    cy.get(testId("option-label")).should("have.length", 2);
    cy.get(testId("btn-delete-answer")).click();
    cy.get(testId("btn-delete-answer")).should("not.exist");
  });

  it("Can create and delete the different types of textbox", () => {
    [PERCENTAGE, TEXTAREA, TEXTFIELD, CURRENCY, NUMBER].forEach(answerType => {
      addAnswerType(answerType);
      cy.get(testId("txt-answer-label")).type(answerType + " label");
      if (includes([CURRENCY, NUMBER, PERCENTAGE], answerType)) {
        cy.get(testId("txt-answer-description")).type(
          answerType + " description"
        );
      }
      cy.get(testId("btn-delete-answer")).click();
      cy.get(testId("btn-delete-answer")).should("not.exist");
    });
  });

  it("Can create and delete dates", () => {
    addAnswerType(DATE);
    cy.get(testId("date-answer-label")).type("Date label");
    cy.get(testId("btn-delete-answer")).click();
    cy.get(testId("btn-delete-answer")).should("not.exist");
  });

  it("Can create and delete date ranges", () => {
    addAnswerType(DATE_RANGE);

    cy.get(testId("date-range-editor")).within(() => {
      cy.get(testId("date-answer-label"))
        .first()
        .click()
        .type("Date Range label");

      cy.get(testId("date-answer-label"))
        .last()
        .click()
        .type("Date Range label 2");
    });

    cy.get(testId("btn-delete-answer")).click();
    cy.get(testId("btn-delete-answer")).should("not.exist");
  });

  it("Should create a new page when deleting only page in section", () => {
    let prevHash;

    checkIsOnDesignPage();

    cy.hash().then(hash => {
      prevHash = hash;
    });

    cy.get(testId("btn-delete")).click();
    cy.get(testId("delete-confirm-modal")).within(() => {
      cy.get("button")
        .contains("Delete")
        .click();
    });

    cy.then(() => {
      assertHash({
        previousPath: Routes.PAGE,
        previousHash: prevHash,
        currentPath: Routes.PAGE,
        equality: {
          questionnaireId: true,
          sectionId: true,
          pageId: false,
        },
      });
    });
  });

  it("Should create a new section when deleting only section", () => {
    let prevHash;

    checkIsOnDesignPage();

    navigateToFirstSection();

    cy.hash().then(hash => {
      prevHash = hash;
    });

    cy.get(testId("btn-delete")).click();
    cy.get(testId("delete-confirm-modal")).within(() => {
      cy.get("button")
        .contains("Delete")
        .click();
    });

    cy.then(() => {
      assertHash({
        previousPath: Routes.SECTION,
        previousHash: prevHash,
        currentPath: Routes.SECTION,
        equality: {
          questionnaireId: true,
          sectionId: false,
        },
      });
    });
  });

  it("Can move pages within a section", () => {
    cy.get(testId("page-item"))
      .first()
      .click();
    typeIntoDraftEditor(testId("txt-question-title", "testid"), `Page 0`);

    times(2, i => {
      addQuestionPage(`Page ${i + 1}`);
    });

    cy.get(testId("btn-move")).click();

    findByLabel("Position").click();
    cy.get(testId("item-select-modal-form")).within(() => {
      findByLabel("Page 0").click();
    });

    cy.get(testId("item-select-modal-form")).submit();

    cy.get(testId("page-item"))
      .first()
      .should("contain", "Page 2");
  });

  it("Can move pages between sections", () => {
    checkIsOnDesignPage();
    addSection();

    cy.get(testId("page-item"))
      .last()
      .click();

    typeIntoDraftEditor(testId("txt-question-title", "testid"), "Page 2");

    cy.get(testId("btn-move")).click();

    findByLabel("Section").click();

    cy.get(testId("item-select-modal-form")).within(() => {
      cy.get("label")
        .last()
        .click();
    });
    cy.get(testId("item-select-modal-form")).submit();

    findByLabel("Position").click();

    cy.get(testId("item-select-modal-form")).within(() => {
      cy.get("label")
        .first()
        .click();
    });

    cy.get(testId("item-select-modal-form")).submit();

    cy.get(testId("section-item"))
      .last()
      .find(testId("page-item"))
      .first()
      .should("contain", "Page 2");
  });

  it("Can move sections", () => {
    cy.get(testId("nav-section-link"))
      .should("have.length", 1)
      .each($el => {
        cy.wrap($el).click();
        cy.get(testId("btn-move")).should("disabled");
      });

    addSection();
    addSection(2);

    cy.get(testId("nav-section-link"))
      .should("have.length", 3)
      .each($el => {
        cy.wrap($el).click();
        cy.get(testId("btn-move")).should("not.be.disabled");
      });

    typeIntoDraftEditor(testId("txt-section-title", "testid"), `Section 1`);

    cy.get(testId("btn-move")).click();

    findByLabel("Position").click();

    cy.get(testId("item-select-modal-form")).within(() => {
      cy.get("label")
        .last()
        .click();
    });

    cy.get(testId("item-select-modal-form")).submit();

    cy.get(testId("section-item"))
      .last()
      .should("contain", "Section 1");
  });

  describe("Checkbox with Exclusive option", () => {
    it("Can add a mutually exclusive checkbox", () => {
      addAnswerType(CHECKBOX);
      cy.get(testId("btn-add-option-menu")).click();
      cy.get(testId("btn-add-mutually-exclusive-option")).click();
      cy.get(testId("option-label")).should("have.length", 2);
    });

    it("Can edit a mutually exclusive checkbox", () => {
      addAnswerType(CHECKBOX);
      cy.get(testId("btn-add-option-menu")).click();
      cy.get(testId("btn-add-mutually-exclusive-option")).click();

      cy.get(testId("option-label"))
        .last()
        .type("Checkbox label");
      cy.get(testId("option-description"))
        .last()
        .type("Checkbox description");
    });

    it("Can't add a second mutually exclusive checkbox", () => {
      addAnswerType(CHECKBOX);
      cy.get(testId("btn-add-option-menu")).click();
      cy.get(testId("btn-add-mutually-exclusive-option")).click();
      cy.get(testId("btn-add-option-menu")).click();

      cy.get(testId("btn-add-mutually-exclusive-option")).should("be.disabled");
    });

    it("Always positions Exclusive checkboxes at the end", () => {
      addAnswerType(CHECKBOX);
      cy.get(testId("btn-add-option-menu")).click();
      cy.get(testId("btn-add-mutually-exclusive-option")).click();

      cy.get(testId("multiple-choice-options"))
        .children()
        .should("have.length", 2)
        .last()
        .should("contain", "Or");

      cy.get(testId("btn-add-option-menu")).click();
      cy.get(testId("btn-add-option-other")).click();

      cy.get(testId("multiple-choice-options"))
        .children()
        .should("have.length", 3)
        .last()
        .should("contain", "Or");

      cy.get(testId("btn-add-option")).click();

      cy.get(testId("multiple-choice-options"))
        .children()
        .should("have.length", 4)
        .last()
        .should("contain", "Or");
    });

    it("Can be deleted and re-enable the add button", () => {
      addAnswerType(CHECKBOX);
      cy.get(testId("btn-add-option-menu")).click();
      cy.get(testId("btn-add-mutually-exclusive-option")).click();

      cy.get(testId("btn-add-option-menu")).click();
      cy.get(testId("btn-add-mutually-exclusive-option")).should("be.disabled");

      cy.get(testId("btn-delete-option"))
        .last()
        .click();

      cy.get(testId("option-label")).should("have.length", 1);

      cy.get(testId("btn-add-option-menu")).click();
      cy.get(testId("btn-add-mutually-exclusive-option")).should(
        "not.be.disabled"
      );
    });
  });

  describe("Checkbox/Radio with additionalValue option", () => {
    const addMultipleChoiceAnswer = (type = CHECKBOX, withOther = true) => {
      addAnswerType(type);
      if (withOther) {
        cy.get(testId("btn-add-option-menu")).click();
        cy.get(testId("btn-add-option-other")).click();
      }
    };

    it("should add an additionalValue option answer", () => {
      addMultipleChoiceAnswer();
      cy.get(testId("option-label")).should("have.length", 2);
      cy.get(testId("other-answer")).should("have.length", 1);
    });

    it("should update the additionalValue option and answer values", () => {
      addMultipleChoiceAnswer();
      cy.get(testId("option-label"))
        .last()
        .type("Other label");
      cy.get(testId("option-description"))
        .last()
        .type("Other description");
      cy.get(testId("txt-answer-label"))
        .last()
        .type("Text answer label");
      cy.get(testId("option-label"))
        .first()
        .click();
    });

    it("should allow a mixture of additionalOptions and regular option answers", () => {
      addMultipleChoiceAnswer(CHECKBOX, false);
      cy.get(testId("btn-add-option-menu")).click();
      cy.get(testId("btn-add-option-other")).click();

      cy.get(testId("option-label")).should("have.length", 2);
      cy.get(testId("other-answer")).should("have.length", 1);

      cy.get(testId("btn-add-option")).click();

      cy.get(testId("option-label")).should("have.length", 3);
      cy.get(testId("other-answer")).should("have.length", 1);
    });

    it("should remove an additionalOptions option.", () => {
      addMultipleChoiceAnswer();
      cy.get(testId("option-label")).should("have.length", 2);
      cy.get(testId("other-answer")).should("have.length", 1);

      cy.get(testId("btn-delete-option"))
        .last()
        .click();

      cy.get(testId("option-label")).should("have.length", 1);
      cy.get(testId("other-answer")).should("have.length", 0);
    });
  });

  describe("Moving answers", () => {
    it("can move an answer down", () => {
      addAnswerType(NUMBER);
      addAnswerType(CURRENCY);

      cy.get(testId("answer-type")).should("have.length", 2);

      cy.get(testId("answer-type"))
        .first()
        .should("have.text", "Number");

      cy.get(testId("btn-move-answer-up"))
        .first()
        .should("have.attr", "aria-disabled", "true");

      cy.get(testId("btn-move-answer-down"))
        .first()
        .click();

      // Navigate away and back to skip animation and ensure it
      // is changed on the server
      cy.contains("Untitled Section").click();
      cy.contains("Untitled Page").click();

      cy.get(testId("answer-type"))
        .first()
        .should("contain", "Currency");
    });

    it("can move an answer up", () => {
      addAnswerType(NUMBER);
      addAnswerType(CURRENCY);

      cy.get(testId("answer-type")).should("have.length", 2);

      cy.get(testId("answer-type"))
        .last()
        .should("have.text", "Currency");

      cy.get(testId("btn-move-answer-down"))
        .last()
        .should("have.attr", "aria-disabled", "true");

      cy.get(testId("btn-move-answer-up"))
        .last()
        .click();

      // Navigate away and back to skip animation and ensure it
      // is changed on the server
      cy.contains("Untitled Section").click();
      cy.contains("Untitled Page").click();

      cy.get(testId("answer-type"))
        .last()
        .should("contain", "Number");
    });
  });
});
