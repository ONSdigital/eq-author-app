import { selectOptionByLabel, testId } from "../utils";

export const addMetadata = (metadataKey, type) => {
  cy.get(testId("metadata-btn")).as("metadataBtn");
  cy.get("@metadataBtn").should("be.visible");
  cy.get("@metadataBtn").click();

  cy.get(testId("metadata-add-row")).as("addMetadataBtn");
  cy.get("@addMetadataBtn").should("be.visible");
  cy.get("@addMetadataBtn").click();

  cy.get(testId("metadata-table-row")).within(() => {
    cy.get("[name='key']").as("metadataKey");
    cy.get("[name='type']").within(() => selectOptionByLabel(type));
  });

  cy.get("@metadataKey").type(metadataKey);
  cy.get("@metadataKey").should("have.value", metadataKey);

  cy.get("button")
    .contains("Done")
    .click();
};
