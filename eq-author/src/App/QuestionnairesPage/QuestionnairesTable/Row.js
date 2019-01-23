import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import CustomPropTypes from "custom-prop-types";
import { partial } from "lodash";

import IconButtonDelete from "components/buttons/IconButtonDelete";
import DuplicateButton from "components/buttons/DuplicateButton";
import Truncated from "components/Truncated";

import { colors } from "constants/theme";

import QuestionnaireLink from "App/QuestionnairesPage/QuestionnaireLink";
import FormattedDate from "App/QuestionnairesPage/FormattedDate";
import FadeTransition from "components/transitions/FadeTransition";

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-evenly;
`;

const Shortcode = styled.span`
  color: ${colors.textLight};
  font-size: 0.8em;
  font-weight: bold;
  letter-spacing: 0.05em;
`;

const TR = styled.tr`
  border-top: 1px solid #e2e2e2;
  background-color: ${props => (props.odd ? "#fff" : "#FAFAFA")};
  opacity: 1;
  color: ${props => (props.disabled ? `${colors.textLight}` : "inherit")};
`;

const TD = styled.td`
  line-height: 1.3;
  padding: 0.25em 1em;
  text-align: ${props => props.textAlign};
`;

TD.propTypes = {
  textAlign: PropTypes.oneOf(["left", "center", "right"]),
};

TD.defaultProps = {
  textAlign: "left",
};

class Row extends React.PureComponent {
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

  handleDuplicateQuestionnaire = () => {
    this.props.onDuplicateQuestionnaire(this.props.questionnaire);
  };

  isQuestionnaireADuplicate() {
    return this.props.questionnaire.id.startsWith("dupe");
  }

  focusLink() {
    this.rowRef.current.getElementsByTagName("a")[0].focus();
  }

  componentDidMount() {
    if (this.props.dupe || this.props.autoFocus) {
      this.focusLink();
    }
  }

  componentDidUpdate() {
    if (this.props.autoFocus) {
      this.focusLink();
    }
  }

  render() {
    const {
      questionnaire,
      onDeleteQuestionnaire,
      dupe,
      odd,
      ...rest
    } = this.props;

    return (
      <TR innerRef={this.rowRef} disabled={dupe} odd={odd}>
        <TD>
          <QuestionnaireLink
            data-test="anchor-questionnaire-title"
            questionnaire={questionnaire}
            title={questionnaire.title}
            disabled={dupe}
            css={{ marginLeft: "-0.5em" }}
          >
            <Truncated>{questionnaire.title}</Truncated>
          </QuestionnaireLink>
        </TD>
        <TD>
          <FormattedDate date={questionnaire.createdAt} />
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
              disabled={dupe}
            />
            <IconButtonDelete
              hideText
              data-test="btn-delete-questionnaire"
              onClick={partial(onDeleteQuestionnaire, questionnaire.id)}
              disabled={dupe}
            />
          </ButtonGroup>
        </TD>
      </TR>
    );
  }
}

export default Row;
