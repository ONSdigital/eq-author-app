import { mapMutateToProps } from "./withMoveAnswer";

describe("withMoveAnswer", () => {
  it("should return moveAnswer that calls mutate filtering the answer to id and position", () => {
    const mutate = jest.fn();
    const { moveAnswer } = mapMutateToProps({ mutate });
    moveAnswer({
      id: "1",
      position: 1,
      title: "should not see",
    });
    expect(mutate).toHaveBeenCalledWith({
      variables: {
        input: {
          id: "1",
          position: 1,
        },
      },
    });
  });
});
