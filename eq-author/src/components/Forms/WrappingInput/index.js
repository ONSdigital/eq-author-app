import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import AutoResizeTextArea from "react-textarea-autosize";
import withChangeHandler from "components/Forms/withChangeHandler";
import { invoke } from "lodash";
import { sharedStyles } from "components/Forms/css";

const ENTER_KEY = 13;

const StyleContext = styled.div`
  font-weight: ${props => (props.bold ? "bold" : "regular")};
`;

/* eslint-disable no-unused-vars  */
const TextArea = ({ invalid, onUpdate, staticContext, ...otherProps }) => (
  <AutoResizeTextArea {...otherProps} />
);
/* eslint-enable no-unused-vars  */

const StyledTextArea = styled(TextArea)`
  ${sharedStyles};
  font-weight: inherit;
  resize: none;
  overflow: hidden; /* prevent scrollbars on Windows */
`;

class WrappingInput extends React.Component {
  static propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onKeyDown: PropTypes.func,
    id: PropTypes.string.isRequired,
    bold: PropTypes.bool,
    placeholder: PropTypes.string
  };

  static defaultProps = {
    bold: false
  };

  handleChange = e => {
    e.target.value = e.target.value.replace(/\n/g, " ");
    this.props.onChange(e);
  };

  handleKeyDown = e => {
    if (e.keyCode === ENTER_KEY) {
      e.preventDefault();
    }

    invoke(this.props, "onKeyDown", e);
  };

  render() {
    const { bold, placeholder, ...otherProps } = this.props;

    return (
      <StyleContext
        bold={bold}
        onChange={this.handleChange}
        onKeyDown={this.handleKeyDown}
      >
        <StyledTextArea {...otherProps} placeholder={placeholder} />
      </StyleContext>
    );
  }
}

export default withChangeHandler(WrappingInput);
