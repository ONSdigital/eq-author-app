import query from "graphql/questionConfirmation/undelete.graphql";

import {
  undeleteQuestionConfirmation,
  UNDELETE_QUESTION_CONFIRMATION_REQUEST,
  UNDELETE_QUESTION_CONFIRMATION_SUCCESS,
  UNDELETE_QUESTION_CONFIRMATION_FAILURE
} from "./undeleteQuestionConfirmation";

describe("undelete question confirmation", () => {
  let createArgs, runArgs;
  let dispatch, client;

  beforeEach(() => {
    dispatch = jest.fn();
    client = {
      mutate: jest.fn().mockResolvedValue({
        data: {
          undeleteQuestionConfirmation: {
            id: "1"
          }
        }
      })
    };
    const getState = jest.fn();
    createArgs = [
      "cacheId",
      { questionConfirmation: { id: "1" }, goBack: jest.fn() }
    ];
    runArgs = [dispatch, getState, { client }];
  });

  it("should return a function", () => {
    expect(undeleteQuestionConfirmation(...createArgs)).toEqual(
      expect.any(Function)
    );
  });

  it("should trigger undelete", async () => {
    await undeleteQuestionConfirmation(...createArgs)(...runArgs);
    expect(client.mutate).toHaveBeenCalledWith({
      mutation: query,
      variables: {
        input: { id: "1" }
      }
    });
    expect(dispatch).toHaveBeenCalledWith({
      type: UNDELETE_QUESTION_CONFIRMATION_REQUEST
    });
  });

  it("should dispatch success on completion", async () => {
    await undeleteQuestionConfirmation(...createArgs)(...runArgs);
    expect(dispatch).toHaveBeenCalledWith({
      type: UNDELETE_QUESTION_CONFIRMATION_SUCCESS
    });
  });

  it("should call go back on success", async () => {
    await undeleteQuestionConfirmation(...createArgs)(...runArgs);
    expect(createArgs[1].goBack).toHaveBeenCalled();
  });

  it("should dispatch failure on rejection", async () => {
    runArgs[2].client.mutate = jest.fn().mockRejectedValue("Error");
    await undeleteQuestionConfirmation(...createArgs)(...runArgs);
    expect(dispatch).toHaveBeenCalledWith({
      type: UNDELETE_QUESTION_CONFIRMATION_FAILURE
    });
    expect(createArgs[1].goBack).not.toHaveBeenCalled();
  });
});
