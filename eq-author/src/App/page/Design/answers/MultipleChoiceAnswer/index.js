import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/react-hooks";
import UPDATE_ANSWER from "graphql/updateAnswer.graphql";
import PropTypes from "prop-types";
import CustomPropTypes from "custom-prop-types";
import { TransitionGroup } from "react-transition-group";
import styled from "styled-components";
import focusOnEntity from "utils/focusOnEntity";
import withValidationError from "enhancers/withValidationError";
import withEntityEditor from "components/withEntityEditor";
import Option from "../MultipleChoiceAnswer/Option";
import OptionTransition from "../MultipleChoiceAnswer/OptionTransition";
import BasicAnswer from "../BasicAnswer";
import { Field, Label } from "components/Forms";
import WrappingInput from "components/Forms/WrappingInput";
import { MISSING_LABEL, buildLabelError } from "constants/validationMessages";
import { flowRight, lowerCase } from "lodash";
import { colors } from "constants/theme";
import { enableOn } from "utils/featureFlags";

import {
  TEXTFIELD,
  CHECKBOX,
  MUTUALLY_EXCLUSIVE,
} from "constants/answer-types";
import SplitButton from "components/buttons/SplitButton";
import Dropdown from "components/buttons/SplitButton/Dropdown";
import MenuItem from "components/buttons/SplitButton/MenuItem";
import AnswerProperties from "components/AnswerContent/AnswerProperties";
import Button from "components/buttons/Button";
import Reorder from "components/Reorder";
import Collapsible from "components/Collapsible";

import gql from "graphql-tag";

import withMoveOption from "../withMoveOption";

const AnswerWrapper = styled.div`
  margin: 1em 0 0;
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

const StyledSplitButton = styled(SplitButton)`
  margin-bottom: 1em;
`;

const AddOptionButton = styled(Button)`
  width: 100%;
  margin-top: 1em;
  margin-bottom: 1em;
