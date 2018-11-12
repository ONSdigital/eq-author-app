import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import CustomPropTypes from "custom-prop-types";
import PropTypes from "prop-types";
import styled from "styled-components";
import fp from "lodash/fp";

import filterQuestionnaire from "components/ContentPickerModal/filterQuestionnaire";
import ContentPickerModal from "components/ContentPickerModal";
import GetContentPickerQuery from "components/ContentPickerModal/GetContentPickerQuery";
import Button from "components/Button";
import Truncated from "components/Truncated";
import { ANSWER, METADATA } from "components/ContentPickerSelect/content-types";

import { colors } from "constants/theme";

import * as ANSWER_TYPES from "constants/answer-types";
import * as METADATA_TYPES from "constants/metadata-types";

export const ContentSelectButton = styled(Button).attrs({
  variant: "tertiary"
})`
  font-size: 0.9em;
  padding: 0.5em 0.75em;
  border: 1px solid ${colors.borders};
  height: 2.5em;
  width: 100%;
  justify-content: space-between;
  &:hover {
    border-color: ${colors.blue};
    outline-color: ${colors.blue};
    background: none;
    color: ${colors.blue};
  }
  margin-bottom: 1px;
`;

const ContentSelected = styled(Truncated)`
  color: ${colors.text};
  max-width: 18em;
  padding-right: 1em;
  text-align: left;
`;

const ContentSelectAction = styled.div`
  text-transform: uppercase;
`;

const filterMetadata = types =>
  fp.flow(
    fp.getOr([], "metadata"),
    fp.filter(({ type }) => fp.includes(type)(types))
  );

export class UnwrappedContentPickerSelect extends Component {
  state = {
    isPickerOpen: false,
    selectedContentDisplayName: this.props.selectedContentDisplayName
  };

  handlePickerOpen = () => {
    this.setState({
      isPickerOpen: true
    });
  };

  handlePickerClose = () => {
    this.setState({
      isPickerOpen: false
    });
  };

  handlePickerSubmit = selected => {
    this.handlePickerClose();
    this.setState({
      selectedContentDisplayName: selected.displayName
    });
    this.props.onSubmit({ name: this.props.name, value: selected });
  };

  render() {
    const { isPickerOpen, selectedContentDisplayName } = this.state;
    const {
      match: {
        params: { sectionId, pageId }
      },
      loading,
      error,
      data: { questionnaire },
      answerTypes,
      contentTypes,
      metadataTypes
    } = this.props;

    const isDisabled = loading || error;

    const dataProps = {};

    if (contentTypes.includes(ANSWER)) {
      dataProps.answerData = filterQuestionnaire({
        answerTypes,
        questionnaire,
        sectionId,
        pageId
      });
    }

    if (contentTypes.includes(METADATA)) {
      dataProps.metadataData = filterMetadata(metadataTypes)(questionnaire);
    }

    return (
      <React.Fragment>
        <ContentSelectButton
          data-test="content-picker-select"
          onClick={this.handlePickerOpen}
          disabled={isDisabled}
        >
          <ContentSelected>{selectedContentDisplayName}</ContentSelected>
          <ContentSelectAction>Select</ContentSelectAction>
        </ContentSelectButton>
        <ContentPickerModal
          isOpen={isPickerOpen}
          onClose={this.handlePickerClose}
          onSubmit={this.handlePickerSubmit}
          data-test="picker"
          {...dataProps}
        />
      </React.Fragment>
    );
  }
}

UnwrappedContentPickerSelect.propTypes = {
  match: CustomPropTypes.match,
  loading: PropTypes.bool,
  error: PropTypes.bool,
  data: PropTypes.shape({
    questionnaire: CustomPropTypes.questionnaire
  }),
  onSubmit: PropTypes.func.isRequired,
  selectedContentDisplayName: PropTypes.string,
  name: PropTypes.string.isRequired,
  answerTypes: PropTypes.arrayOf(PropTypes.string),
  contentTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
  metadataTypes: PropTypes.arrayOf(PropTypes.string)
};

UnwrappedContentPickerSelect.defaultProps = {
  selectedContentDisplayName: "Please select...",
  answerTypes: Object.values(ANSWER_TYPES),
  metadataTypes: Object.values(METADATA_TYPES)
};

const ContentPickerSelect = props => (
  <GetContentPickerQuery questionnaireId={props.match.params.questionnaireId}>
    {innerProps => <UnwrappedContentPickerSelect {...innerProps} {...props} />}
  </GetContentPickerQuery>
);

export default withRouter(ContentPickerSelect);
