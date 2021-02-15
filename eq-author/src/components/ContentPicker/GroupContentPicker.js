import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { isNil, findIndex, forEach } from "lodash";

import ButtonGroup from "components/buttons/ButtonGroup";
import Button from "components/buttons/Button";

import ContentPickerSingle from "components/ContentPicker/ContentPickerSingle";
import ContentPickerButton from "components/ContentPicker/ContentPickerButton";

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  min-height: 0;
`;

const ActionButtons = styled(ButtonGroup)`
  padding: 1em 0;
  flex: 0 0 auto;
`;

const generateDefaultState = (selectedObj, config) => {
  if (!selectedObj) {
    return {
      openLevel: null,
      selectedItem: null,
    };
  }
  let openLevel;
  let selectedItem;
  forEach(selectedObj, (value) => {
    if (value === null) {
      return;
    }
    if (typeof value !== "object") {
      openLevel = null;
    } else {
      openLevel = findIndex(config, ({ id }) => id === value.__typename);
    }
    selectedItem = value;
    return false;
  });
  return {
    openLevel,
    selectedItem,
  };
};

export default class GroupContentPicker extends React.Component {
  static propTypes = {
    onSubmit: PropTypes.func,
    onClose: PropTypes.func,
    data: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    config: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        childKey: PropTypes.string,
        groupKey: PropTypes.string,
      })
    ).isRequired,
    selectedObj: PropTypes.shape({
      section: PropTypes.shape({
        id: PropTypes.string,
        displayName: PropTypes.string,
      }),
      page: PropTypes.shape({
        id: PropTypes.string,
        displayName: PropTypes.string,
      }),
      logical: PropTypes.string,
    }),
  };

  state = generateDefaultState(this.props.selectedObj, this.props.config);

  handleTitleClick = (level) => {
    this.setState((state) => {
      let openLevel = level;
      if (state.openLevel === level) {
        openLevel = null;
      }
      return {
        openLevel,
        selectedItem: null,
      };
    });
  };

  handleOptionClick = (level, option) => {
    const config = this.props.config[level];

    this.setState({
      openLevel: level,
      selectedItem: {
        ...option,
        config,
      },
    });
  };

  renderPickers() {
    const { config } = this.props;
    const { selectedItem, openLevel } = this.state;

    return config.map(({ id, title, expandable }, level) => {
      const isOpen = level === openLevel;
      const isHidden = openLevel !== null ? level > openLevel : false;
      const data = this.props.data[this.props.config[level].groupKey];
      const isDisabled = !data.length;

      if (expandable) {
        return (
          <ContentPickerSingle
            key={id}
            title={title}
            data={data}
            hidden={isHidden}
            open={isOpen}
            selected={isOpen}
            selectedOption={(selectedItem || {}).id}
            onTitleClick={() => this.handleTitleClick(level)}
            onOptionClick={(option) => this.handleOptionClick(level, option)}
            childKey={config[level].childKey}
            data-test={`${id}-picker`}
            disabled={isDisabled}
          />
        );
      } else {
        return (
          <ContentPickerButton
            key={id}
            onClick={() => this.handleOptionClick(level, { id, title })}
            selected={isOpen}
            open={isOpen}
            hidden={isHidden}
            label={title}
            data-test={`${id}-picker`}
            disabled={isDisabled}
          />
        );
      }
    });
  }

  render() {
    const { selectedItem } = this.state;
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
