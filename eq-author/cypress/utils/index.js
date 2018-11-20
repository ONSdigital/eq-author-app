import { matchPath } from "../../src/utils/UrlUtils";
import { RADIO } from "../../src/constants/answer-types";
export const testId = (id, attr = "test") => `[data-${attr}="${id}"]`;

export const answerTypes = ["Textfield", "Textarea", "Currency", "Number"];

export const selectOptionByLabel = label => {
  cy.get("option")
    .contains(label)
    .then(option => option.val())
    .then(value => {
      cy.root()
        .select(label)
        .should("have.value", value);
    });
};

export function setQuestionnaireSettings(name) {
  cy.get(testId("questionnaire-settings-modal")).within(() => {
    cy.get(testId("txt-questionnaire-title"))
      .clear()
      .type(name);
    cy.get("label[for='navigation']").click();

    cy.get("form").submit();
  });
}

export const addQuestionnaire = title => {
  cy.get(testId("create-questionnaire")).click();
  setQuestionnaireSettings(title);
};

export const addSection = (initialNumberOfSections = 1) => {
  cy.get(testId("nav-section-link")).should(
    "have.length",
    initialNumberOfSections
  );

  cy.get(testId("add-menu")).within(() => {
    cy.get("button")
      .contains("Add")
      .click()
      .get("button")
      .contains("Section")
      .click();
  });

  cy.get(testId("nav-section-link")).should(
    "have.length",
    initialNumberOfSections + 1
  );
};

export const deleteSection = ({ index }) => {
  cy.get(testId("nav-section-link"))
    .eq(index)
    .click();
  cy.get(testId("btn-delete")).click();
  cy.get(testId("delete-confirm-modal")).within(() => {
    cy.get("button")
      .contains("Delete")
      .click();
  });
};

export const addQuestionPage = (title = "hello world") => {
  let prevCount;

  cy.get(testId("nav-page-link")).then(items => {
    prevCount = items.length;

    cy.get(testId("add-menu")).within(() => {
      cy.get("button")
        .contains("Add")
        .click()
        .get("button")
        .contains("Question page")
        .click();
    });

    cy.get(testId("nav-page-link")).should("have.length", prevCount + 1);
    cy.get(testId("nav-page-link")).should("contain", "Untitled Page");

    typeIntoDraftEditor(testId("txt-question-title", "testid"), title);

    cy.get(testId("nav-page-link")).should("contain", title);
  });
};

export const buildMultipleChoiceAnswer = labelArray => {
  addAnswerType(RADIO);

  cy.get(testId("btn-add-option")).click();

  cy.get(testId("option-label")).should("have.length", 3);

  labelArray.forEach((label, index) =>
    cy
      .get(testId("option-label"))
      .eq(index)
      .type(label)
  );
};

export function addAnswerType(answerType) {
  cy.get(testId("btn-add-answer")).click();
  cy.get(testId(`btn-answer-type-${answerType.toLowerCase()}`)).click();
}

export const switchPilltab = pillOption => {
  cy.get(`button[aria-controls='${pillOption}']`).click();
};

export const matchHashToPath = (path, hash) => {
  hash = hash.substr(1).replace(Cypress.env("BASE_NAME"), "");

  return matchPath(hash, {
    path,
    exact: true,
    strict: false
  });
};

export function assertHash({
  previousPath,
  previousHash,
  currentPath,
  equality
}) {
  cy.log("comparing previous hash", previousHash)
    .hash()
    .should(currentHash => {
      const previousMatch = matchHashToPath(previousPath, previousHash);
      const currentMatch = matchHashToPath(currentPath, currentHash);

      expect(previousMatch).not.to.equal(null);
      expect(currentMatch).not.to.equal(null);

      Object.keys(equality).forEach(key => {
        const previousParam = previousMatch.params[key];
        const currentParam = currentMatch.params[key];

        if (equality[key]) {
          expect(previousParam, key).to.equal(currentParam);
        } else {
          expect(previousParam, key).not.to.equal(currentParam);
        }
      });
    });
}

export const typeIntoDraftEditor = (selector, text) => {
  cy.log("Typing into RTE", text)
    .get(selector)
    .type(text)
    .blur();
  cy.get(selector).should("contain", text);
};

export const findByLabel = text =>
  cy
    .log("Find by label", text)
    .get("label")
    .contains(text)
    .then($label => $label.prop("control"));

export const removeAnswer = params => {
  cy.get(testId("btn-delete-answer")).click(params);
  cy.dismissAllToast();
  cy.get(testId("toast-item"), { timeout: 15000 }).should("have.length", 0);
};

export const navigateToPage = text => {
  cy.log("Navigating to page", text)
    .get(testId("nav-page-link"))
    .contains(text)
    .first()
    .click();
};

export const navigateToFirstSection = () => {
  cy.get(testId("nav-section-link"))
    .first()
    .click();
};

export const toggleCheckboxOn = selector => {
  cy.get(selector).within(() => {
    cy.get('[type="checkbox"]').should("not.be.checked");
  });
  cy.get(selector).click();
  cy.get(selector).within(() => {
    cy.get('[type="checkbox"]').should("be.checked");
  });
};

export const toggleCheckboxOff = selector => {
  cy.get(selector).within(() => {
    cy.get('[type="checkbox"]').should("be.checked");
  });
  cy.get(selector).click();
  cy.get(selector).within(() => {
    cy.get('[type="checkbox"]').should("not.be.checked");
  });
};

export const selectFirstAnswerFromContentPicker = () => {
  cy.get("button")
    .contains("Answer")
    .click();

  cy.get(testId("picker-title"))
    .first()
    .click();

  // Section
  cy.get(testId("picker-option"))
    .first()
    .click();
  // Question page
  cy.get(testId("picker-option"))
    .first()
    .click();
  // Answer
  cy.get(testId("picker-option"))
    .first()
    .click();

  cy.get(testId("submit-button")).click();
};

export const selectFirstMetadataContentPicker = () => {
  // Metedata
  cy.get(testId("picker-option"))
    .first()
    .click();

  cy.get(testId("submit-button")).click();
};
