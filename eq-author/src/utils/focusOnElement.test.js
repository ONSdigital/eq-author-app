import focusOnElement from "./focusOnElement";

describe("focusOnElement", () => {
  let querySelector;

  beforeEach(() => {
    querySelector = jest.spyOn(document, "getElementById");
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should call focus on returned node", () => {
    const focus = jest.fn();
    querySelector.mockReturnValue({ focus });

    focusOnElement("123");
    expect(focus).toHaveBeenCalled();
  });
});
