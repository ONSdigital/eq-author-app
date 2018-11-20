import {
  typeIntoDraftEditor,
  findByLabel,
  addSection,
  addQuestionPage,
  buildMultipleChoiceAnswer,
  testId,
  selectOptionByLabel,
  addAnswerType
} from "../../utils";

let title;

const setRoutingCondition = (questionTitle, label) => {
  findByLabel("IF").within(() => selectOptionByLabel(questionTitle));
  cy.get(testId("options-selector")).within(() => cy.contains(label).click());
};

const navigateToRoutingTab = () =>
  cy
    .log("Navigating to routing tab")
    .get(testId("tabs-nav"))
    .within(() => cy.contains("Routing").click())
    .url()
    .should("contain", "routing");

describe("Routing", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.login();
    // delete the previous questionnaire if it exists
    title && cy.deleteQuestionnaire(title);
  });

  after(() => {
    title && cy.deleteQuestionnaire(title);
  });

  it("should see no routing rules exist and add one and then delete it", () => {
    title = "Test no routing rules";

    cy.createQuestionnaire(title);

    typeIntoDraftEditor(testId("txt-question-title", "testid"), "Question 1");
    buildMultipleChoiceAnswer(["A", "B", "C"]);

    navigateToRoutingTab();

    addQuestionPage("Question 2");

    buildMultipleChoiceAnswer(["D", "E", "F"]);

    navigateToRoutingTab();

    cy.contains("Question 1").click();
    cy.get(testId("routing-rule-set-empty-msg"));
    cy.get(testId("btn-add-rule")).click();
    cy.get(testId("routing-rule"));
    cy.get(testId("btn-delete")).click();
    cy.get(testId("routing-rule-set-empty-msg"));
  });

  it("can change the destination to another page", () => {
    title = "Test routing destination";

    cy.createQuestionnaire(title);

    typeIntoDraftEditor(testId("txt-question-title", "testid"), "Question 1");
    buildMultipleChoiceAnswer(["A", "B", "C"]);

    addQuestionPage("Question 2");
    buildMultipleChoiceAnswer(["D", "E", "F"]);

    addQuestionPage("Question 3");
    buildMultipleChoiceAnswer(["G", "H", "I"]);

    addQuestionPage("Question 4");
    buildMultipleChoiceAnswer(["J", "K", "L"]);

    cy.contains("Question 1").click();

    navigateToRoutingTab();

    cy.get(testId("btn-add-rule")).click();

    findByLabel("THEN")
      .select("Question 2")
      .should("have.length", 1);

    findByLabel("THEN")
      .select("Question 3")
      .should("have.length", 1);
  });

  it("should be able to add a currency routing rule and edit the inputs", () => {
    cy.createQuestionnaire(title);
    typeIntoDraftEditor(testId("txt-question-title", "testid"), "Question 1");

    addAnswerType("Currency");

    navigateToRoutingTab();

    cy.get(testId("btn-add-rule")).click();

    cy.get(testId("comparator-selector")).select("LessThan");

    cy.get(testId("number-input")).type("123");
  });

  it("should be able to add a number routing rule and edit the inputs", () => {
    cy.createQuestionnaire(title);
    typeIntoDraftEditor(testId("txt-question-title", "testid"), "Question 1");

    addAnswerType("Number");

    navigateToRoutingTab();

    cy.get(testId("btn-add-rule")).click();

    cy.get(testId("comparator-selector")).select("GreaterThan");

    cy.get(testId("number-input")).type("321");
  });

  it("follows the link to add an answer and routing updates with the new answer", () => {
    title = "Test no answer";

    cy.createQuestionnaire(title);

    typeIntoDraftEditor(testId("txt-question-title", "testid"), "Question 1");
    addQuestionPage("Question 2");

    cy.contains("Question 1").click();

    navigateToRoutingTab();

    cy.get(testId("btn-add-rule")).click();

    cy.get(testId("no-answer-msg")).within(() => {
      cy.get("a").click();
    });

    const options = ["A", "B", "C"];

    buildMultipleChoiceAnswer(options);

    navigateToRoutingTab();

    cy.get(testId("routing-rule")).within(() => {
      findByLabel("IF").select("Question 1");
    });

    cy.get(testId("options-selector")).within(() => {
      options.forEach(label => {
        findByLabel(label).should("have.length", 1);
      });
    });
  });

  it("builds a series of Or'd rules", () => {
    title = "Test OR rules";

    cy.createQuestionnaire(title);

    typeIntoDraftEditor(testId("txt-question-title", "testid"), "Question 1");
    cy.get(testId("nav-page-link")).should("contain", "Question 1");
    buildMultipleChoiceAnswer(["A", "B", "C"]);

    addQuestionPage("Question 2");
    buildMultipleChoiceAnswer(["D", "E", "F"]);

    addQuestionPage("Question 3");
    buildMultipleChoiceAnswer(["G", "H", "I"]);

    addSection();

    cy.contains("Untitled Page")
      .last()
      .click();

    typeIntoDraftEditor(testId("txt-question-title", "testid"), "Question 4");
    buildMultipleChoiceAnswer(["G", "H", "I"]);

    addQuestionPage("Question 5");
    buildMultipleChoiceAnswer(["J", "K", "L"]);

    cy.contains("Question 4").click();
    navigateToRoutingTab();

    cy.get(testId("btn-add-rule")).click();

    cy.get(testId("routing-rule"));

    cy.get(testId("routing-editor")).within(() => {
      cy.get(testId("routing-rule"))
        .last()
        .within(() => setRoutingCondition("Question 1", "A"));

      cy.get(testId("btn-add-rule")).click();
      cy.get(testId("routing-rule")).should("have.length", 2);

      cy.get(testId("routing-rule"))
        .last()
        .within(() => setRoutingCondition("Question 2", "D"));

      cy.get(testId("btn-add-rule")).click();
      cy.get(testId("routing-rule")).should("have.length", 3);

      cy.get(testId("routing-rule"))
        .last()
        .within(() => setRoutingCondition("Question 3", "G"));
    });

    cy.get(testId("options-selector"))
      .eq(0)
      .within(() => {
        cy.get("input")
          .first()
          .should("be.checked");
      });

    cy.get(testId("options-selector"))
      .eq(1)
      .within(() => {
        cy.get("input")
          .first()
          .should("be.checked");
      });
    cy.get(testId("options-selector"))
      .eq(2)
      .within(() => {
        cy.get("input")
          .first()
          .should("be.checked");
      });
  });

  it("can't route based on a future question", () => {
    title = "Test future question";

    cy.createQuestionnaire(title);

    typeIntoDraftEditor(testId("txt-question-title", "testid"), "Question 1");
    buildMultipleChoiceAnswer(["A", "B", "C"]);

    addQuestionPage("Question 2");
    buildMultipleChoiceAnswer(["D", "E", "F"]);

    addQuestionPage("Question 3");
    buildMultipleChoiceAnswer(["G", "H", "I"]);

    cy.contains("Question 2").click();

    navigateToRoutingTab();

    cy.get(testId("btn-add-rule")).click();

    findByLabel("IF").within(() => {
      cy.contains("Question 3").should("not.exist");
    });
  });

  it("updates the options when a new question is selected", () => {
    title = "Test options";

    cy.createQuestionnaire(title);

    typeIntoDraftEditor(testId("txt-question-title", "testid"), "Question 1");
    buildMultipleChoiceAnswer(["A", "B", "C"]);

    addQuestionPage("Question 2");
    buildMultipleChoiceAnswer(["D", "E", "F"]);

    addQuestionPage("Question 3");
    buildMultipleChoiceAnswer(["G", "H", "I"]);

    cy.contains("Question 2").click();

    navigateToRoutingTab();

    cy.get(testId("btn-add-rule")).click();

    cy.get(testId("options-selector"))
      .first()
      .contains("D");

    findByLabel("IF")
      .first()
      .select("Question 1");

    cy.get(testId("options-selector"))
      .first()
      .contains("A");
  });

  it("can't route to a previous question", () => {
    title = "Test options";

    cy.createQuestionnaire(title);

    typeIntoDraftEditor(testId("txt-question-title", "testid"), "Question 1");
    buildMultipleChoiceAnswer(["A", "B", "C"]);

    addQuestionPage("Question 2");
    buildMultipleChoiceAnswer(["D", "E", "F"]);

    addQuestionPage("Question 3");
    buildMultipleChoiceAnswer(["G", "H", "I"]);

    cy.contains("Question 2").click();

    navigateToRoutingTab();

    cy.get(testId("btn-add-rule")).click();

    cy.get(testId("routing-rule"));

    cy.get(testId("result-selector"))
      .first()
      .within(() => {
        cy.contains("Question 1").should("not.exist");
      });
  });

  it("defaults to unselected if rule is made on a unsupported answer", () => {
    title = "Test unsupported answer";
    cy.createQuestionnaire(title);

    typeIntoDraftEditor(testId("txt-question-title", "testid"), "Question 1");

    addAnswerType("Date");

    navigateToRoutingTab();

    cy.get(testId("btn-add-rule")).click();

    findByLabel("IF").should("have.value", null);
  });

  it("can build an AND rule", () => {
    title = "Test AND";

    cy.createQuestionnaire(title);

    typeIntoDraftEditor(testId("txt-question-title", "testid"), "Question 1");
    buildMultipleChoiceAnswer(["A", "B", "C"]);

    addQuestionPage("Question 2");
    buildMultipleChoiceAnswer(["D", "E", "F"]);

    addQuestionPage("Question 3");
    buildMultipleChoiceAnswer(["G", "H", "I"]);

    addQuestionPage("Question 4");
    buildMultipleChoiceAnswer(["J", "K", "L"]);

    addQuestionPage("Question 5");
    buildMultipleChoiceAnswer(["M", "N", "O"]);

    cy.contains("Question 4").click();

    navigateToRoutingTab();

    cy.get(testId("btn-add-rule")).click();

    cy.get(testId("btn-and")).click();

    cy.get(testId("and-not-valid-msg"));
    findByLabel("AND")
      .within(() => selectOptionByLabel("Question 1"))
      .closest(testId("routing-condition"))
      .within(() => {
        cy.get(testId("options-selector")).should("have.length", 1);
      });

    cy.get(testId("routing-condition")).should("have.length", 2);
  });

  it("should change rule if the dependent question is removed", () => {
    title = "Test remove question";

    cy.createQuestionnaire(title);

    typeIntoDraftEditor(testId("txt-question-title", "testid"), "Question 1");
    buildMultipleChoiceAnswer(["A", "B", "C"]);

    addQuestionPage("Question 2");
    buildMultipleChoiceAnswer(["D", "E", "F"]);

    addQuestionPage("Question 3");
    buildMultipleChoiceAnswer(["G", "H", "I"]);

    cy.contains("Question 2").click();

    navigateToRoutingTab();

    cy.get(testId("btn-add-rule")).click();

    cy.get(testId("routing-rule"))
      .last()
      .within(() => setRoutingCondition("Question 1", "A"));

    cy.contains("Question 1").click();

    cy.get(testId("tabs-nav"))
      .contains("Design")
      .click();

    cy.get(testId("btn-delete")).click();
    cy.get(testId("btn-delete-modal")).click();

    cy.get(testId("page-item")).should("have.length", 2);

    cy.get("[data-testid='txt-question-title']").contains("Question 2");

    navigateToRoutingTab();

    findByLabel("IF")
      .first()
      .contains("Question 1")
      .should("not.exist");

    cy.get(testId("deleted-answer-msg")).should("exist");
  });
});
