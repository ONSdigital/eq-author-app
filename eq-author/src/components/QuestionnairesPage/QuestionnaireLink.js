import React from "react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";
import { NavLink } from "react-router-dom";
import { buildQuestionnairePath } from "utils/UrlUtils";
import { colors, radius } from "constants/theme";
import CustomPropTypes from "custom-prop-types";

const StyledLink = styled(NavLink)`
  text-decoration: none;
  color: ${colors.blue};
  padding: 0.5em;
  &:focus {
    border-radius: ${radius};
    outline: none;
    box-shadow: 0 0 0 3px ${colors.tertiary};
  }
  &:hover {
    text-decoration: underline;
  }

  ${props =>
    props.disabled &&
    css`
      text-decoration: none;
      color: ${colors.text};
    `};
`;

const QuestionnaireLink = ({ questionnaire, disabled, ...otherProps }) => {
  return (
    <StyledLink
      {...otherProps}
      disabled={disabled}
      to={buildQuestionnairePath({ questionnaireId: questionnaire.id })}
    />
  );
};

QuestionnaireLink.defaultProps = {
  disabled: false
};

QuestionnaireLink.propTypes = {
  questionnaire: CustomPropTypes.questionnaire,
  disabled: PropTypes.bool
};

export default QuestionnaireLink;
