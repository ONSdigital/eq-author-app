import { testId, addQuestionnaire, selectOptionByLabel } from "../../utils";

describe("Metadata", () => {
  it("Can create a questionnaire", () => {
    cy.visit("/");
    cy.login();
    addQuestionnaire("Metadata Test");
  });
  describe("Actions", () => {
    beforeEach(() => {
      cy.get(testId("metadata-btn")).as("metadataBtn");
      cy.get("@metadataBtn").should("be.visible");
      cy.get("@metadataBtn").click();

      cy.get(testId("metadata-add-row")).as("addMetadataBtn");
      cy.get("@addMetadataBtn").should("be.visible");
      cy.get("@addMetadataBtn").click();
    });
    describe("Add", () => {
      it("Should add new row to table", () => {
        cy.get(testId("metadata-table-row")).should("be.visible");
        cy.get(testId("metadata-table-row")).should("have.length", 1);
      });
      it("Should default type to 'Text'", () => {
        cy.get(testId("metadata-table-row")).within(() =>
          cy.get("[name='type']").should("have.value", "Text")
        );
      });
    });
    describe("Update", () => {
      it("Should allow key value to be updated with custom value", () => {
        const input = "ru_ref_custom";
        cy.get(testId("metadata-table-row")).within(() =>
          cy.get("[name='key']").as("metadataKey")
        );
        cy.get("@metadataKey").type(input);
        cy.get("@metadataKey").should("have.value", input);
      });
      it("Should allow key value to be updated from select list", () => {
        const select = "ru_name";
        cy.get(testId("metadata-table-row")).within(() =>
          cy.get("[name='key']").as("metadataKey")
        );
        cy.get("@metadataKey").click();
        cy.contains(select).click();
        cy.get("@metadataKey").should("have.value", select);
      });
      it("Should allow alias value to be updated", () => {
        const input = "ru_ref_alias";
        cy.get(testId("metadata-table-row")).within(() =>
          cy.get("[name='alias']").as("metadataAlias")
        );
        cy.get("@metadataAlias").type(input);
        cy.get("@metadataAlias").should("have.value", input);
      });
      it("Should allow 'Text' type and value to be updated", () => {
        cy.get(testId("metadata-table-row")).within(() => {
          cy.get("[name='type']").within(() => selectOptionByLabel("Text"));
          cy.get("[name='textValue']").type("test");
        });
      });
      it("Should allow 'Date' type and value to be updated", () => {
        cy.get(testId("metadata-table-row")).within(() => {
          cy.get("[name='type']").within(() => selectOptionByLabel("Date"));
          cy.get("[name='dateValue']").type("2018-01-01");
        });
      });
      it("Should allow 'Language' type and value to be updated", () => {
        cy.get(testId("metadata-table-row")).within(() => {
          cy.get("[name='type']").within(() => selectOptionByLabel("Language"));
          cy.get("[name='languageValue']").within(() =>
            selectOptionByLabel("cy")
          );
        });
      });
      it("Should allow 'Region' type and value to be updated", () => {
        cy.get(testId("metadata-table-row")).within(() => {
          cy.get("[name='type']").within(() => selectOptionByLabel("Region"));
          cy.get("[name='regionValue']").within(() =>
            selectOptionByLabel("GB_ENG")
          );
        });
      });
    });
    describe("Delete", () => {
      it("Should delete row from table", () => {
        cy.get(testId("metadata-table-row")).should("be.visible");
        cy.get(testId("metadata-table-row")).should("have.length", 1);
        cy.get(testId("metadata-delete-row")).click();
        cy.get(testId("metadata-table-row")).should("not.be.visible");
        cy.get(testId("metadata-add-row")).click();
      });
    });
    afterEach(() => {
      cy.get(testId("metadata-delete-row")).as("deleteMetadataBtn");
      cy.get("@deleteMetadataBtn").should("be.visible");
      cy.get("@deleteMetadataBtn").click();
      cy.contains("Done").click();
    });
  });
});
