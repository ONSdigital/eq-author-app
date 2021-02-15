import { SelectionState, Modifier } from "draft-js";

const getEntityRange = (block, entityKey) => {
  let range;

  // get the range for the entity key
  block.findEntityRanges(
    (char) => char.getEntity() === entityKey,
    (start, end) => {
      range = { start, end };
    }
  );

  return SelectionState.createEmpty(block.key).merge({
    anchorKey: block.key,
    anchorOffset: range.start,
    focusKey: block.key,
    focusOffset: range.end,
  });
};

const replaceText = (contentState, entityKey, blockKey, text, inlineStyles) => {
  const block = contentState.getBlockForKey(blockKey);
  const entitySelection = getEntityRange(block, entityKey);

  // first replace text
  const updatedContentState = Modifier.replaceText(
    contentState,
    entitySelection,
    text,
    inlineStyles,
    entityKey
  );

  // then create new selection, which covers the updated entity
  const updatedEntitySelection = entitySelection.merge({
    focusOffset: entitySelection.getStartOffset() + text.length,
  });

  // apply the updated entity to the content
  return Modifier.applyEntity(
    updatedContentState,
    updatedEntitySelection,
    entityKey
  );
};

export default replaceText;
