import React, { useState, useEffect } from "react";
import ToolbarButton from "../ToolbarButton";
import ModalDialog from "components/modals/ModalDialog";
import Icon from "./icon-link.svg?inline";
import ButtonGroup from "components/buttons/ButtonGroup";
import Button from "components/buttons/Button";
import { Field, Input, Label } from "components/Forms";
import { ENTITY_TYPE as LINK_TYPE } from ".";

import PropTypes from "prop-types";
import styled from "styled-components";
import getFragmentFromSelection from "draft-js/lib/getFragmentFromSelection";

const title = "Insert link";

const TextInput = styled(Input)`
  min-width: 30em;
`;

const StyledButtonGroup = styled(ButtonGroup)`
  margin-top: 2em;
`;

const LinkPicker = ({ isOpen, onClose, onLinkChosen, defaultText }) => {
  const [text, setText] = useState(defaultText || "");
  const [url, setURL] = useState("");

  useEffect(() => {
    setText(defaultText);
    setURL("");
  }, [isOpen, defaultText]);

  const onInsertPushed = () => {
    onClose();
    onLinkChosen(text || url, url);
  };

  return (
    <ModalDialog isOpen={isOpen} onClose={onClose}>
      <h2> {title} </h2>
      <Field>
        <Label htmlFor="text">Text</Label>
        <TextInput
          name="text"
          id="text"
          type="text"
          value={text}
          onChange={({ value }) => setText(value)}
        />
      </Field>
      <Field>
        <Label htmlFor="href">Link</Label>
        <TextInput
          name="href"
          id="href"
          type="text"
          value={url}
          onChange={({ value }) => setURL(value)}
        />
      </Field>
      <StyledButtonGroup horizontal align="right">
        <Button onClick={onClose} variant="secondary">
          Cancel
        </Button>
        <Button onClick={onInsertPushed} disabled={!url.length}>
          Insert
        </Button>
      </StyledButtonGroup>
    </ModalDialog>
  );
};

LinkPicker.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onLinkChosen: PropTypes.func.isRequired,
  defaultText: PropTypes.string,
};

const LinkToolbarButton = ({
  onLinkChosen,
  canFocus,
  editorState,
  disabled,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const selectedFragments = getFragmentFromSelection(editorState);
  const selectedText = selectedFragments
    ? selectedFragments.map((x) => x.getText()).join("\n")
    : "";

  const contentState = editorState.getCurrentContent();
  const selection = editorState.getSelection();
  const startKey = selection.getStartKey();
  const startOffset = selection.getStartOffset();
  const linkKey = contentState
    .getBlockForKey(startKey)
    .getEntityAt(startOffset);
  const linkIsUnderCursor =
    linkKey && contentState.getEntity(linkKey).getType() === LINK_TYPE;

  return (
    <>
      <ToolbarButton
        key={title}
        title={title}
        disabled={linkIsUnderCursor || disabled}
        canFocus={canFocus}
        onClick={() => setModalVisible(true)}
        modalVisible={modalVisible}
      >
        <Icon />
      </ToolbarButton>
      <LinkPicker
        defaultText={selectedText}
        onLinkChosen={onLinkChosen}
        isOpen={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </>
  );
};

LinkToolbarButton.propTypes = {
  onLinkChosen: PropTypes.func.isRequired,
  canFocus: PropTypes.bool.isRequired,
  editorState: PropTypes.shape({
    getCurrentContent: PropTypes.func.isRequired,
    getSelection: PropTypes.func.isRequired,
  }),
  disabled: PropTypes.bool,
};

export default LinkToolbarButton;
