import React from "react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";
import { withRouter, NavLink } from "react-router-dom";

import CustomPropTypes from "custom-prop-types";

import IconButtonDelete from "components/buttons/IconButtonDelete";
import DuplicateButton from "components/buttons/DuplicateButton";
import Truncated from "components/Truncated";

import { colors } from "constants/theme";

import FormattedDate from "App/QuestionnairesPage/FormattedDate";
import FadeTransition from "components/transitions/FadeTransition";

import { rgba } from "polished";
import { buildQuestionnairePath } from "utils/UrlUtils";

export const QuestionnaireLink = styled(NavLink)`
  text-decoration: none;
  color: ${colors.blue};
  padding: 0 0.5em;
  display: flex;
  flex-direction: column;
  margin-left: -0.5em;

  &:focus {
    outline: none;
  }
`;

export const ShortTitle = styled.span`
  color: ${colors.textLight};
  text-decoration-color: ${colors.textLight};
  font-size: 0.8em;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const ButtonGroup = styled.div`
  display: flex;
`;

export const TR = styled.tr`
  border-top: 1px solid #e2e2e2;
  border-bottom: 1px solid #e2e2e2;
  background-color: rgba(0, 0, 0, 0);
  :nth-of-type(2n-1) {
    background-color: rgba(0, 0, 0, 0.02);
  }
  opacity: 1;
  height: 3.2em;
  position: relative;

  ${props =>
    props.linkHasFocus &&
    css`
      box-shadow: 0 0 0 3px ${colors.tertiary};
      border-color: ${colors.tertiary};
    `}

  &:hover {
    background-color: ${rgba(colors.primary, 0.1)};
    cursor: pointer;
  }
`;

const TD = styled.td`
  line-height: 1.3;
  padding: 0 1em;
  font-size: 0.9em;
`;

export const DuplicateQuestionnaireButton = styled(DuplicateButton)`
  margin-right: 0.5em;
`;

export class Row extends React.Component {
  static propTypes = {
    questionnaire: CustomPropTypes.questionnaire.isRequired,
    history: CustomPropTypes.history.isRequired,
    onDeleteQuestionnaire: PropTypes.func.isRequired,
    onDuplicateQuestionnaire: PropTypes.func.isRequired,
    exit: PropTypes.bool,
    enter: PropTypes.bool,
    autoFocus: PropTypes.bool,
  };

  state = {
    linkHasFocus: false,
    disabled: true,
  };

  rowRef = React.createRef();

  focusLink() {
    this.rowRef.current.getElementsByTagName("a")[0].focus();
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.autoFocus && this.props.autoFocus) {
      this.focusLink();
    }
  }

  handleClick = () => {
    this.props.history.push(
      buildQuestionnairePath({
        questionnaireId: this.props.questionnaire.id,
      })
    );
  };

  handleFocus = () => {
    this.setState({
      linkHasFocus: true,
    });
  };

  handleBlur = () => {
    this.setState({
      linkHasFocus: false,
    });
  };

  handleButtonFocus = e => {
    this.setState({
      linkHasFocus: false,
    });
    e.stopPropagation();
  };

  handleLinkClick = e => {
    e.stopPropagation();
  };

  handleDuplicateQuestionnaire = e => {
    e.stopPropagation();
    this.props.onDuplicateQuestionnaire(this.props.questionnaire);
  };

  handleDeleteQuestionnaire = e => {
    e.stopPropagation();
    this.props.onDeleteQuestionnaire(this.props.questionnaire);
  };

  render() {
    const { questionnaire, ...rest } = this.props;

    return (
      <FadeTransition {...rest} exit>
        <TR
          innerRef={this.rowRef}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          linkHasFocus={this.state.linkHasFocus}
          onClick={this.handleClick}
        >
          <TD>
            <QuestionnaireLink
              data-test="anchor-questionnaire-title"
              title={questionnaire.displayName}
              onClick={this.handleLinkClick}
              to={buildQuestionnairePath({
                questionnaireId: questionnaire.id,
              })}
            >
              {questionnaire.shortTitle && (
                <ShortTitle>
                  <Truncated>{questionnaire.shortTitle}</Truncated>
                </ShortTitle>
              )}
              <Truncated>{questionnaire.title}</Truncated>
            </QuestionnaireLink>
          </TD>
          <TD>
            <FormattedDate date={questionnaire.createdAt} />
          </TD>
          <TD>{questionnaire.createdBy.name}</TD>
          <TD>
            <div onFocus={this.handleButtonFocus} data-test="action-btn-group">
              <ButtonGroup>
                <DuplicateQuestionnaireButton
                  data-test="btn-duplicate-questionnaire"
                  onClick={this.handleDuplicateQuestionnaire}
                />
                <IconButtonDelete
                  hideText
                  data-test="btn-delete-questionnaire"
                  onClick={this.handleDeleteQuestionnaire}
                />
              </ButtonGroup>
            </div>
          </TD>
        </TR>
      </FadeTransition>
    );
  }
}

export default withRouter(Row);
