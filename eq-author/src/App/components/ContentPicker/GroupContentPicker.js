import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { isNil } from "lodash";

import ButtonGroup from "components/Buttons/ButtonGroup";
import Button from "components/Buttons/Button";

import ContentPickerSingle from "App/components/ContentPicker/ContentPickerSingle";
import ContentPickerButton from "App/components/ContentPicker/ContentPickerButton";

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const ActionButtons = styled(ButtonGroup)`
  padding: 1em 0;
  flex: 0 0 auto;
`;

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
        groupKey: PropTypes.string
      })
    ).isRequired
  };

  state = {
    openLevel: null,
    selectedItem: null
  };

  handleTitleClick = level => {
    this.setState(state => {
      let openLevel = level;
      if (state.openLevel === level) {
        openLevel = null;
      }
      return {
        openLevel,
        selectedItem: null
      };
    });
  };

  handleOptionClick = (level, option) => {
    const config = this.props.config[level];

    this.setState({
      openLevel: level,
      selectedItem: {
        ...option,
        config
      }
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
            onOptionClick={option => this.handleOptionClick(level, option)}
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
