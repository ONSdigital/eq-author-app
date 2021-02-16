export default (entityType) => {
  return function findEntitiesByType(contentBlock, callback, contentState) {
    contentBlock.findEntityRanges((character) => {
      const entityKey = character.getEntity();
      return (
        character.getEntity() !== null &&
        contentState.getEntity(entityKey).getType() === entityType
      );
    }, callback);
  };
};
