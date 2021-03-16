import onCompleteDelete from "./onCompleteDelete";
import { buildPagePath } from "utils/UrlUtils";

describe("onCompleteDelete", () => {
  let response, history, questionnaireId, folderPosition;

  beforeEach(() => {
    response = {
      deleteFolder: {
        folders: [
          {
            id: "folderId2",
            pages: [
              {
                id: "pageId1",
              },
            ],
          },
        ],
        id: "secId1",
      },
    };

    history = { push: jest.fn() };
    questionnaireId = "QId1";
    folderPosition = 0;
  });

  it("if deleted folder position = 0 it should redirect to the first question of that section", () => {
    const expected = buildPagePath({
      questionnaireId: questionnaireId,
      pageId: "pageId1",
    });

    onCompleteDelete(
      response.deleteFolder,
      history,
      questionnaireId,
      folderPosition
    );

    expect(history.push).toHaveBeenCalledWith(expected);
  });

  it("if deleted folder position > 0 it should redirect to the previous question or folder", () => {
    folderPosition = 1;
    const expected = buildPagePath({
      questionnaireId: questionnaireId,
      pageId: "pageId1",
    });

    onCompleteDelete(
      response.deleteFolder,
      history,
      questionnaireId,
      folderPosition
    );

    expect(history.push).toHaveBeenCalledWith(expected);
  });
});
