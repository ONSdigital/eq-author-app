import React, { Component } from "react";

import PropTypes from "prop-types";
import CustomPropTypes from "custom-prop-types";
import { TransitionGroup } from "react-transition-group";
import styled from "styled-components";
import focusOnEntity from "utils/focusOnEntity";

import Option from "../MultipleChoiceAnswer/Option";
import OptionTransition from "../MultipleChoiceAnswer/OptionTransition";
import BasicAnswer from "../BasicAnswer";

import { colors } from "constants/theme";
import { CHECKBOX } from "constants/answer-types";
import SplitButton from "components/buttons/SplitButton";
import Dropdown from "components/buttons/SplitButton/Dropdown";
import MenuItem from "components/buttons/SplitButton/MenuItem";
import { ADDITIONAL_LABEL_MISSING } from "constants/validationMessages";

import gql from "graphql-tag";

import Reorder from "components/Reorder";
import withMoveOption from "../withMoveOption";

const AnswerWrapper = styled.div`
  margin: 2em 0 0;
  width: 85%;
`;

const ExclusiveOr = styled.div`
  padding-bottom: 1em;
  font-size: 1em;
  font-weight: bold;
  color: ${colors.text};
`;

const Options = styled.div`
  margin: 0 0 1em;
`;

export const AddOtherLink = styled.button`
  color: #48a6f6;
  text-decoration: none;
  border: 0;
  background: none;
`;

const SpecialOptionWrapper = styled.div`
  padding-top: 0.25em;
  margin-bottom: 2em;
`;

export class UnwrappedMultipleChoiceAnswer extends Component {
  static propTypes = {
    answer: CustomPropTypes.answer.isRequired,
    onUpdate: PropTypes.func.isRequired,
    onAddOption: PropTypes.func.isRequired,
    onUpdateOption: PropTypes.func.isRequired,
    onDeleteOption: PropTypes.func.isRequired,
    minOptions: PropTypes.number.isRequired,
    onAddExclusive: PropTypes.func.isRequired,
    onMoveOption: PropTypes.func.isRequired,
  };

  static defaultProps = {
    minOptions: 1,
  };

  state = {
    open: false,
  };

  handleOptionDelete = (optionId) => {
    this.props.onDeleteOption(optionId, this.props.answer.id);
  };

  handleAddOption = (e) => {
    e.preventDefault();
    e.stopPropagation();
    return this.props
      .onAddOption(this.props.answer.id, { hasAdditionalAnswer: false })
      .then(focusOnEntity);
  };

  handleAddExclusive = (e) => {
    e.preventDefault();
    e.stopPropagation();
    return this.props
      .onAddExclusive(this.props.answer.id)
      .then(this.handleToggleOpen(false))
      .then(focusOnEntity);
  };

  handleAddOther = (e) => {
    e.preventDefault();
    return this.props
      .onAddOption(this.props.answer.id, { hasAdditionalAnswer: true })
      .then((res) => {
        this.handleToggleOpen(false);
        return res;
      })
      .then((res) => res.option)
      .then(focusOnEntity);
  };

  handleToggleOpen = (open) => {
    this.setState({
      open,
    });
  };

