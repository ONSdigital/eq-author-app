import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { sharedStyles } from "components/Forms/css";
import withChangeHandler from "components/Forms/withChangeHandler";

const StyledTextArea = styled.textarea`
  ${sharedStyles};
  resize: none;
`;

const TextArea = ({ defaultValue, id, rows, ...otherProps }) => (
  <StyledTextArea
    defaultValue={defaultValue}
    rows={rows}
    id={id}
    name={id}
    {...otherProps}
  />
);

TextArea.propTypes = {
  defaultValue: PropTypes.string,
  id: PropTypes.string.isRequired,
  rows: PropTypes.number
};

TextArea.defaultProps = {
  rows: 10
};

export default withChangeHandler(TextArea);