`;

const CollapsibleContent = styled.p``;

export const UnwrappedMultipleChoiceAnswer = ({
  answer,
  onUpdateOption,
  onUpdate,
  minOptions,
  onMoveOption,
  onChange,
  autoFocus,
  getValidationError,
  optionErrorMsg,
  errorLabel,
  type,
  onDeleteOption,
  onAddOption,
  onAddExclusive,
  ...otherProps
}) => {
  const [updateAnswer] = useMutation(UPDATE_ANSWER);

  const [open, setOpen] = useState(false);
  useEffect(() => {
    setOpen(false);
  }, [answer]);

  const errorMsg = buildLabelError(MISSING_LABEL, `${lowerCase(type)}`, 8, 7);

  const handleOptionDelete = (optionId) => {
    onDeleteOption(optionId, answer.id);
  };

  const handleAddOption = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onAddOption(answer.id, { hasAdditionalAnswer: false }).then(focusOnEntity);
  };

  const handleAddExclusive = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onAddExclusive(answer.id).then(focusOnEntity);
  };

  const handleAddOther = (e) => {
    e.preventDefault();
    onAddOption(answer.id, { hasAdditionalAnswer: true }).then(focusOnEntity);
  };

  const numberOfOptions = answer.options.length + (answer.other ? 1 : 0);
  const showDeleteOption = numberOfOptions > minOptions;
  return (
    <>
      <Field>
        <Label htmlFor={`answer-label-${answer.id}`}>
          {"Label (optional)"}
        </Label>
        <WrappingInput
          id={`answer-label-${answer.id}`}
          name="label"
          onChange={onChange}
          onBlur={onUpdate}
          value={answer.label}
          data-autofocus={autoFocus || null}
          placeholder={""}
          data-test="txt-answer-label"
          bold
          errorValidationMsg={
            optionErrorMsg
              ? optionErrorMsg
              : getValidationError({
                  field: "label",
                  type: "answer",
                  label: errorLabel,
                  requiredMsg: errorMsg,
                })
          }
        />
      </Field>
      <AnswerProperties answer={answer} updateAnswer={updateAnswer} />
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
              <Option
                {...otherProps}
                {...props}
                type={type}
                option={option}
                onDelete={handleOptionDelete}
                onUpdate={onUpdateOption}
                onEnterKey={handleAddOption}
                hasDeleteButton={showDeleteOption}
                hideMoveButtons={numberOfOptions === 1}
                answer={answer}
                hasMultipleOptions={
                  answer.type === MUTUALLY_EXCLUSIVE &&
                  answer.options.length > 1
                }
              />
            )}
          </Reorder>
          {answer.mutuallyExclusiveOption && (
            <OptionTransition key={answer.mutuallyExclusiveOption.id}>
              <SpecialOptionWrapper data-test="exclusive-option">
                <ExclusiveOr>Or</ExclusiveOr>
                <Option
                  {...otherProps}
                  option={answer.mutuallyExclusiveOption}
                  onDelete={handleOptionDelete}
                  onUpdate={onUpdateOption}
                  onEnterKey={handleAddOption}
                  hasDeleteButton
                  hideMoveButtons
                  type={type}
                />
              </SpecialOptionWrapper>
            </OptionTransition>
          )}
        </TransitionGroup>
        {type === MUTUALLY_EXCLUSIVE && (
          <Collapsible title="What is an OR answer?">
            <CollapsibleContent>
              The OR answer type is a mutually exclusive answer. When selected,
              any preceding answers given on the page will be cleared. It will
              appear as a checkbox answer to the respondent unless there is more
              than one OR option, in which case it will display as a Radio
              answer.
            </CollapsibleContent>
          </Collapsible>
        )}
        <div>
          {answer.type !== MUTUALLY_EXCLUSIVE ? (
            <StyledSplitButton
              onPrimaryAction={handleAddOption}
              primaryText={
                answer.type === CHECKBOX ? "Add checkbox" : "Add another option"
              }
              onToggleOpen={(setopen) => setOpen(setopen)}
              open={open}
              dataTest="btn-add-option"
            >
              <Dropdown>
                <MenuItem
                  onClick={handleAddOther}
                  data-test="btn-add-option-other"
                >
                  Add &ldquo;Other&rdquo; option
                </MenuItem>
                {answer.type === CHECKBOX &&
                  !enableOn(["mutuallyExclusiveAnswer"]) && (
                    <MenuItem
                      onClick={handleAddExclusive}
                      disabled={answer.mutuallyExclusiveOption !== null}
                      data-test="btn-add-mutually-exclusive-option"
                    >
                      Add an &ldquo;Or&rdquo; option
                    </MenuItem>
                  )}
              </Dropdown>
            </StyledSplitButton>
          ) : (
            <AddOptionButton
              onClick={handleAddOption}
              variant="secondary"
              dataTest="btn-add-option"
            >
              Add another option
            </AddOptionButton>
          )}
        </div>
      </AnswerWrapper>
    </>
  );
};

UnwrappedMultipleChoiceAnswer.defaultProps = {
  minOptions: 1,
  labelText: "Label",
  errorLabel: "Answer label",
  autoFocus: true,
  getValidationError: () => {},
  type: TEXTFIELD,
};

UnwrappedMultipleChoiceAnswer.propTypes = {
  answer: CustomPropTypes.answer.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onAddOption: PropTypes.func.isRequired,
  onUpdateOption: PropTypes.func.isRequired,
  onDeleteOption: PropTypes.func.isRequired,
  minOptions: PropTypes.number.isRequired,
  onAddExclusive: PropTypes.func.isRequired,
  onMoveOption: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  autoFocus: PropTypes.bool,
  getValidationError: PropTypes.func.isRequired,
  optionErrorMsg: PropTypes.string,
  errorLabel: PropTypes.string,
  type: PropTypes.string,
};

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

export default flowRight(
  withValidationError("answer"),
  withEntityEditor("answer")
)(withMoveOption(UnwrappedMultipleChoiceAnswer));