  render() {
    const {
      answer,
      onUpdateOption,
      onUpdate,
      minOptions,
      onMoveOption,
      ...otherProps
    } = this.props;

    const numberOfOptions = answer.options.length + (answer.other ? 1 : 0);
    const showDeleteOption = numberOfOptions > minOptions;
    const errorMsgOther = ADDITIONAL_LABEL_MISSING;
    const additionalLabelError = answer.validationErrorInfo?.errors?.find(({ errorCode }) => errorCode === "ADDITIONAL_LABEL_MISSING") && errorMsgOther;

    console.log('additionalLabelError :>> ', additionalLabelError);

    return (
      <BasicAnswer
        answer={answer}
        onUpdate={onUpdate}
        autoFocus={false}
        labelText="Label (optional)"
        type={answer.type}
      >
        <AnswerWrapper>
          <TransitionGroup
            component={Options}
            data-test="multiple-choice-options"
          >
            <Reorder
              list={answer.options}
              onMove={onMoveOption}
              Transition={OptionTransition}
            >
              {(props, option) => (
                <>
                <Option
                  {...otherProps}
                  {...props}
                  option={option}
                  onDelete={this.handleOptionDelete}
                  onUpdate={onUpdateOption}
                  onEnterKey={this.handleAddOption}
                  hasDeleteButton={showDeleteOption}
                  hideMoveButtons={numberOfOptions === 1}
                  answer={answer}
                >
                  {option.additionalAnswer && (
                    console.log('option :>> ', option.validationErrorInfo?.errors?.find(({ errorCode }) => errorCode === "ADDITIONAL_LABEL_MISSING") && errorMsgOther),
                    <SpecialOptionWrapper data-test="other-answer">
                     <BasicAnswer
                      {...props}
                      key={option.id}
                        answer={option.additionalAnswer}
                        onUpdate={onUpdate}
                        showDescription={false}
                        labelText="Other label"
                        labelPlaceholder=""
                        errorLabel="Other label"
                        bold={false}
                        type={answer.type}
                        optionErrorMsg={ option.validationErrorInfo?.errors?.find(({ errorCode }) => errorCode === "ADDITIONAL_LABEL_MISSING") && errorMsgOther}
                      />
                    </SpecialOptionWrapper>
                   )}
                </Option>
                </>
              )}
            </Reorder>
            {answer.mutuallyExclusiveOption && (
              <OptionTransition key={answer.mutuallyExclusiveOption.id}>
                <SpecialOptionWrapper data-test="exclusive-option">
                  <ExclusiveOr>Or</ExclusiveOr>
                  <Option
                    {...otherProps}
                    option={answer.mutuallyExclusiveOption}
                    onDelete={this.handleOptionDelete}
                    onUpdate={onUpdateOption}
                    onEnterKey={this.handleAddOption}
                    hasDeleteButton
                    hideMoveButtons
                  />
                </SpecialOptionWrapper>
              </OptionTransition>
            )}
          </TransitionGroup>

          <div>
            <SplitButton
              onPrimaryAction={this.handleAddOption}
              primaryText={
                answer.type === CHECKBOX ? "Add checkbox" : "Add another option"
              }
              onToggleOpen={this.handleToggleOpen}
              open={this.state.open}
              dataTest="btn-add-option"
            >
              <Dropdown>
                <MenuItem
                  onClick={this.handleAddOther}
                  data-test="btn-add-option-other"
                >
                  Add &ldquo;Other&rdquo; option
                </MenuItem>
                {answer.type === CHECKBOX && (
                  <MenuItem
                    onClick={this.handleAddExclusive}
                    disabled={answer.mutuallyExclusiveOption !== null}
                    data-test="btn-add-mutually-exclusive-option"
                  >
                    Add an &ldquo;Or&rdquo; option
                  </MenuItem>
                )}
              </Dropdown>
            </SplitButton>
          </div>
        </AnswerWrapper>
      </BasicAnswer>
    );
  }
}

UnwrappedMultipleChoiceAnswer.fragments = {
  MultipleChoice: gql`
    fragment MultipleChoice on Answer {
      ...Answer
      ... on MultipleChoiceAnswer {
        options {
          ...Option
          validationErrorInfo {
            ...ValidationErrorInfo
          }
        }
        mutuallyExclusiveOption {
          ...Option
          validationErrorInfo {
            ...ValidationErrorInfo
          }
        }
        validationErrorInfo {
          ...ValidationErrorInfo
        }
      }
    }
    ${Option.fragments.Option}
    ${BasicAnswer.fragments.Answer}
  `,
};

export default withMoveOption(UnwrappedMultipleChoiceAnswer);
