import getIdForObject from "./getIdForObject";
import focusOnEntity from "./focusOnEntity";

describe("focusOnEntity", () => {
  let querySelector;
  const entity = {
    id: "123",
    __typename: "Foo",
  };

  beforeEach(() => {
    querySelector = jest.spyOn(document, "querySelector");
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should try to find the entity by ID", () => {
    focusOnEntity(entity);
    const id = getIdForObject(entity);

    expect(querySelector).toHaveBeenCalledWith(`#${id} [data-autofocus]`);
  });

  it("should call focus on returned node", () => {
    const focus = jest.fn();
    querySelector.mockReturnValue({ focus });

    focusOnEntity(entity);
    expect(focus).toHaveBeenCalled();
  });

  it("should not throw if node not found", () => {
    querySelector.mockReturnValue(null);

    expect(() => {
      focusOnEntity(entity);
    }).not.toThrow();
  });
});
