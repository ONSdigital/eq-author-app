import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import styled from "styled-components";

import ContentPickerModal from "components/ContentPickerModal";
import AvailablePipingContentQuery from "components/RichTextEditor/AvailablePipingContentQuery";
import shapeTree from "components/ContentPicker/shapeTree";

import CustomPropTypes from "custom-prop-types";

import IconPiping from "components/RichTextEditor/icon-link.svg?inline";
import ToolbarButton from "components/RichTextEditor/ToolbarButton";

import { ANSWER, METADATA } from "components/ContentPickerSelect/content-types";

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
    answerData: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
      })
    ),
    metadataData: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
      })
    ),
  };

  state = {
    isPickerOpen: false,
  };

  handleButtonClick = () => {
    this.setState(state => ({
      isPickerOpen: !state.isPickerOpen,
    }));
  };

  handlePickerClose = () => {
    this.setState({
      isPickerOpen: false,
    });
  };

  handlePickerSubmit = (...args) => {
    this.handlePickerClose();
    this.props.onItemChosen(...args);
  };

  render() {
    const { answerData, metadataData, disabled, loading } = this.props;

    const buttonProps = {
      title: "Pipe value",
    };

    const isDisabled = loading || disabled || (!answerData && !metadataData);

    if (isDisabled) {
      return <MenuButton {...buttonProps} disabled />;
    }

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
          answerData={answerData}
          metadataData={metadataData}
          onClose={this.handlePickerClose}
          onSubmit={this.handlePickerSubmit}
          data-test="picker"
          contentTypes={[ANSWER, METADATA]}
        />
      </React.Fragment>
    );
  }
}

const calculateEntityName = ({ pageId, confirmationId }) => {
  if (confirmationId) {
    return "questionConfirmation";
  }
  if (pageId) {
    return "page";
  }
  return "section";
};

export const UnwrappedPipingMenu = props => (
  <AvailablePipingContentQuery
    questionnaireId={props.match.params.questionnaireId}
    pageId={props.match.params.pageId}
    sectionId={props.match.params.sectionId}
    confirmationId={props.match.params.confirmationId}
  >
    {({ data = {}, ...innerProps }) => {
      const entityName = calculateEntityName(props.match.params);
      const entity = data[entityName] || {};
      return (
        <Menu
          answerData={shapeTree(entity.availablePipingAnswers)}
          metadataData={entity.availablePipingMetadata}
          {...props}
          {...innerProps}
        />
      );
    }}
  </AvailablePipingContentQuery>
);

UnwrappedPipingMenu.propTypes = {
  match: CustomPropTypes.match,
  disabled: PropTypes.bool,
};

export default withRouter(UnwrappedPipingMenu);
