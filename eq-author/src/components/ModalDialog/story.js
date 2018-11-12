import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import ModalDialog from "components/ModalDialog";
import Button from "components/Button";
import styled from "styled-components";
import DialogHeader from "components/Dialog/DialogHeader";
import DialogMessage from "components/Dialog/DialogMessage";
import DialogIcon from "components/Dialog/DialogIcon";
import DialogActionButtons from "components/Dialog/DialogButtons";
import { DialogAlertList, DialogAlert } from "components/Dialog/DialogAlert";
import PropTypes from "prop-types";

import moveIcon from "./icon-dialog-move.svg";
import deleteIcon from "./icon-dialog-delete.svg";

const Background = styled.div`
  padding: 1em;
`;

const LargeContent = styled.div`
  width: 900px;
`;

class StatefulModalDialog extends React.Component {
  static propTypes = {
    children: PropTypes.node
  };

  state = {
    showDialog: true
  };

  handleOpen = () => {
    this.setState({ showDialog: true });
  };

  handleClose = () => {
    this.setState({ showDialog: false });
  };

  render() {
    return (
      <Background>
        <Button primary onClick={this.handleOpen}>
          Trigger modal
        </Button>
        <ModalDialog isOpen={this.state.showDialog} onClose={this.handleClose}>
          {this.props.children}
        </ModalDialog>
      </Background>
    );
  }
}

storiesOf("ModalDialog", module)
  .add("ModalDialog - Default", () => (
    <StatefulModalDialog>
      <DialogHeader>
        <DialogMessage
          heading="Move"
          subheading="Section 2 > Question 3"
          description="Move question 3 to section 1?"
        />
        <DialogIcon icon={moveIcon} />
      </DialogHeader>
      <DialogActionButtons
        primaryAction={action("Primary action")}
        primaryActionText="Primary"
        secondaryAction={action("Secondary action")}
        secondaryActionText="Secondary"
      />
    </StatefulModalDialog>
  ))
  .add("ModalDialog - Move", () => (
    <StatefulModalDialog>
      <DialogHeader>
        <DialogMessage
          heading="Move"
          subheading="Section 2 > Question 3"
          description="Move question 3 to section 1?"
        />
        <DialogIcon icon={moveIcon} />
      </DialogHeader>
      <DialogActionButtons
        primaryAction={action("Primary action")}
        primaryActionText="Move"
        secondaryAction={action("Secondary action")}
        secondaryActionText="Cancel"
      />
    </StatefulModalDialog>
  ))
  .add("ModalDialog - Delete", () => (
    <StatefulModalDialog>
      <DialogHeader>
        <DialogMessage
          heading="Delete"
          subheading="Question 3"
          description="Delete question 3?"
        />
        <DialogIcon icon={deleteIcon} />
      </DialogHeader>
      <DialogAlertList>
        <DialogAlert>
          All edits, properties and routing settings will also be removed.
        </DialogAlert>
      </DialogAlertList>
      <DialogActionButtons
        primaryAction={action("Primary action")}
        primaryActionText="Delete"
        secondaryAction={action("Secondary action")}
        secondaryActionText="Cancel"
      />
    </StatefulModalDialog>
  ))
  .add("ModalDialog - Should grow with content", () => (
    <StatefulModalDialog>
      <DialogHeader>
        <DialogMessage
          heading="Large Dialog Example"
          subheading={undefined}
          description="The modal should change size based on its content."
        />
      </DialogHeader>
      <LargeContent />
      <DialogActionButtons
        primaryAction={action("Primary action")}
        primaryActionText="Save"
        tertiaryAction={action("Tertiary action")}
        tertiaryActionText="Delete"
      />
    </StatefulModalDialog>
  ));
