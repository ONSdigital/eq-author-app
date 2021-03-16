import { buildQuestionnaire } from "tests/utils/createMockQuestionnaire";
import {
  getSections,
  getFolders,
  getPages,
  getFolderById,
  getFolderByPageId,
  getSectionByFolderId,
  getSectionByPageId,
  getPageByConfirmationId,
} from "./";

describe("Helpers", () => {
  let questionnaire;

  beforeEach(() => {
    questionnaire = buildQuestionnaire();
  });

  it("Can get all sections in a questionnaire", () => {
    expect(getSections(questionnaire)).toMatchObject(questionnaire.sections);
  });

  it("Can get all folders in a questionnaire", () => {
    const folders = questionnaire.sections.flatMap(({ folders }) => folders);
    expect(getFolders(questionnaire)).toMatchObject(folders);
  });

  it("Can get all pages in a questionnaire", () => {
    const folders = questionnaire.sections.flatMap(({ folders }) => folders);
    const pages = folders.flatMap(({ pages }) => pages);

    expect(getPages(questionnaire)).toMatchObject(pages);
  });

  it("Can get a folder by it's ID", () => {
    const folders = questionnaire.sections.flatMap(({ folders }) => folders);
    const firstFolder = folders[0];
    expect(getFolderById(questionnaire, firstFolder.id)).toMatchObject(
      firstFolder
    );
  });

  it("Can get a folder by a page ID", () => {
    const folders = questionnaire.sections.flatMap(({ folders }) => folders);
    const firstFolder = folders[0];
    const firstPage = firstFolder.pages[0];

    expect(getFolderByPageId(questionnaire, firstPage.id)).toMatchObject(
      firstFolder
    );
  });

  it("Can get a section by a folder ID", () => {
    const sections = questionnaire.sections;
    const firstSection = sections[0];
    const folders = sections.flatMap(({ folders }) => folders);
    const firstFolder = folders[0];

    expect(getSectionByFolderId(questionnaire, firstFolder.id)).toMatchObject(
      firstSection
    );
  });

  it("Can get a section by a page ID", () => {
    const sections = questionnaire.sections;
    const firstSection = sections[0];
    const folders = sections.flatMap(({ folders }) => folders);
    const firstFolder = folders[0];
    const firstPage = firstFolder.pages[0];

    expect(getSectionByPageId(questionnaire, firstPage.id)).toMatchObject(
      firstSection
    );
  });

  it("Can get a page by a confirmation page ID", () => {
    const sections = questionnaire.sections;
    const folders = sections.flatMap(({ folders }) => folders);
    const firstFolder = folders[0];
    const firstPage = firstFolder.pages[0];
    firstPage.confirmation = { id: "1" };

    expect(
      getPageByConfirmationId(questionnaire, firstPage.confirmation.id)
    ).toMatchObject(firstPage);
  });
});
