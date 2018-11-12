import GetContentPickerQuery from "components/ContentPickerModal/GetContentPickerQuery";
import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import styled from "styled-components";

import filterQuestionnaire from "components/ContentPickerModal/filterQuestionnaire";
import ContentPickerModal from "components/ContentPickerModal";

import {
  TEXTAREA,
  TEXTFIELD,
  NUMBER,
  CURRENCY,
  DATE_RANGE
} from "constants/answer-types";
import CustomPropTypes from "custom-prop-types";

import IconPiping from "./icon-link.svg?inline";
import ToolbarButton from "./ToolbarButton";

const PipingIconButton = props => (
  <ToolbarButton {...props}>
    <IconPiping />
  </ToolbarButton>
);

export const MenuButton = styled(PipingIconButton)`
  height: 100%;
  &:disabled {
    cursor: default;
    opacity: 0.2;
  }
`;

export class Menu extends React.Component {
  static propTypes = {
    onItemChosen: PropTypes.func.isRequired,
    match: CustomPropTypes.match,
    disabled: PropTypes.bool,
    loading: PropTypes.bool,
    data: PropTypes.shape({
      questionnaire: CustomPropTypes.questionnaire
    })
  };

  state = {
    isPickerOpen: false
  };

  handleButtonClick = () => {
    this.setState(state => ({
      isPickerOpen: !state.isPickerOpen
    }));
  };

  handlePickerClose = () => {
    this.setState({
      isPickerOpen: false
    });
  };

  handlePickerSubmit = (...args) => {
    this.handlePickerClose();
    this.props.onItemChosen(...args);
  };

  render() {
    const {
      disabled,
      loading,
      data,
      match: {
        params: { sectionId, pageId }
      }
    } = this.props;
    const buttonProps = {
      title: "Pipe value"
    };

    if (loading || disabled || !data.questionnaire) {
      return <MenuButton {...buttonProps} disabled />;
    }

    const { questionnaire } = data;

    const answerTypes = [TEXTAREA, TEXTFIELD, NUMBER, CURRENCY, DATE_RANGE];

    const filteredSections = filterQuestionnaire({
      answerTypes,
      questionnaire,
      sectionId,
      pageId
    });

    const isDisabled =
      filteredSections.length === 0 && questionnaire.metadata.length === 0;

    return (
      <React.Fragment>
        <MenuButton
          {...buttonProps}
          disabled={isDisabled}
          onClick={this.handleButtonClick}
          data-test="piping-button"
        />
        <ContentPickerModal
          isOpen={this.state.isPickerOpen}
          answerData={filteredSections}
          metadataData={questionnaire.metadata}
          onClose={this.handlePickerClose}
          onSubmit={this.handlePickerSubmit}
          data-test="picker"
        />
      </React.Fragment>
    );
  }
}

const PipingMenu = props => (
  <GetContentPickerQuery questionnaireId={props.match.params.questionnaireId}>
    {innerProps => <Menu {...innerProps} {...props} />}
  </GetContentPickerQuery>
);

PipingMenu.propTypes = {
  match: CustomPropTypes.match,
  disabled: PropTypes.bool
};

export default withRouter(PipingMenu);
