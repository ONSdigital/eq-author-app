import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import styled from "styled-components";
import { get, isUndefined } from "lodash";

import ContentPickerModal from "components/ContentPickerModal";
import AvailablePipingContentQuery from "components/RichTextEditor/AvailablePipingContentQuery";
import shapeTree from "components/ContentPicker/shapeTree";

import CustomPropTypes from "custom-prop-types";

import IconPiping from "./icon-link.svg?inline";
import ToolbarButton from "./ToolbarButton";

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
        id: PropTypes.string.isRequired
      })
    ),
    metadataData: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired
      })
    )
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
    const { answerData, metadataData, disabled, loading } = this.props;

    const buttonProps = {
      title: "Pipe value"
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

const PipingMenu = props => (
  <AvailablePipingContentQuery
    id={props.match.params.pageId || props.match.params.sectionId}
    sectionContent={isUndefined(props.match.params.pageId)}
  >
    {({ data, ...innerProps }) => {
      const root = `${props.match.params.pageId ? "questionPage" : "section"}`;
      return (
        <Menu
          answerData={shapeTree(get(data, `${root}.availablePipingAnswers`))}
          metadataData={get(data, `${root}.availablePipingMetadata`)}
          {...props}
          {...innerProps}
        />
      );
    }}
  </AvailablePipingContentQuery>
);

PipingMenu.propTypes = {
  match: CustomPropTypes.match,
  disabled: PropTypes.bool
};

export default withRouter(PipingMenu);
