import React from "react";
import { flowRight } from "lodash";
import styled from "styled-components";
import gql from "graphql-tag";
import PropTypes from "prop-types";
import { propType } from "graphql-anywhere";

import DeleteButton from "components/buttons/DeleteButton";
import MoveButton, { IconUp, IconDown } from "components/buttons/MoveButton";
import RichTextEditor from "components/RichTextEditor";
import { colors } from "constants/theme";
import { Field, Label } from "components/Forms";
import WrappingInput from "components/Forms/WrappingInput";

import withChangeUpdate from "enhancers/withChangeUpdate";
import withPropRenamed from "enhancers/withPropRenamed";
import withEntityEditor from "components/withEntityEditor";

import withUpdateCollapsible from "./withUpdateCollapsible";
import withDeleteCollapsible from "./withDeleteCollapsible";

const Detail = styled.div`
  border: 1px solid ${colors.bordersLight};
  padding: 2em 1em 0;
  border-radius: 4px;
  margin-bottom: 1em;
  background: white;
  position: relative;
`;

const DetailHeader = styled.div`
  position: absolute;
  top: 0.5em;
  right: 0.5em;
  display: flex;
  justify-content: space-around;
  z-index: 2;
  width: 7em;
`;

const DetailDeleteButton = styled(DeleteButton)`
  position: relative;
`;

export const CollapsibleEditor = ({
  collapsible,
  onChangeUpdate,
  onChange,
  onUpdate,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
  isMoving,
  deleteCollapsible,
}) => {
  const { id, title, description } = collapsible;
  return (
    <Detail id={collapsible.id} data-test="collapsible-editor">
      <DetailHeader>
        <MoveButton
          disabled={!canMoveUp || isMoving}
          onClick={onMoveUp}
          data-test="move-up-btn"
        >
          <IconUp />
        </MoveButton>
        <MoveButton
          disabled={!canMoveDown || isMoving}
          onClick={onMoveDown}
          data-test="move-down-btn"
        >
          <IconDown />
        </MoveButton>
        <DetailDeleteButton
          disabled={isMoving}
          onClick={() => deleteCollapsible(collapsible)}
          data-test="delete-collapsible-btn"
        />
      </DetailHeader>
      <Field>
        <Label htmlFor={`details-title-${id}`}>Title</Label>
        <WrappingInput
          id={`details-title-${id}`}
          name="title"
          onChange={onChange}
          onBlur={onUpdate}
          value={title}
          bold
          data-test="txt-collapsible-title"
        />
      </Field>

      <RichTextEditor
        id={`details-description-${id}`}
        name="description"
        label="Description"
        value={description}
        onUpdate={onChangeUpdate}
        multiline
        controls={{
          piping: true,
          list: true,
          bold: true,
          link: true,
        }}
        testSelector="txt-collapsible-description"
      />
    </Detail>
  );
};

const fragment = gql`
  fragment CollapsibleEditor on Collapsible {
    id
    title
    description
  }
`;

CollapsibleEditor.fragments = [fragment];

CollapsibleEditor.propTypes = {
  collapsible: propType(fragment).isRequired,
  onChange: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onChangeUpdate: PropTypes.func.isRequired,
  onMoveUp: PropTypes.func.isRequired,
  onMoveDown: PropTypes.func.isRequired,
  canMoveUp: PropTypes.bool.isRequired,
  canMoveDown: PropTypes.bool.isRequired,
  isMoving: PropTypes.bool.isRequired,
  deleteCollapsible: PropTypes.func.isRequired,
};

export default flowRight(
  withUpdateCollapsible,
  withDeleteCollapsible,
  withPropRenamed("updateCollapsible", "onUpdate"),
  withEntityEditor("collapsible"),
  withChangeUpdate
)(CollapsibleEditor);
