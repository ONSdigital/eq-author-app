import React, { Component } from "react";
import CustomPropTypes from "custom-prop-types";
import PropTypes from "prop-types";
import styled from "styled-components";

import ContentPickerModal from "components/ContentPickerModal";
import Button from "components/Button";
import Truncated from "components/Truncated";

import { colors } from "constants/theme";

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
      loading,
      error,
      answerData,
      metadataData,
      contentTypes
    } = this.props;

    const isDisabled = loading || error;

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
          answerData={answerData}
          metadataData={metadataData}
          contentTypes={contentTypes}
        />
      </React.Fragment>
    );
  }
}

UnwrappedContentPickerSelect.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.bool,
  data: PropTypes.shape({
    questionnaire: CustomPropTypes.questionnaire
  }),
  onSubmit: PropTypes.func.isRequired,
  selectedContentDisplayName: PropTypes.string,
  name: PropTypes.string.isRequired,
  contentTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
  answerId: PropTypes.string,
  answerData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      displayName: PropTypes.string.isRequired
    })
  ),
  metadataData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      displayName: PropTypes.string.isRequired
    })
  )
};

UnwrappedContentPickerSelect.defaultProps = {
  selectedContentDisplayName: "Please select..."
};

export default UnwrappedContentPickerSelect;
