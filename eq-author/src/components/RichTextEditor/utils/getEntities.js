function getEntities(contentState, entityType) {
  const entities = [];

  contentState.getBlocksAsArray().forEach(block => {
    let selectedEntity = null;

    block.findEntityRanges(
      character => {
        const entityKey = character.getEntity();

        if (entityKey === null) {
          return false;
        }

        const entity = contentState.getEntity(entityKey);

        if (entityType && entity.getType() !== entityType) {
          return false;
        }

        selectedEntity = {
          entityKey,
          entity,
          blockKey: block.getKey()
        };

        return true;
      },
      (start, end) => {
        entities.push({ ...selectedEntity, start, end });
      }
    );
  });

  return entities;
}

export default getEntities;
