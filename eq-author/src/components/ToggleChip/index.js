import React from "react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";
import { colors } from "constants/theme";
import checkedIcon from "./checked.svg";
import Truncated from "components/Truncated";
import withChangeHandler from "../Forms/withChangeHandler";

const labelStyles = {
  unchecked: css`
    color: ${colors.text};
    background: ${colors.lightMediumGrey};

    &:hover {
      color: white;
      background: ${colors.secondary};
    }
  `,
  checked: css`
    color: ${colors.white};
    background: ${colors.primary};

    &:hover {
      background: #007ab3;
    }
  `
};

const checkboxStyle = {
  unchecked: css`
    border-color: ${colors.borders};

    &:hover {
      border-color: ${colors.white};
    }
  `,
  checked: css`
    border-color: white;
    background: white url(${checkedIcon}) no-repeat center;
    background-size: contain;
  `
};

const Field = styled.div`
  display: inline-block;
  position: relative;
  margin: 0.25em 0.5em 0.25em 0;
`;

export const Label = styled.label`
  display: flex;
  align-items: center;
  user-select: none;
  border-radius: 2.75em;
  padding: 0 1em 0 0;
  cursor: pointer;

  ${props => (props.checked ? labelStyles.checked : labelStyles.unchecked)};

  &:focus-within {
    box-shadow: 0 0 0 3px ${colors.tertiary};
  }
`;

const Text = styled(Truncated)`
  line-height: 1.3;
  display: inline-block;
  max-width: ${props => props.maxWidth}em;
`;

Text.defaultProps = {
  maxWidth: 30
};

const Input = styled.input`
  font-size: 1em;
  width: 1em;
  height: 1em;
  margin: 0.5em;
  -webkit-appearance: none;
  pointer-events: none;
  z-index: 2;
  border-radius: 1em;
  border: 2px solid;

  ${props => (props.checked ? checkboxStyle.checked : checkboxStyle.unchecked)};

  &:focus {
    opacity: 1;
    outline: none;
  }
`;

class ToggleChip extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    checked: PropTypes.bool,
    maxWidth: PropTypes.number,
    onChange: PropTypes.func.isRequired
  };

  render() {
    const { name, onChange, title, children, checked, maxWidth } = this.props;

    return (
      <Field>
        <Label checked={checked}>
          <Input
            name={name}
            type="checkbox"
            checked={checked}
            onChange={onChange}
          />
          <Text title={title} maxWidth={maxWidth}>
            {children}
          </Text>
        </Label>
      </Field>
    );
  }
}

export default withChangeHandler(ToggleChip);
