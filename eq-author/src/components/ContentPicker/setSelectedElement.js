const getDesiredPath = (
  entity,
  selectedId,
  config,
  selectedDepth,
  currentDepth = 0,
  path = []
) => {
  if (currentDepth === selectedDepth && entity.id === selectedId) {
    return [...path, entity];
  }

  const { childKey } = config[currentDepth];
  const children = childKey ? entity[childKey] : [];

  for (let i = 0; i < children.length; i++) {
    const result = getDesiredPath(
      children[i],
      selectedId,
      config,
      selectedDepth,
      currentDepth + 1,
      [...path, entity]
    );
    if (result) {
      return result;
    }
  }
};

export default (config, selectedId, data) => {
  return getDesiredPath(
    { parent: data },
    selectedId,
    [{ childKey: "parent" }, ...config],
    config.length
  ).slice(1);
};
