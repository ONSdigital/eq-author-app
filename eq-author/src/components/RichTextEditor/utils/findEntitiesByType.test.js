import findEntitiesByType from "components/RichTextEditor/utils/findEntitiesByType";
import Raw from "draft-js-raw-content-state";

describe("findEntitiesByType", () => {
  const findEntities = (entityType, callback) => {
    const editorState = new Raw()
      .addBlock("hello")
      .addEntity({ type: "ENTITY_A", mutability: "IMMUTABLE" }, 0, 1)
      .addEntity({ type: "ENTITY_B", mutability: "IMMUTABLE" }, 1, 1)
      .addEntity({ type: "ENTITY_A", mutability: "IMMUTABLE" }, 2, 1)
      .toEditorState();

    const contentState = editorState.getCurrentContent();
    const block = contentState.getFirstBlock();

    findEntitiesByType(entityType)(block, callback, contentState);
  };

  it("should find only entities of the supplied type", () => {
    const callbackA = jest.fn();
    findEntities("ENTITY_A", callbackA);
    expect(callbackA).toHaveBeenCalledTimes(2);

    const callbackB = jest.fn();
    findEntities("ENTITY_B", callbackB);
    expect(callbackB).toHaveBeenCalledTimes(1);
  });

  it("should invoke callback with start/end positions of entity", () => {
    const callbackA = jest.fn();
    findEntities("ENTITY_A", callbackA);
    expect(callbackA).toHaveBeenCalledWith(0, 1);
    expect(callbackA).toHaveBeenCalledWith(2, 3);

    const callbackB = jest.fn();
    findEntities("ENTITY_B", callbackB);
    expect(callbackB).toHaveBeenCalledWith(1, 2);
  });
});
