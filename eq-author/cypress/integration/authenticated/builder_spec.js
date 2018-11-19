import {
  addQuestionnaire,
  answerTypes,
  setQuestionnaireSettings,
  addAnswerType,
  assertHash,
  typeIntoDraftEditor,
  findByLabel,
  addSection,
  addQuestionPage,
  testId,
  navigateToFirstSection
} from "../../utils";
import { times, includes } from "lodash";
import { Routes } from "../../../src/utils/UrlUtils";

const questionnaireTitle = "My Questionnaire Title";

const questionPageRegex = /\/questionnaire\/\d+\/\d+\/\d+\/design$/;
const sectionRegex = /\/questionnaire\/\d+\/\d+\/design$/;

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

    cy.get(testId("question-alias")).type("question alias");

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
            pageId: false
          }
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
            sectionId: false
          }
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

  it("Can edit section alias and title", () => {
    checkIsOnDesignPage();

    navigateToFirstSection();

    cy.get(testId("section-alias")).type("section alias");

    typeIntoDraftEditor(
      testId("txt-section-title", "testid"),
      "my new section"
    );

    cy.get(testId("nav-section-link")).should("contain", "section alias");
  });

  it("can add and edit a section introduction", () => {
    checkIsOnDesignPage();

    navigateToFirstSection();

    cy.get(testId("btn-add-intro")).click();

    typeIntoDraftEditor(
      testId("txt-introduction-title", "testid"),
      "Section Introduction Title"
    );
    typeIntoDraftEditor(
      testId("txt-introduction-content", "testid"),
      "Section Introduction Content"
    );
  });

  it("can delete a section introduction", () => {
    checkIsOnDesignPage();

    navigateToFirstSection();

    cy.get(testId("btn-add-intro")).click();

    cy.get(testId("section-intro-canvas")).within(() => {
      cy.get(testId("btn-delete")).click();
    });
    cy.get(testId("btn-add-intro"));
  });

  it("can undelete a section introduction", () => {
    checkIsOnDesignPage();

    navigateToFirstSection();

    cy.get(testId("btn-add-intro")).click();

    typeIntoDraftEditor(
      testId("txt-introduction-title", "testid"),
      "Section Introduction Title"
    );
    typeIntoDraftEditor(
      testId("txt-introduction-content", "testid"),
      "Section Introduction Content"
    );

    cy.get(testId("section-intro-canvas")).within(() => {
      cy.get(testId("btn-delete")).click();
    });
    cy.get(testId("btn-add-intro"));
    cy.get(testId("btn-undo")).click();

    cy.get(testId("section-intro-canvas")).within(() => {
      cy.get(testId("txt-introduction-title", "testid")).should(
        "contain",
        "Section Introduction Title"
      );
      cy.get(testId("txt-introduction-content", "testid")).should(
        "contain",
        "Section Introduction Content"
      );
    });
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
          pageId: false
        }
      });
    });
  });

  it("Can create checkboxes", () => {
    addAnswerType("Checkbox");
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
    addAnswerType("Checkbox");
    cy.get(testId("btn-add-option")).click();
    cy.get(testId("btn-delete-option"))
      .last()
      .click();
    cy.get(testId("option-label")).should("have.length", 1);
    cy.get(testId("btn-delete-answer")).click();
    cy.get(testId("btn-delete-answer")).should("not.exist");
  });

  it("Can create radio buttons", () => {
    addAnswerType("Radio");
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
    addAnswerType("Radio");
    cy.get(testId("btn-add-option")).click();
    cy.get(testId("btn-delete-option"))
      .last()
      .click();
    cy.get(testId("option-label")).should("have.length", 2);
    cy.get(testId("btn-delete-answer")).click();
    cy.get(testId("btn-delete-answer")).should("not.exist");
  });

  it("Can create and delete the different types of textbox", () => {
    answerTypes.forEach(answerType => {
      addAnswerType(answerType);
      cy.get(testId("txt-answer-label")).type(answerType + " label");
      if (includes(["Currency", "Number"], answerType)) {
        cy.get(testId("txt-answer-description")).type(
          answerType + " description"
        );
      }
      cy.get(testId("btn-delete-answer")).click();
      cy.get(testId("btn-delete-answer")).should("not.exist");
    });
  });

  it("Can create and delete dates", () => {
    addAnswerType("Date");
    cy.get(testId("date-answer-label")).type("Date label");
    cy.get(testId("btn-delete-answer")).click();
    cy.get(testId("btn-delete-answer")).should("not.exist");
  });

  it("Can create and delete date ranges", () => {
    addAnswerType("Daterange");

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
          pageId: false
        }
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
          sectionId: false
        }
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
      addAnswerType("Checkbox");
      cy.get(testId("btn-add-option-menu")).click();
      cy.get(testId("btn-add-mutually-exclusive-option")).click();
      cy.get(testId("option-label")).should("have.length", 2);
    });

    it("Can edit a mutually exclusive checkbox", () => {
      addAnswerType("Checkbox");
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
      addAnswerType("Checkbox");
      cy.get(testId("btn-add-option-menu")).click();
      cy.get(testId("btn-add-mutually-exclusive-option")).click();
      cy.get(testId("btn-add-option-menu")).click();

      cy.get(testId("btn-add-mutually-exclusive-option")).should("be.disabled");
    });

    it("Always positions Exclusive checkboxes at the end", () => {
      addAnswerType("Checkbox");
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
      addAnswerType("Checkbox");
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

  describe('Checkbox/Radio with "other" option', () => {
    const addMultipleChoiceAnswer = (type = "Checkbox", withOther = true) => {
      addAnswerType(type);
      if (withOther) {
        cy.get(testId("btn-add-option-menu")).click();
        cy.get(testId("btn-add-option-other")).click();
      }
    };

    it('should add an "other" answer', () => {
      addMultipleChoiceAnswer();
      cy.get(testId("option-label")).should("have.length", 2);
      cy.get(testId("other-answer")).should("have.length", 1);
    });

    it("should update the other option and answer values", () => {
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

    it('should remove the "other" option.', () => {
      addMultipleChoiceAnswer();
      cy.get(testId("btn-delete-option"))
        .last()
        .click();
      cy.get(testId("option-label")).should("have.length", 1);
      cy.get(testId("other-answer")).should("have.length", 0);
    });
  });
});
