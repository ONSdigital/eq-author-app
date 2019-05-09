import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import CustomPropTypes from "custom-prop-types";

import IconButtonDelete from "components/buttons/IconButtonDelete";
import DuplicateButton from "components/buttons/DuplicateButton";
import Truncated from "components/Truncated";

import { colors } from "constants/theme";

import QuestionnaireLink from "App/QuestionnairesPage/QuestionnaireLink";
import FormattedDate from "App/QuestionnairesPage/FormattedDate";
import FadeTransition from "components/transitions/FadeTransition";

const TruncatedQuestionnaireLink = Truncated.withComponent(QuestionnaireLink);
TruncatedQuestionnaireLink.displayName = "TruncatedQuestionnaireLink";

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-evenly;
`;

const TR = styled.tr`
  border-bottom: 1px solid #e2e2e2;
  border-top: 1px solid #e2e2e2;
  opacity: 1;
  color: ${props => (props.disabled ? `${colors.textLight}` : "inherit")};
`;

const TD = styled.td`
  line-height: 1.3;
  padding: 0.5em 1em;
  text-align: ${props => props.textAlign};
`;

TD.propTypes = {
  textAlign: PropTypes.oneOf(["left", "center", "right"]),
};

TD.defaultProps = {
  textAlign: "left",
};

class Row extends React.Component {
  static propTypes = {
    questionnaire: CustomPropTypes.questionnaire.isRequired,
    onDeleteQuestionnaire: PropTypes.func.isRequired,
    onDuplicateQuestionnaire: PropTypes.func.isRequired,
    in: PropTypes.bool,
    exit: PropTypes.bool,
    enter: PropTypes.bool,
    autoFocus: PropTypes.bool,
  };

  rowRef = React.createRef();

  handleOpenDeleteQuestionnaireDialog = () => {
    this.props.onDeleteQuestionnaire(this.props.questionnaire);
  };

  handleDuplicateQuestionnaire = () => {
    this.props.onDuplicateQuestionnaire(this.props.questionnaire);
  };

  shouldComponentUpdate(nextProps) {
    for (let key of Object.keys(Row.propTypes)) {
      if (this.props[key] !== nextProps[key]) {
        return true;
      }
    }
    return false;
  }

  focusLink() {
    this.rowRef.current.getElementsByTagName("a")[0].focus();
  }

  componentDidMount() {
    if (this.props.autoFocus) {
      this.focusLink();
    }
  }

  componentDidUpdate() {
    if (this.props.autoFocus) {
      this.focusLink();
    }
  }

  render() {
    const { questionnaire, ...rest } = this.props;
    return (
      <FadeTransition {...rest} exit>
        <TR innerRef={this.rowRef}>
          <TD>
            <TruncatedQuestionnaireLink
              data-test="anchor-questionnaire-title"
              questionnaire={questionnaire}
              title={questionnaire.displayName}
            >
              {questionnaire.displayName}
            </TruncatedQuestionnaireLink>
          </TD>
          <TD>
            <FormattedDate date={questionnaire.createdAt} />
          </TD>
          <TD>
            <Truncated>{questionnaire.createdBy.name || "Unknown"}</Truncated>
          </TD>
          <TD textAlign="center">
            <ButtonGroup>
              <DuplicateButton
                data-test="btn-duplicate-questionnaire"
                onClick={this.handleDuplicateQuestionnaire}
              />
              <IconButtonDelete
                hideText
                data-test="btn-delete-questionnaire"
                onClick={this.handleOpenDeleteQuestionnaireDialog}
              />
            </ButtonGroup>
          </TD>
        </TR>
      </FadeTransition>
    );
  }
}

export default Row;
