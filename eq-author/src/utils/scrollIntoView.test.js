import scrollIntoView from "./scrollIntoView";

describe("scrollIntoView", () => {
  it("should scroll a node into view", () => {
    const node = { scrollIntoView: jest.fn() };

    scrollIntoView(node);

    expect(node.scrollIntoView).toHaveBeenCalledWith(
      expect.objectContaining({
        behavior: "smooth"
      })
    );
  });
});
