import React, { Component } from "react";
import CustomPropTypes from "custom-prop-types";
import PropTypes from "prop-types";
import styled from "styled-components";
import { propType } from "graphql-anywhere";
import { isNil } from "lodash";

import ContentPickerModal from "components/ContentPickerModal";
import Button from "components/buttons/Button";
import Truncated from "components/Truncated";

import { colors } from "constants/theme";

import LogicalDestination from "graphql/fragments/logical-destination.graphql";
import QuestionPageDestination from "graphql/fragments/question-page-destination.graphql";
import SectionDestination from "graphql/fragments/section-destination.graphql";

import iconChevron from "components/ContentPickerSelect/icon-chevron.svg";

export const ContentSelectButton = styled(Button).attrs({
  variant: "tertiary"
})`
  font-size: 1em;
  font-weight: normal;
  padding: 0.5em 0.75em;
  border: 1px solid ${colors.borders};
  height: 2.5em;
  width: 100%;
  justify-content: space-between;

  &::after {
    content: url(${iconChevron});
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 2em;
    height: 2em;
    margin: auto;
    opacity: 0.7;
  }
  &:hover {
    border-color: ${colors.blue};
    outline-color: ${colors.blue};
    background: none;
    color: ${colors.blue};
    &::after {
      opacity: 1;
    }
  }
`;

const ContentSelected = styled(Truncated)`
  color: ${colors.text};
  max-width: 18em;
  padding-right: 1em;
  text-align: left;
  line-height: 1.3;
`;

export class UnwrappedContentPickerSelect extends Component {
  state = {
    isPickerOpen: false
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
    this.props.onSubmit({ name: this.props.name, value: selected });
  };

  render() {
    const { isPickerOpen } = this.state;
    const { selectedContentDisplayName } = this.props;
    const {
      loading,
      error,
      disabled,
      answerData,
      questionData,
      metadataData,
      destinationData,
      contentTypes,
      ...otherProps
    } = this.props;

    const isDisabled = loading || !isNil(error) || disabled;
    return (
      <React.Fragment>
        <ContentSelectButton
          data-test="content-picker-select"
          onClick={this.handlePickerOpen}
          disabled={isDisabled}
          {...otherProps}
        >
          <ContentSelected>{selectedContentDisplayName}</ContentSelected>
        </ContentSelectButton>
        <ContentPickerModal
          isOpen={isPickerOpen}
          onClose={this.handlePickerClose}
          onSubmit={this.handlePickerSubmit}
          data-test="picker"
          answerData={answerData}
          metadataData={metadataData}
          questionData={questionData}
          destinationData={destinationData}
          contentTypes={contentTypes}
        />
      </React.Fragment>
    );
  }
}

UnwrappedContentPickerSelect.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.object, // eslint-disable-line
  disabled: PropTypes.bool,
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
  questionData: PropTypes.arrayOf(
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
  ),
  destinationData: PropTypes.shape({
    logicalDestinations: PropTypes.arrayOf(propType(LogicalDestination)),
    questionPages: PropTypes.arrayOf(propType(QuestionPageDestination)),
    sections: PropTypes.arrayOf(propType(SectionDestination))
  })
};

UnwrappedContentPickerSelect.defaultProps = {
  selectedContentDisplayName: "Please select..."
};

export default UnwrappedContentPickerSelect;
