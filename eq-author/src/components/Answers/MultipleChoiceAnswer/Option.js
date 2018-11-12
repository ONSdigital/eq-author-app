import React, { Component } from "react";
import styled from "styled-components";
import { colors, radius } from "constants/theme";
import { Field, Label } from "components/Forms";
import WrappingInput from "components/WrappingInput";
import withEntityEditor from "components/withEntityEditor";
import PropTypes from "prop-types";
import CustomPropTypes from "custom-prop-types";
import DeleteButton from "components/DeleteButton";
import Tooltip from "components/Tooltip";
import { CHECKBOX, RADIO } from "constants/answer-types";
import DummyMultipleChoice from "components/Answers/Dummy/MultipleChoice";

import optionFragment from "graphql/fragments/option.graphql";
import getIdForObject from "utils/getIdForObject";

const ENTER_KEY = 13;

export const DeleteContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
`;

const Flex = styled.div`
  display: flex;
  align-items: flex-start;
`;

const OptionField = styled(Field)`
  margin-bottom: 1em;
`;

export const StyledOption = styled.div`
  border: 1px solid ${colors.bordersLight};
  padding: 1em 1em 0;
  border-radius: ${radius};
  position: relative;

  margin-bottom: 1em;
`;

StyledOption.defaultProps = {
  duration: 200
};

StyledOption.propTypes = {
  duration: PropTypes.number
};

export class StatelessOption extends Component {
  static propTypes = {
    option: CustomPropTypes.option.isRequired,
    onChange: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onEnterKey: PropTypes.func,
    hasDeleteButton: PropTypes.bool.isRequired,
    type: PropTypes.oneOf([RADIO, CHECKBOX]).isRequired,
    children: PropTypes.node,
    labelPlaceholder: PropTypes.string,
    descriptionPlaceholder: PropTypes.string,
    autoFocus: PropTypes.bool
  };

  static defaultProps = {
    labelPlaceholder: "Label",
    autoFocus: true
  };

  handleDeleteClick = () => {
    this.props.onDelete(this.props.option.id);
  };

  handleKeyDown = e => {
    if (e.keyCode === ENTER_KEY) {
      this.props.onEnterKey(e);
    }
  };

  renderDeleteButton() {
    return (
      <DeleteContainer>
        <Tooltip content="Delete option" place="top" offset={{ bottom: 10 }}>
          <DeleteButton
            size="medium"
            aria-label="Delete option"
            onClick={this.handleDeleteClick}
            data-test="btn-delete-option"
          />
        </Tooltip>
      </DeleteContainer>
    );
  }

  render() {
    const {
      hasDeleteButton,
      option,
      onChange,
      onUpdate,
      type,
      children,
      labelPlaceholder,
      descriptionPlaceholder,
      autoFocus,
      ...otherProps
    } = this.props;

    return (
      <StyledOption id={getIdForObject(option)} key={option.id} {...otherProps}>
        <div>
          <Flex>
            <DummyMultipleChoice type={type} />
            <OptionField>
              <Label htmlFor={`option-label-${option.id}`}>Label</Label>
              <WrappingInput
                id={`option-label-${option.id}`}
                name="label"
                value={option.label}
                placeholder={labelPlaceholder}
                onChange={onChange}
                onBlur={onUpdate}
                onKeyDown={this.handleKeyDown}
                data-test="option-label"
                data-autofocus={autoFocus || null}
                bold
              />
            </OptionField>
          </Flex>
          <OptionField>
            <Label htmlFor={`option-description-${option.id}`}>
              Description (optional)
            </Label>
            <WrappingInput
              id={`option-description-${option.id}`}
              name="description"
              placeholder={descriptionPlaceholder}
              onChange={onChange}
              value={option.description}
              onBlur={onUpdate}
              onKeyDown={this.handleKeyDown}
              data-test="option-description"
            />
          </OptionField>
          {children}
          {hasDeleteButton && this.renderDeleteButton()}
        </div>
      </StyledOption>
    );
  }
}

StatelessOption.fragments = {
  Option: optionFragment
};

export default withEntityEditor("option", optionFragment)(StatelessOption);
