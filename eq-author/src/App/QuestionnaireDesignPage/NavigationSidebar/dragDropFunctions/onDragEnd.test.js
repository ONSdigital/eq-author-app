import { buildQuestionnaire } from "tests/utils/createMockQuestionnaire";
import onDragEnd from "./onDragEnd";

const buildDestination = (entity, index) => ({
  droppableId: entity.id,
  index,
});

const buildSource = (entity, index) => ({ droppableId: entity.id, index });

describe("onDragEnd", () => {
  let questionnaire, mockMovePage, mockMoveFolder;

  beforeEach(() => {
    questionnaire = buildQuestionnaire({
      sectionCount: 2,
      folderCount: 2,
      pageCount: 3,
      answerCount: 1,
    });

    mockMovePage = jest.fn();
    mockMoveFolder = jest.fn();
  });

  describe("Moving folders", () => {
    it("Doesn't let you move a folder into a folder", () => {
      const folderToMove = questionnaire.sections[0].folders[0];
      const section = questionnaire.sections[0];
      const destinationFolder = questionnaire.sections[0].folders[1];

      const result = onDragEnd(
        questionnaire,
        buildDestination(destinationFolder, 0),
        buildSource(section, 0),
        folderToMove.id,
        mockMovePage,
        mockMoveFolder
      );

      expect(result).toBe(-1);
      expect(mockMoveFolder).toHaveBeenCalledTimes(0);
      expect(mockMovePage).toHaveBeenCalledTimes(0);
    });

    it("Lets you move a folder to another position in the section", () => {
      const folder = questionnaire.sections[0].folders[0];
      const section = questionnaire.sections[0];

      const result = onDragEnd(
        questionnaire,
        buildDestination(section, 1),
        buildSource(section, 0),
        folder.id,
        mockMovePage,
        mockMoveFolder
      );

      expect(result).toBe(1);
      expect(mockMoveFolder).toHaveBeenCalledTimes(1);
      expect(mockMovePage).toHaveBeenCalledTimes(0);
    });
  });

  describe("Moving pages", () => {
    it("Lets you move a page within a section", () => {
      const pageToMove = questionnaire.sections[0].folders[0].pages[0];
      const section = questionnaire.sections[0];

      const result = onDragEnd(
        questionnaire,
        buildDestination(section, 1),
        buildSource(section, 0),
        pageToMove.id,
        mockMovePage,
        mockMoveFolder
      );

      expect(result).toBe(1);
      expect(mockMovePage).toHaveBeenCalledTimes(1);
      expect(mockMoveFolder).toHaveBeenCalledTimes(0);
    });

    it("Lets you move a page within a folder", () => {
      const pageToMove = questionnaire.sections[0].folders[0].pages[0];
      const folder = questionnaire.sections[0].folders[0];

      const result = onDragEnd(
        questionnaire,
        buildDestination(folder, 1),
        buildSource(folder, 0),
        pageToMove.id,
        mockMovePage,
        mockMoveFolder
      );

      expect(result).toBe(1);
      expect(mockMovePage).toHaveBeenCalledTimes(1);
      expect(mockMoveFolder).toHaveBeenCalledTimes(0);
    });
  });
});
