import React from "react";
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

import Button from "components/buttons/Button";

import { flowRight } from "lodash";
import { colors } from "constants/theme";
import { TEXTFIELD } from "constants/answer-types";
import AnswerProperties from "components/AnswerContent/AnswerProperties";

import gql from "graphql-tag";

import Reorder from "components/Reorder";
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

const AddOptionButton = styled(Button)`
  width: 100%;
  margin-bottom: 1em;
`;

export const UnwrappedMultipleChoiceAnswer = ({
  answer,
  onUpdateOption,
  minOptions,
  onMoveOption,
  type,
  onDeleteOption,
  onAddOption,
  ...otherProps
}) => {
  const [updateAnswer] = useMutation(UPDATE_ANSWER);

  const handleOptionDelete = (optionId) => {
    onDeleteOption(optionId, answer.id);
  };

  const handleAddOption = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onAddOption(answer.id, { hasAdditionalAnswer: false }).then(focusOnEntity);
  };

  const numberOfOptions = answer.options.length + (answer.other ? 1 : 0);
  const showDeleteOption = numberOfOptions > minOptions;
  return (
    <>
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
                hasMultipleOptions={answer.options.length > 1}
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

        <div>
          <AddOptionButton
            onClick={handleAddOption}
            variant="secondary"
            dataTest="btn-add-option"
          >
            Add another option
          </AddOptionButton>
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
