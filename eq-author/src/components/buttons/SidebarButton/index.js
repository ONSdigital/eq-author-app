import React from "react";
import styled, { css } from "styled-components";
import PropTypes from "prop-types";

import { colors, radius } from "constants/theme";
import chevron from "./icon-chevron.svg";
import ValidationError from "components/ValidationError";

import {
  EARLIEST_BEFORE_LATEST_DATE,
  MAX_GREATER_THAN_MIN,
  DURATION_ERROR_MESSAGE,
  ERR_OFFSET_NO_VALUE,
  ERR_NO_VALUE,
  ERR_REFERENCE_MOVED,
  ERR_REFERENCE_DELETED,
} from "constants/validationMessages";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  div {
    margin-top: 0.5em;
    width: 15em;
  }
`;

const SidebarButton = styled.button.attrs({ role: "button" })`
  display: block;
  width: 100%;
  padding: 0.5em;
  color: ${colors.text};
  border-radius: ${radius};
  border: 1px solid ${colors.borders};
  text-align: left;
  font-size: 1em;
  transition: all 100ms ease-out;
  position: relative;
  cursor: pointer;
  background: ${colors.white};

  &:hover {
    border: 1px solid ${colors.borders};
    background: ${colors.lighterGrey};
  }

  &:focus {
    box-shadow: 0 0 0 3px ${colors.tertiary};
    outline: none;
  }

  &::after {
    content: "";
    display: block;
    width: 1em;
    height: 1em;
    background: url(${chevron}) no-repeat center;
    position: absolute;
    right: 0.5em;
    top: 0;
    bottom: 0;
    margin: auto;
  }

  &:disabled {
    background: ${colors.lighterGrey};
  }

  ${(props) =>
    props.hasError
      ? css`
          border-color: ${colors.errorPrimary};
          &:focus,
          &:focus-within {
            border-color: ${colors.errorPrimary};
            outline-color: ${colors.errorPrimary};
            box-shadow: 0 0 0 2px ${colors.errorPrimary};
          }
          &:hover {
            border-color: ${colors.errorPrimary};
            outline-color: ${colors.errorPrimary};
          }
        `
      : ""}
`;

export const Title = styled.span`
  display: block;
  color: ${colors.darkGrey};
  font-size: 0.9em;

  &:not(:only-child) {
    margin-bottom: 0.25rem;
  }
`;

export const Detail = styled.span`
  display: block;
  color: ${colors.black};
`;

const errorCodes = {
  ERR_EARLIEST_AFTER_LATEST: EARLIEST_BEFORE_LATEST_DATE,
  ERR_MIN_LARGER_THAN_MAX: MAX_GREATER_THAN_MIN,
  ERR_MAX_DURATION_TOO_SMALL: DURATION_ERROR_MESSAGE,
  ERR_NO_VALUE: ERR_NO_VALUE,
  ERR_OFFSET_NO_VALUE,
  ERR_REFERENCE_MOVED,
  ERR_REFERENCE_DELETED,
};

const WrappedSidebarButton = ({ errors = [], ...rest }) => (
  <Container>
    <SidebarButton hasError={errors.length} {...rest} />
    {errors.length > 0 && (
      <ValidationError key={errors[0].id}>
        {errorCodes[errors[0].errorCode]}
      </ValidationError>
    )}
  </Container>
);

export default WrappedSidebarButton;

WrappedSidebarButton.propTypes = {
  errors: PropTypes.array, //eslint-disable-line
};
