import focusOnNode from "./focusOnNode";

describe("focusOnElement", () => {
  let ref;

  beforeEach(() => {
    ref = {
      current: {
        focus: jest.fn(),
      },
    };
    focusOnNode(ref);
  });

  it("should call focus on returned node", () => {
    expect(ref.current.focus).toHaveBeenCalled();
  });
});
