import { mapMutateToProps } from "./withUpdateAnswer";

describe("withUpdateAnswer", () => {
  let mutate;

  beforeEach(() => {
    mutate = jest.fn();
  });

  it("should add onUpdateAnswer prop", () => {
    const props = mapMutateToProps({ mutate });
    expect(props.onUpdateAnswer).toBeInstanceOf(Function);
  });

  it("should invoke mutate passing answer as variable", () => {
    const props = mapMutateToProps({ mutate });
    const answer = { id: "1" };

    props.onUpdateAnswer(answer);
    expect(mutate).toHaveBeenCalledWith({
      variables: { input: answer },
      refetchQueries: ["GetQuestionnaire"],
    });
  });

  it("should filter out invalid inputs", () => {
    const props = mapMutateToProps({ mutate });
    const answer = { id: "1", type: "foo" };

    props.onUpdateAnswer(answer);
    expect(mutate).toHaveBeenCalledWith({
      variables: { input: { id: "1" } },
      refetchQueries: ["GetQuestionnaire"],
    });
  });
});
