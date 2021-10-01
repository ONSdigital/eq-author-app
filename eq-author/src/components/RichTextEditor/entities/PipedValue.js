import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { radius } from "constants/theme";
import findEntitiesByType from "components/RichTextEditor/utils/findEntitiesByType";
import getEntities from "components/RichTextEditor/utils/getEntities";
import replaceEntityText from "components/RichTextEditor/utils/replaceEntityText";
import { Modifier } from "draft-js";
import { bindKey } from "lodash";

export const ENTITY_TYPE = "PIPEDDATA";

export const filterConfig = {
  type: ENTITY_TYPE,
  attributes: ["id", "type", "pipingType"],
};

const PipedValueDecorator = styled.span`
  background-color: #e0e0e0;
  padding: 0 0.125em;
  border-radius: ${radius};
  white-space: pre;
`;

const PipedValueSerialized = ({ data: { id, text, pipingType, type } }) => (
  <span data-piped={pipingType} data-id={id} data-type={type}>
    {text}
  </span>
);

PipedValueSerialized.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
  }).isRequired,
};

export const findPipedEntities = (contentState) =>
  getEntities(contentState, ENTITY_TYPE);

export const createPipedEntity = (create, entity) => {
  return create(ENTITY_TYPE, "IMMUTABLE", entity);
};

export const htmlToEntity = {
  span: (nodeName, node, createEntity) => {
    if (node.hasAttribute && node.hasAttribute("data-piped")) {
      const id = node.getAttribute("data-id");
      const pipingType = node.getAttribute("data-piped");
      const type = node.getAttribute("data-type");
      return createPipedEntity(createEntity, { id, pipingType, type });
    }
  },
};

export const entityToHTML = {
  [ENTITY_TYPE]: PipedValueSerialized,
};

export const replacePipedValues =
  (labels, placeholder) =>
  (contentState, { entityKey, blockKey, entity }) => {
    const text = labels.hasOwnProperty(entity.data.id)
      ? labels[entity.data.id]
      : placeholder;

    return text
      ? replaceEntityText(contentState, entityKey, blockKey, `[${text}]`)
      : contentState;
  };

export const insertPipedValue = (entity, contentState, selection) => {
  const newContent = createPipedEntity(
    bindKey(contentState, "createEntity"),
    entity
  );

  const entityKey = newContent.getLastCreatedEntityKey();
  const text = entity.displayName;

  return Modifier.insertText(
    newContent,
    selection,
    `[${text}]`,
    null,
    entityKey
  );
};

export default {
  strategy: findEntitiesByType(ENTITY_TYPE),
  component: PipedValueDecorator,
};
