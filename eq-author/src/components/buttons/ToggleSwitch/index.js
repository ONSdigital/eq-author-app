import React from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import PropTypes from "prop-types";
import { uniqueId } from "lodash";
import { Input } from "components/Forms";
import { colors } from "constants/theme";

const hitTarget = {
  height: 2.2,
  width: 2,
};

const backgroundColors = {
  on: colors.blue,
  off: colors.white,
};

const backgroundSize = {
  width: 1.5,
  height: 1,
};

const labelColors = {
  on: colors.black,
  off: colors.grey,
};

const knobSize = 1;

const border = {
  on: `1px solid ${backgroundColors.on}`,
  off: `1px solid ${colors.darkGrey}`,
};

export const ToggleSwitchBackground = styled.div`
  height: ${backgroundSize.height}em;
  width: ${backgroundSize.width}em;
  top: ${(hitTarget.height - backgroundSize.height) / 2}em;
  background: ${(props) =>
    props.checked ? backgroundColors.on : backgroundColors.off};
  border-radius: 2em;
  position: absolute;
  border: ${(props) => (props.checked ? border.on : border.off)};
  transition: background 100ms ease-out, border-color 100ms ease-in;
  outline: 1px solid transparent;
  cursor: pointer;
  &:hover {
    border-color: ${colors.blue};
  }
`;

const ToggleSwitchKnob = styled.div`
  display: inline-block;
  height: ${knobSize}em;
  width: ${knobSize}em;
  background: ${colors.white};
  top: calc(42% - ${knobSize}em / 2);
  left: calc(32% - ${knobSize}em / 2);
  position: relative;
  will-change: transform;
  transform: translateX(
    ${(props) => (props.checked ? backgroundSize.width - knobSize : 0)}em
  );
  border-radius: 50%;
  transition: transform 100ms ease-in-out;
  border: inherit;
`;

export const HiddenInput = styled(Input)`
  opacity: 0;
  position: relative;
  height: 100%;
  width: 100%;
  margin: 0;
  cursor: pointer;
  &:focus + ${ToggleSwitchBackground} {
    box-shadow: 0 0 0 2px ${colors.tertiary};
  }
  &:hover + ${ToggleSwitchBackground} {
    border-color: ${colors.blue};
  }
`;

const FlexInline = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  height: ${hitTarget.height}em;
  width: ${hitTarget.width}em;
  position: relative;
`;

const ToggleLabel = styled.div`
  padding: 0 1em;
  align-items: center;
  display: ${(props) => (props.isHidden ? "none" : "flex")};
  color: ${(props) => (props.checked ? labelColors.on : labelColors.off)};
  font-weight: 600;

  &:first-of-type {
    padding-right: 0.5em;
  }

  &:last-of-type {
    padding-left: 0.5em;
  }
`;

class ToggleSwitch extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    checked: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    hideLabels: PropTypes.bool,
    ariaLabel: PropTypes.string,
  };

  static defaultProps = {
    checked: false,
    hideLabels: true,
  };

  constructor(props) {
    super(props);
    this.id = this.props.id || this.generateUniqueId();
  }

  generateUniqueId = () => {
    return uniqueId("toggle-");
  };

  handleToggle = () => {
    // eslint-disable-next-line react/no-find-dom-node
    ReactDOM.findDOMNode(this.hiddenInput).focus();
    this.props.onChange({
      name: this.id,
      value: !this.props.checked,
    });
  };

  inputRef = (input) => {
    this.hiddenInput = input;
  };

  render() {
    const { id, checked, onChange, hideLabels, ariaLabel } = this.props;

    return (
      <>
        <ToggleLabel checked={!checked} isHidden={hideLabels}>
          Off
        </ToggleLabel>
        <FlexInline role="switch" aria-checked={checked} data-test={id}>
          <HiddenInput
            id={this.id}
            type="checkbox"
            role="checkbox"
            aria-label={ariaLabel}
            aria-checked={checked}
            onChange={onChange}
            checked={checked}
            ref={this.inputRef}
            data-test={`${id}-input`}
          />
          <ToggleSwitchBackground
            role="presentation"
            checked={checked}
            onClick={this.handleToggle}
          >
            <ToggleSwitchKnob checked={checked} />
          </ToggleSwitchBackground>
        </FlexInline>
        <ToggleLabel checked={checked} isHidden={hideLabels}>
          On
        </ToggleLabel>
      </>
    );
  }
}

export default ToggleSwitch;
