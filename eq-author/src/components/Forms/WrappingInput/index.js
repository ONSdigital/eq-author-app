import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { radius } from "constants/theme";
import AutoResizeTextArea from "react-textarea-autosize";
import withChangeHandler from "components/Forms/withChangeHandler";
import { invoke } from "lodash";
import { sharedStyles } from "components/Forms/css";
import ValidationError from "components/ValidationError";

import PasteModal from "components/modals/PasteModal";
import { reduceMultipleSpaces } from "utils/reduceMultipleSpaces";

const ENTER_KEY = 13;

const StyleContext = styled.div`
  font-weight: ${(props) => (props.bold ? "bold" : "regular")};
`;

const TextArea = styled(AutoResizeTextArea)`
  ${sharedStyles};
  font-weight: inherit;
  border-radius: ${radius};
  resize: none;
  overflow: hidden; /* prevent scrollbars on Windows */
`;

class WrappingInput extends React.Component {
  static propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func.isRequired,
    onPaste: PropTypes.func,
    onKeyDown: PropTypes.func,
    id: PropTypes.string.isRequired,
    bold: PropTypes.bool,
    placeholder: PropTypes.string,
    errorValidationMsg: PropTypes.string,
  };

  static defaultProps = {
    bold: false,
  };

  state = { showPasteModal: false, text: "", event: {} };

  handleChange = (e) => {
    e.target.value = e.target.value.replace(/\n/g, " ");
    e.target.value = e.target.value.replace(/\s+/g, " ");
    this.props.onChange(e);
  };

  handlePaste = (e) => {
    const text = e.clipboardData.getData("text");
    e.persist();
    if (/\s{2,}/g.test(text)) {
      e.preventDefault();
      this.setState({
        showPasteModal: true,
        text: text,
        event: e,
      });
    }
  };

  handleOnPasteConfirm = () => {
    const { text, event } = this.state;
    if (event && event.persist) {
      const target = event.target;
      const currentValue = target.value;
      const selectionStart = target.selectionStart;
      const selectionEnd = target.selectionEnd;

      // Concatenate the text before and after the selection with the pasted text
      const newValue =
        currentValue.substring(0, selectionStart) +
        reduceMultipleSpaces(text) +
        currentValue.substring(selectionEnd);

      // Create a new event with the updated value
      const updatedEvent = {
        ...event,
        target: { ...target, value: newValue.trim().replace(/\s+/g, " ") },
      };

      // Call the onChange prop with the updated event
      this.props.onChange(updatedEvent);
    }

    // Clear the showPasteModal state
    this.setState({ showPasteModal: false, text: "" });
  };

  handleOnPasteCancel = () => {
    this.setState({ showPasteModal: false, text: "" });
  };

  handleKeyDown = (e) => {
    if (e.keyCode === ENTER_KEY) {
      e.preventDefault();
    }

    invoke(this.props, "onKeyDown", e);
  };

  render() {
    const { bold, placeholder, errorValidationMsg, ...otherProps } = this.props;
    const { state } = this;
    return (
      <>
        <PasteModal
          isOpen={state.showPasteModal}
          onConfirm={this.handleOnPasteConfirm}
          onCancel={this.handleOnPasteCancel}
        />
        <StyleContext
          bold={bold}
          onChange={this.handleChange}
          onKeyDown={this.handleKeyDown}
          onPaste={this.handlePaste}
        >
          <TextArea
            {...otherProps}
            placeholder={placeholder}
            invalid={errorValidationMsg}
            aria-invalid={Boolean(errorValidationMsg).toString()}
          />
          {errorValidationMsg && (
            <ValidationError>{errorValidationMsg}</ValidationError>
          )}
        </StyleContext>
      </>
    );
  }
}

export default withChangeHandler(WrappingInput);
