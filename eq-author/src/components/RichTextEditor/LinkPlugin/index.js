import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { EditorState, Modifier } from "draft-js";
import Tooltip from "components/Forms/Tooltip";
import { colors } from "constants/theme";

const ENTITY_TYPE = "LINK";
const MUTABILITY = "IMMUTABLE";

const filterConfig = {
  type: ENTITY_TYPE,
};

const linkFromHTML = {
  a: (nodeName, node, createEntity) =>
    createEntity(ENTITY_TYPE, MUTABILITY, { url: node.href }),
};

const linkToHTML = {
  [ENTITY_TYPE]: (entity, originalText) => (
    <a href={entity.data.url} target="_blank" rel="noopener noreferrer">
      {originalText}
    </a>
  ),
};

const Link = styled.a`
  background: ${colors.paleBlue};
`;

const DecoratedLink = ({ entityKey, contentState, children }) => {
  const { url } = contentState.getEntity(entityKey).getData();

  return (
    <Tooltip content={url} place="bottom">
      <Link href={url}>{children}</Link>
    </Tooltip>
  );
};

DecoratedLink.propTypes = {
  entityKey: PropTypes.string.isRequired,
  contentState: PropTypes.shape({
    getEntity: PropTypes.func.isRequired,
  }),
  children: PropTypes.node.isRequired,
};

const linkStrategy = (contentBlock, callback, contentState) => {
  contentBlock.findEntityRanges((character) => {
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
    MUTABILITY,
    { url }
  );

  const contentWithLink = Modifier.replaceText(
    contentStateWithEntity,
    editorState.getSelection(),
    text,
    null,
    contentStateWithEntity.getLastCreatedEntityKey()
  );

  const editorStateWithLink = EditorState.push(
    editorState,
    contentWithLink,
    "insert-characters"
  );

  return EditorState.forceSelection(
    editorStateWithLink,
    contentWithLink.getSelectionAfter()
  );
};

export default () => {
  return {
    decorators: [
      {
        strategy: linkStrategy,
        component: DecoratedLink,
      },
    ],
  };
};

export { createLink, filterConfig, linkFromHTML, linkToHTML, ENTITY_TYPE };
