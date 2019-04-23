import {
  typeIntoDraftEditor,
  findInputByLabel,
  addSection,
  addQuestionPage,
  buildMultipleChoiceAnswer,
  testId,
  addAnswerType,
  selectAnswerFromContentPicker,
} from "../../utils";
import {
  CURRENCY,
  PERCENTAGE,
  NUMBER,
} from "../../../src/constants/answer-types";

let title;

const navigateToRoutingTab = () =>
  cy
    .log("Navigating to routing tab")
    .get(testId("tabs-nav"))
    .within(() => {
      cy.get(`a${testId("routing")}`).click();
    })
    .url()
    .should("contain", "routing");

const clickOnRoutingRuleOption = ({ label }) => {
  cy.get(testId("routing-rule"))
    .last()
    .within(() => {
      cy.get(testId("options-selector")).within(() => {
        cy.contains(label).click();
      });
    });
};

describe("Routing", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.login();
  });

  // afterEach(() => {
  //   title && cy.deleteQuestionnaire(title);
  // });

  it("should see no routing rules exist and add one and then delete it", () => {
    title = "Test no routing rules";
    cy.seedQuestionnaire(title);

    cy.contains("Question 1").click();
    cy.contains("Untitled Page").click();

    navigateToRoutingTab();

    cy.get(testId("routing-rule-set-empty-msg"));
    cy.get(testId("btn-add-routing")).click();
    cy.get(testId("routing-rule"));
    cy.get(testId("btn-delete")).click();
    cy.get(testId("routing-rule-set-empty-msg"));
  });

  it("can change the destination to another page", () => {
    title = "Test routing destination";
    cy.seedQuestionnaire(title);
    cy.contains("Untitled Page").click();

    cy.contains("Question 1").click();

    navigateToRoutingTab();

    cy.get(testId("btn-add-routing")).click();

    findInputByLabel("THEN").contains("Question 2");

    findInputByLabel("THEN").click();
    cy.get(testId("picker-title"))
      .first()
      .click();
    cy.get(testId("picker-option"))
      .last()
      .click();
    cy.get(testId("submit-button")).click();

    findInputByLabel("THEN").contains("Question 3");
  });

  [CURRENCY, NUMBER, PERCENTAGE].forEach(type => {
    it(`should be able to add a ${type} routing rule and edit the inputs`, () => {
      title = `Test routing ${type}`;
      cy.seedQuestionnaire(title);
      cy.contains("Question 1").click();
      navigateToRoutingTab();

      cy.get(testId("btn-add-routing")).click();

      cy.get(testId("condition-selector")).select("LessThan");

      cy.get(testId("number-value-input"))
        .type("123")
        .blur();

      cy.get(testId("number-value-input")).should("have.value", "123");
    });
  });

  it("follows the link to add an answer and routing updates with the new answer", () => {
    title = "Test routing no answer";
    cy.createQuestionnaire(title);
    cy.contains("Untitled Page").click();

    typeIntoDraftEditor(testId("txt-question-title", "testid"), "Question 1");

    navigateToRoutingTab();

    cy.get(testId("btn-add-routing")).click();

    cy.get(testId("no-answer-msg")).within(() => {
      cy.contains("add an answer").click();
    });

    const options = ["A", "B", "C"];

    buildMultipleChoiceAnswer(options, "Radio Answer");

    navigateToRoutingTab();

    cy.get(testId("routing-rule")).within(() => {
      findInputByLabel("IF")
        .first()
        .contains("Radio Answer");
    });

    cy.get(testId("options-selector")).within(() => {
      options.forEach(label => {
        findInputByLabel(label).should("have.length", 1);
      });
    });
  });

  it("builds a series of Or'd rules", () => {
    title = "Test OR rules";
    cy.seedQuestionnaire(title);

    cy.contains("Question 4").click();
    navigateToRoutingTab();

    cy.get(testId("btn-add-routing")).click();

    cy.get(testId("routing-rule"))
      .last()
      .within(() => findInputByLabel("IF").click());

    selectAnswerFromContentPicker({
      sectionTitle: "Section 1",
      questionTitle: "Question 1",
      answerTitle: "Answer 1",
    });

    clickOnRoutingRuleOption({ label: "A" });

    cy.get(testId("btn-add-rule")).click();
    cy.get(testId("routing-rule")).should("have.length", 2);

    cy.get(testId("routing-rule"))
      .last()
      .within(() => findInputByLabel("IF").click());

    selectAnswerFromContentPicker({
      sectionTitle: "Section 1",
      questionTitle: "Question 2",
      answerTitle: "Answer 2",
    });

    clickOnRoutingRuleOption({ label: "D" });

    cy.get(testId("btn-add-rule")).click();
    cy.get(testId("routing-rule")).should("have.length", 3);

    cy.get(testId("routing-rule"))
      .last()
      .within(() => findInputByLabel("IF").click());

    selectAnswerFromContentPicker({
      sectionTitle: "Section 1",
      questionTitle: "Question 3",
      answerTitle: "Answer 3",
    });

    clickOnRoutingRuleOption({ label: "G" });

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
    title = "Test routing future question";
    cy.seedQuestionnaire(title);
    cy.contains("Untitled Page").click();

    cy.contains("Question 2").click();

    navigateToRoutingTab();

    cy.get(testId("btn-add-routing")).click();

    findInputByLabel("IF").within(() => {
      cy.contains("Question 3").should("not.exist");
    });
  });

  it("updates the options when a new question is selected", () => {
    title = "Test routing updates options";
    cy.seedQuestionnaire(title);

    cy.contains("Question 2").click();
    navigateToRoutingTab();

    cy.get(testId("btn-add-routing")).click();

    cy.get(testId("options-selector"))
      .first()
      .contains("D");

    findInputByLabel("IF").click();
    selectAnswerFromContentPicker({
      sectionTitle: "Section 1",
      questionTitle: "Question 1",
      answerTitle: "Answer 1",
    });
    cy.get(testId("options-selector"))
      .first()
      .contains("A");
  });

  it.only("can't route to a previous question", () => {
    title = "Test routing previous question";
    cy.seedQuestionnaire(title);

    cy.contains("Question 2").click();

    navigateToRoutingTab();

    cy.get(testId("btn-add-routing")).click();

    cy.get(testId("routing-rule"));

    findInputByLabel("THEN").click();
    cy.get(testId("picker-title"))
      .first()
      .click();
    cy.get(testId("picker-option"))
      .contains("Question 1")
      .should("not.exist");
    cy.get(testId("cancel-button")).click();
  });

  it("can build an AND rule", () => {
    title = "Test AND";

    cy.createQuestionnaire(title);
    cy.get(testId("nav-section-link"))
      .first()
      .click();
    typeIntoDraftEditor(testId("txt-section-title", "testid"), "Section 1");

    cy.get(testId("nav-page-link"))
      .first()
      .click();

    typeIntoDraftEditor(testId("txt-question-title", "testid"), "Question 1");
    buildMultipleChoiceAnswer(["A", "B", "C"], "Answer 1");

    addQuestionPage("Question 2");
    buildMultipleChoiceAnswer(["D", "E", "F"], "Answer 2");

    navigateToRoutingTab();

    cy.get(testId("btn-add-routing")).click();

    cy.get(testId("btn-and")).click();

    cy.get(testId("and-not-valid-msg"));

    findInputByLabel("AND").click();

    selectAnswerFromContentPicker({
      sectionTitle: "Section 1",
      questionTitle: "Question 1",
      answerTitle: "Answer 1",
    });

    findInputByLabel("AND")
      .closest(testId("routing-binary-expression"))
      .within(() => {
        cy.get(testId("options-selector")).should("have.length", 1);
      });

    cy.get(testId("routing-binary-expression")).should("have.length", 2);
  });

  it("should change rule if the dependent question is removed", () => {
    title = "Test remove question";

    cy.createQuestionnaire(title);
    cy.get(testId("nav-section-link"))
      .first()
      .click();
    typeIntoDraftEditor(testId("txt-section-title", "testid"), "Section 1");

    cy.get(testId("nav-page-link"))
      .first()
      .click();
    typeIntoDraftEditor(testId("txt-question-title", "testid"), "Question 1");
    buildMultipleChoiceAnswer(["A", "B", "C"]);

    navigateToRoutingTab();

    cy.get(testId("btn-add-routing")).click();

    cy.get(testId("tabs-nav"))
      .contains("Design")
      .click();

    cy.get(testId("btn-delete-answer")).click();

    cy.get(testId("btn-delete-answer")).should("not.exist");

    navigateToRoutingTab();

    findInputByLabel("IF")
      .first()
      .contains("Answer 1")
      .should("not.exist");

    cy.get(testId("deleted-answer-msg")).should("exist");
  });

  it("can change the else destination", () => {
    title = "Routing else destination";

    cy.createQuestionnaire(title);
    cy.get(testId("nav-section-link"))
      .first()
      .click();
    typeIntoDraftEditor(testId("txt-section-title", "testid"), "Section 1");

    cy.get(testId("nav-page-link"))
      .first()
      .click();
    typeIntoDraftEditor(testId("txt-question-title", "testid"), "Question 1");

    addQuestionPage("Question 2");

    cy.contains("Question 1").click();
    navigateToRoutingTab();

    cy.get(testId("btn-add-routing")).click();

    findInputByLabel("ELSE").contains("Question 2");

    findInputByLabel("ELSE")
      .parent()
      .within(() => {
        cy.get(testId("routing-destination-content-picker")).click();
      });

    cy.get(testId("EndOfQuestionnaire-picker")).click();
    cy.get(testId("submit-button")).click();
    findInputByLabel("ELSE").contains("End of questionnaire");
  });
});
