import React, { useState } from "react";
import ToolbarButton from "../ToolbarButton";
import ModalDialog from "components/modals/ModalDialog";
import Icon from "./icon-link.svg?inline";
import ButtonGroup from "components/buttons/ButtonGroup";
import Button from "components/buttons/Button";
import { Field, Input, Label } from "components/Forms";

import styled from "styled-components";

const title = "Insert link";

const TextInput = styled(Input)`
  min-width: 30em;
`;

const StyledButtonGroup = styled(ButtonGroup)`
  margin-top: 2em;
`;

const LinkPicker = ({ isOpen, onClose, onLinkChosen, defaultUrl }) => {
  const [text, setText] = useState("");
  const [url, setURL] = useState(defaultUrl);

  const onInsertPushed = () => {
    onClose();
    onLinkChosen(text, url);
  };

  return (
    <ModalDialog isOpen={isOpen} onClose={onClose}>
      <h2> Insert link </h2>
      <Field>
        <Label>Text</Label>
        <TextInput
          name="text"
          type="text"
          onChange={({ value }) => setText(value)}
        />
      </Field>
      <Field>
        <Label>Link</Label>
        <TextInput
          name="href"
          defaultValue={defaultUrl}
          type="text"
          onChange={({ value }) => setURL(value)}
        />
      </Field>
      <StyledButtonGroup horizontal align="right">
        <Button onClick={onClose}> Cancel </Button>
        <Button onClick={onInsertPushed} disabled={!text.length || !url.length}>
          {" "}
          Insert{" "}
        </Button>
      </StyledButtonGroup>
    </ModalDialog>
  );
};

const LinkToolbarButton = ({ onLinkChosen, canFocus }) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <ToolbarButton
        key={title}
        title={title}
        disabled={false}
        canFocus={canFocus}
        onClick={() => setModalVisible(true)}
      >
        <Icon />
      </ToolbarButton>
      <LinkPicker
        defaultUrl="http://www.example.com"
        onLinkChosen={onLinkChosen}
        isOpen={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </>
  );
};

export default LinkToolbarButton;
