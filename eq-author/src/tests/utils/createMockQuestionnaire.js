import { times } from "lodash";

export const buildPages = (sectionNumber, count) =>
  times(count, i => ({
    id: `${sectionNumber}.${i + 1}`,
    title: `Page ${sectionNumber}.${i + 1}`,
    displayName: `Page ${sectionNumber}.${i + 1}`,
    position: i
  }));

export const buildSections = count =>
  times(count, i => ({
    id: `${i + 1}`,
    title: `Section ${i + 1}`,
    displayName: `Section ${i + 1}`,
    pages: buildPages(i + 1, 2),
    position: i
  }));

export const buildQuestionnaire = (numOfSections = 2) => ({
  id: "1",
  sections: buildSections(numOfSections)
});
