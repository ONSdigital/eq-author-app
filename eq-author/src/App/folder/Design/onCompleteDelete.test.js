import { onCompleteDelete } from "./onCompleteDelete";
import { buildPagePath, buildSectionPath } from "utils/UrlUtils";

describe("onCompleteDelete", () => {
  let props, response, history, questionnaireId, sectionId, folderPosition;

  beforeEach(() => {
    response = {
      deleteFolder: {
        id: "folderId1",
        sections: [
          {
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
        ],
      },
    };

    history = { push: jest.fn() };
    questionnaireId = "QId1";
    sectionId = "secId1";
    folderPosition = 0;
  });

  it("if deleted folder position = 0 it should redirect to the section that folder was in", () => {
    const expected = buildSectionPath({
      questionnaireId: questionnaireId,
      sectionId: sectionId,
    });

    onCompleteDelete(
      response,
      history,
      questionnaireId,
      sectionId,
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
      response,
      history,
      questionnaireId,
      sectionId,
      folderPosition
    );

    expect(history.push).toHaveBeenCalledWith(expected);
  });
});
