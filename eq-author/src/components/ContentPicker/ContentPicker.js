import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { isNil } from "lodash";

import ButtonGroup from "components/ButtonGroup";
import Button from "components/Button";

import ContentPickerSingle from "./ContentPickerSingle";

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const ActionButtons = styled(ButtonGroup)`
  padding: 1em 0;
  flex: 0 0 auto;
`;
export default class ContentPicker extends React.Component {
  static propTypes = {
    onSubmit: PropTypes.func,
    onClose: PropTypes.func,
    data: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired
      })
    ).isRequired,
    config: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        childKey: PropTypes.string
      })
    ).isRequired
  };

  state = {
    selectedItems: []
  };

  getDataAtLevel(level) {
    if (level === 0) {
      return this.props.data;
    }
    const parentLevel = level - 1;
    const parentItem = this.state.selectedItems[parentLevel];
    if (!parentItem) {
      return [];
    }
    const { config } = this.props;
    return parentItem[config[parentLevel].childKey];
  }

  handleTitleClick = level => {
    const { config } = this.props;
    this.setState(state => {
      let openLevel = level;
      if (state.openLevel === level && state.selectedItems[level]) {
        openLevel = Math.min(state.selectedItems.length, config.length - 1);
      }
      return {
        openLevel
      };
    });
  };

  handleOptionClick = (level, option) => {
    const { config } = this.props;
    this.setState(state => ({
      openLevel: Math.min(level + 1, config.length - 1),
      selectedItems: [...state.selectedItems.slice(0, level), option]
    }));
  };

  renderPickers() {
    const { config } = this.props;
    const { selectedItems, openLevel } = this.state;

    return config.map(({ id, title: defaultTitle }, level) => {
      const isDisabled = level > selectedItems.length;
      const isHidden = level > openLevel;
      const isOpen = level === openLevel || config.length === 1;

      const selectedItem = selectedItems[level];
      const isSelected = selectedItem && !isOpen;
      const isLastLevel = config.length - 1 === level;
      const useCustomTitle =
        !isLastLevel && selectedItem && selectedItem.displayName;

      const title = useCustomTitle
        ? `${defaultTitle}: ${selectedItem.displayName}`
        : defaultTitle;

      const data = this.getDataAtLevel(level);

      return (
        <ContentPickerSingle
          key={id}
          title={title}
          data={data}
          disabled={isDisabled}
          hidden={isHidden}
          open={isOpen}
          selected={isSelected}
          selectedOption={(selectedItem || {}).id}
          onTitleClick={() => this.handleTitleClick(level)}
          onOptionClick={option => this.handleOptionClick(level, option)}
          childKey={config[level].childKey}
          data-test={`${id}-picker`}
        />
      );
    });
  }

  render() {
    const { config } = this.props;
    const { selectedItems } = this.state;
    const selectedItem = selectedItems[config.length - 1];
    return (
      <React.Fragment>
        <ContentWrapper>{this.renderPickers()}</ContentWrapper>
        <ActionButtons horizontal align="right">
          <Button
            variant="secondary"
            type="button"
            onClick={this.props.onClose}
            data-test="cancel-button"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isNil(selectedItem)}
            onClick={() => this.props.onSubmit(selectedItem)}
            data-test="submit-button"
          >
            Select
          </Button>
        </ActionButtons>
      </React.Fragment>
    );
  }
}
