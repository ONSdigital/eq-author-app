import getEntities from "components/RichTextEditor/utils/getEntities";
import Raw from "draft-js-raw-content-state";

describe("getEntities", () => {
  const findEntities = (entityType) => {
    const contentState = new Raw()
      .addBlock("hello")
      .addEntity({ type: "ENTITY_A", mutability: "IMMUTABLE" }, 0, 1)
      .addEntity({ type: "ENTITY_B", mutability: "IMMUTABLE" }, 1, 1)
      .addEntity({ type: "ENTITY_A", mutability: "IMMUTABLE" }, 2, 1)
      .toContentState();

    return getEntities(contentState, entityType);
  };

  it("should find all entities if no type supplied", () => {
    const entities = findEntities();
    expect(entities).toHaveLength(3);
  });

  it("should find only entities of the supplied type", () => {
    const entitiesA = findEntities("ENTITY_A");
    expect(entitiesA).toHaveLength(2);

    const entitiesB = findEntities("ENTITY_B");
    expect(entitiesB).toHaveLength(1);
  });

  it("should return the entity itself", () => {
    const entities = findEntities("ENTITY_A");
    entities.forEach((entity) => {
      expect(entity).toMatchObject({
        entity: expect.objectContaining({
          type: "ENTITY_A",
          mutability: "IMMUTABLE",
        }),
      });
    });
  });

  it("should return metadata about the entity", () => {
    const entities = findEntities("ENTITY_A");
    entities.forEach((entity) => {
      expect(entity).toMatchObject({
        start: expect.any(Number),
        end: expect.any(Number),
        blockKey: expect.any(String),
        entityKey: expect.any(String),
      });
    });
  });
});
