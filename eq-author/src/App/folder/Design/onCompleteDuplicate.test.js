import onCompleteDuplicate from "./onCompleteDuplicate";
import { buildFolderPath } from "utils/UrlUtils";

describe("onCompleteDuplicate", () => {
  let response, history, questionnaireId, sectionId, folderPosition;

  beforeEach(() => {
    response = {
      duplicateFolder: {
        id: "folder1",
        sections: [
          {
            folders: [
              {
                id: "folder2",
                pages: [
                  {
                    id: "page",
                  },
                ],
              },
            ],
            id: "section",
          },
        ],
      },
    };

    history = { push: jest.fn() };
    questionnaireId = "questionnaire";
    sectionId = "section";
    folderPosition = 0;
  });

  it("should duplicate a folder", () => {
    folderPosition = 0;
    onCompleteDuplicate(
      response,
      history,
      questionnaireId,
      sectionId,
      folderPosition
    );

    expect(history.push).toHaveBeenCalledWith(
      buildFolderPath({
        questionnaireId: questionnaireId,
        folderId: "folder1",
        tab: "design",
      })
    );
  });
});
