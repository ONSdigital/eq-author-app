import React from "react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";
import IconAnswers from "./icon-answers.svg?inline";
import IconSections from "./icon-sections.svg?inline";
import { colors } from "constants/theme";

export const OPTION_ANSWERS = "option-answers";
export const OPTION_SECTIONS = "option-sections";

const OptionsContainer = styled.div`
  list-style: none;
  padding: 0;
  margin: 0;
  color: ${colors.textLight};
  display: flex;
  align-items: center;
  font-size: 0.9em;
`;

const OptionsLabel = styled.div`
  margin-right: 1em;
`;

const OptionInput = styled.input`
  display: none;
`;

const optionChecked = css`
  color: white;
  background: ${colors.primary};
  border-color: #2d5e7a;
  z-index: 1;
  &:hover {
    background: ${colors.secondary};
  }
  path {
    fill: white;
  }
`;

const OptionLabel = styled.label`
  cursor: pointer;
  display: flex;
  align-items: center;
  background: white;
  padding: 0.5rem 1rem;
  font-size: 0.9em;
  font-weight: bold;
  border: 1px solid ${colors.bordersLight};
  flex: 0 0 auto;
  text-align: center;
  position: relative;
  white-space: nowrap;

  &:first-of-type {
    border-radius: 4px 0 0 4px;
    margin-right: -1px;
  }

  &:last-of-type {
    border-radius: 0 4px 4px 0;
  }

  &:hover {
    background: ${colors.lightMediumGrey};
  }

  &:focus-within {
    outline-color: ${colors.tertiary};
    z-index: 4;
  }

  &:not(:last-of-type) {
    /* margin-right: 1em; */
  }

  ${(props) => props.checked && optionChecked};
`;

const OptionLabelText = styled.div`
  margin-left: 0.3em;
  line-height: 1.3;
`;

const Option = ({
  id,
  option,
  children,
  icon: Icon,
  onChange,
  ...otherProps
}) => {
  const onEnterUp = (event) => {
    if (event.keyCode === 13) {
      //13 is the enter keycode
      onChange({ target: { value: id } });
    }
  };

  const isChecked = option === id;

  return (
    <OptionLabel
      checked={isChecked}
      tabIndex={isChecked ? "" : "0"}
      onKeyUp={(event) => onEnterUp(event)}
    >
      <Icon />
      <OptionLabelText>{children}</OptionLabelText>
      <OptionInput
        type="radio"
        name="options"
        value={id}
        checked={option === id}
        onChange={onChange}
        {...otherProps}
      />
    </OptionLabel>
  );
};

Option.propTypes = {
  id: PropTypes.string.isRequired,
  option: PropTypes.string.isRequired,
  children: PropTypes.node,
  icon: PropTypes.func,
  onChange: PropTypes.func.isRequired,
};

const Options = ({ option, onChange, rightLabel }) => {
  return (
    <OptionsContainer>
      <OptionsLabel>Browse by</OptionsLabel>
      <Option
        id={OPTION_SECTIONS}
        option={option}
        icon={IconSections}
        onChange={onChange}
      >
        Sections
      </Option>
      <Option
        id={OPTION_ANSWERS}
        option={option}
        icon={IconAnswers}
        onChange={onChange}
      >
        {rightLabel}
      </Option>
    </OptionsContainer>
  );
};

Options.propTypes = {
  option: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  rightLabel: PropTypes.string,
};

Options.defaultProps = {
  rightLabel: "Answers",
};

export default Options;
