import React from "react";
import styled from "styled-components";
import { EditorState, Modifier } from "draft-js";

const ENTITY_TYPE = "LINK";

const filterConfig = {
  type: ENTITY_TYPE,
};

const linkFromHTML = {
  a: (nodeName, node, createEntity) =>
    createEntity(ENTITY_TYPE, "MUTABLE", node.href),
};

const linkToHTML = {
  [ENTITY_TYPE]: (entity, originalText) => (
    <a href={entity.data} target="_blank" rel="noopener noreferrer">
      {originalText}
    </a>
  ),
};

const Link = ({ entityKey, contentState, children }) => {
  const { url } = contentState.getEntity(entityKey).getData();

  return <a href={url}> {children} </a>;
};

const linkStrategy = (contentBlock, callback, contentState) => {
  contentBlock.findEntityRanges(character => {
    const entityRef = character.getEntity();
    return (
      entityRef !== null &&
      contentState.getEntity(entityRef).getType() === ENTITY_TYPE
    );
  }, callback);
};

const createLink = (text, url, editorState) => {
  const contentState = editorState.getCurrentContent();
  const contentStateWithEntity = contentState.createEntity(
    ENTITY_TYPE,
    "IMMUTABLE",
    url
  );

  const contentWithLink = Modifier.insertText(
    contentStateWithEntity,
    editorState.getSelection(),
    text,
    null,
    contentStateWithEntity.getLastCreatedEntityKey()
  );

  return EditorState.set(editorState, { currentContent: contentWithLink });
};

export default () => {
  return {
    decorators: [
      {
        strategy: linkStrategy,
        component: Link,
      },
    ],
  };
};

export { createLink, filterConfig, linkFromHTML, linkToHTML };
