import React, { Component } from "react";
import styled from "styled-components";
import { colors, radius } from "constants/theme";
import { Field, Label } from "components/Forms";
import WrappingInput from "components/Forms/WrappingInput";
import withEntityEditor from "components/withEntityEditor";
import withValidationError from "enhancers/withValidationError";
import { flowRight, lowerCase } from "lodash";
import PropTypes from "prop-types";
import CustomPropTypes from "custom-prop-types";
import DeleteButton from "components/buttons/DeleteButton";
import Tooltip from "components/Forms/Tooltip";
import MoveButton, { IconUp, IconDown } from "components/buttons/MoveButton";
import { CHECKBOX, RADIO } from "constants/answer-types";
import DummyMultipleChoice from "../dummy/MultipleChoice";

import optionFragment from "graphql/fragments/option.graphql";
import getIdForObject from "utils/getIdForObject";
import { MISSING_LABEL, buildLabelError } from "constants/validationMessages";

const ENTER_KEY = 13;

export const ButtonsContainer = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  display: flex;
  z-index: 2;
  justify-content: flex-end;
`;

export const Flex = styled.div`
  display: flex;
  align-items: flex-start;
`;

export const OptionField = styled(Field)`
  margin-bottom: 1.5em;
`;

export const StyledOption = styled.div`
  border: 1px solid ${colors.bordersLight};
  padding: 1em 1em 0;
  border-radius: ${radius};
  position: relative;

  margin-bottom: 1em;
`;

StyledOption.defaultProps = {
  duration: 200,
};

StyledOption.propTypes = {
  duration: PropTypes.number,
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
    autoFocus: PropTypes.bool,
    label: PropTypes.string,
    getValidationError: PropTypes.func,
    canMoveUp: PropTypes.bool,
    onMoveUp: PropTypes.func,
    canMoveDown: PropTypes.bool,
    onMoveDown: PropTypes.func,
    hideMoveButtons: PropTypes.bool,
  };

  static defaultProps = {
    labelPlaceholder: "",
    autoFocus: true,
    getValidationError: () => {},
  };

  handleDeleteClick = () => {
    this.props.onDelete(this.props.option.id);
  };

  handleKeyDown = (e) => {
    if (e.keyCode === ENTER_KEY) {
      this.props.onEnterKey(e);
    }
  };

  renderToolbar() {
    const {
      hideMoveButtons,
      hasDeleteButton,
      canMoveUp,
      onMoveUp,
      canMoveDown,
      onMoveDown,
    } = this.props;

    return (
      <ButtonsContainer>
        {!hideMoveButtons && (
          <>
            <Tooltip
              content="Move answer up"
              place="top"
              offset={{ top: 0, bottom: 10 }}
            >
              <MoveButton
                disabled={!canMoveUp}
                onClick={onMoveUp}
                data-test="btn-move-answer-up"
              >
                <IconUp />
              </MoveButton>
            </Tooltip>
            <Tooltip
              content="Move answer down"
              place="top"
              offset={{ top: 0, bottom: 10 }}
            >
              <MoveButton
                disabled={!canMoveDown}
                onClick={onMoveDown}
                data-test="btn-move-answer-down"
              >
                <IconDown />
              </MoveButton>
            </Tooltip>
          </>
        )}
        {(hasDeleteButton || !hideMoveButtons) && (
          <Tooltip content="Delete option" place="top" offset={{ bottom: 10 }}>
            <DeleteButton
              size="medium"
              aria-label="Delete option"
              onClick={this.handleDeleteClick}
              data-test="btn-delete-option"
              disabled={!hasDeleteButton}
            />
          </Tooltip>
        )}
      </ButtonsContainer>
    );
  }

  render() {
    const {
      option,
      onChange,
      onUpdate,
      type,
      children,
      labelPlaceholder,
      descriptionPlaceholder,
      autoFocus,
      label,
      getValidationError,
    } = this.props;

    const errorMsg = buildLabelError(MISSING_LABEL, `${lowerCase(type)}`, 8, 7);

    return (
      <StyledOption id={getIdForObject(option)} key={option.id}>
        <div>
          <Flex>
            <DummyMultipleChoice type={type} />
            <OptionField>
              <Label htmlFor={`option-label-${option.id}`}>
                {label || "Label"}
              </Label>
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
                errorValidationMsg={getValidationError({
                  field: "label",
                  label: "Option label",
                  requiredMsg: errorMsg,
                })}
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
          {this.renderToolbar()}
        </div>
      </StyledOption>
    );
  }
}

StatelessOption.fragments = {
  Option: optionFragment,
};

export default flowRight(
  withValidationError("option"),
  withEntityEditor("option")
)(StatelessOption);
