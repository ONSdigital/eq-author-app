import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { propType } from "graphql-anywhere";
import styled from "styled-components";
import { useMutation } from "@apollo/react-hooks";

import answerFragment from "graphql/fragments/answer.graphql";
import CREATE_MUTUALLY_EXCLUSIVE from "../BasicAnswer/graphql/createMutuallyExclusiveOption.graphql";
import DELETE_OPTION from "../BasicAnswer/graphql/deleteOption.graphql";
import UPDATE_OPTION_MUTATION from "graphql/updateOption.graphql";
import UPDATE_ANSWER from "graphql/updateAnswer.graphql";
import { Field, Label } from "components/Forms";
import WrappingInput from "components/Forms/WrappingInput";
import ToggleSwitch from "components/buttons/ToggleSwitch";
import {
  StyledOption,
  Flex,
  OptionField,
} from "App/page/Design/answers/MultipleChoiceAnswer/Option";
import DummyMultipleChoice from "../dummy/MultipleChoice";

import { CHECKBOX } from "constants/answer-types";
import Date from "../Date";
import MultiLineField from "components/AdditionalContent/AnswerProperties/Format/MultiLineField";
import AnswerProperties from "components/AdditionalContent/AnswerProperties";
import AdvancedProperties from "components/AdditionalContent/AdvancedProperties";
import AnswerValidation from "App/page/Design/Validation/AnswerValidation";

const ToggleWrapper = styled.div`
  opacity: ${({ disabled }) => (disabled ? "0.6" : "1")};
  pointer-events: ${({ disabled }) => (disabled ? "none" : "auto")};
`;

const InlineField = styled(Field)`
  display: flex;
  align-items: center;
  margin-bottom: 0.4em;

  > * {
    margin-bottom: 0;
  }
`;

const HorizontalRule = styled.hr`
  margin: 0.2em 0 0.9em;
`;

const Container = styled.div`
  display: flex;
  align-items: center;
`;

export const DateSingle = ({
  answer,
  onChange,
  onUpdate,
  multipleAnswers,
  labelPlaceholder,
  autoFocus,
  descriptionPlaceholder,
  disableMutuallyExclusive,
  ...otherProps
}) => {
  const getMutuallyExclusive = ({ options }) =>
    options?.find(({ mutuallyExclusive }) => mutuallyExclusive === true);

  const [createMutuallyExclusive] = useMutation(CREATE_MUTUALLY_EXCLUSIVE);
  const [updateOption] = useMutation(UPDATE_OPTION_MUTATION);
  const [deleteOption] = useMutation(DELETE_OPTION);
  const [onUpdateAnswer] = useMutation(UPDATE_ANSWER);

  const [mutuallyExclusiveLabel, setMutuallyExclusiveLabel] = useState("");

  useEffect(() => {
    const { label } = getMutuallyExclusive(answer) || { label: "" };
    setMutuallyExclusiveLabel(label);
  }, [answer]);

  const onChangeToggle = () => {
    const { id } = getMutuallyExclusive(answer) || {};
    if (!id) {
      createMutuallyExclusive({
        variables: { input: { answerId: answer.id, label: "" } },
      });
    } else {
      deleteOption({ variables: { input: { id } } });
    }
  };

  const onUpdateOption = (label) => {
    const { id } = getMutuallyExclusive(answer) || {};

    updateOption({ variables: { input: { id, label } } });
  };

  const onUpdateRequired = ({ value }) => {
    onUpdateAnswer({
      variables: {
        input: {
          id: answer.id,
          properties: { ...answer.properties, required: value },
        },
      },
    });
  };

  const onUpdateFormat = ({ value }) => {
    onUpdateAnswer({
      variables: {
        input: {
          id: answer.id,
          properties: { ...answer.properties, format: value },
        },
      },
    });
  };

  return (
    <>
      <Date
        key={`from-${answer.id}`}
        answer={answer}
        name="label"
        showDay
        showMonth
        showYear
        onChange={onChange}
        onUpdate={onUpdate}
        {...otherProps}
      />
      <AnswerProperties
        answer={answer}
        onUpdateFormat={onUpdateFormat}
        onUpdateRequired={onUpdateRequired}
      />
      <AdvancedProperties>
        <HorizontalRule />
        <Container>
          <MultiLineField id="validation-settingd" label="Validation settings">
            <AnswerValidation answer={answer} />
          </MultiLineField>
        </Container>
        {!disableMutuallyExclusive && (
          <ToggleWrapper data-test="toggle-wrapper" disabled={multipleAnswers}>
            <InlineField>
              <Label htmlFor="toggle-or-option">{`"Or" option`}</Label>
              <ToggleSwitch
                id="toggle-or-option-date"
                name="toggle-or-option-date"
                hideLabels={false}
                onChange={onChangeToggle}
                checked={getMutuallyExclusive(answer) && !multipleAnswers}
                data-test="toggle-or-option-date"
              />
            </InlineField>
          </ToggleWrapper>
        )}
        {getMutuallyExclusive(answer) && !multipleAnswers && (
          <StyledOption>
            <Flex>
              <DummyMultipleChoice type={CHECKBOX} />
              <OptionField>
                <Label htmlFor={`option-label-${answer.id}`}>{"Label"}</Label>
                <WrappingInput
                  id={`option-label-${answer.id}`}
                  name="label"
                  value={mutuallyExclusiveLabel}
                  placeholder={labelPlaceholder}
                  onChange={({ value }) => setMutuallyExclusiveLabel(value)}
                  onBlur={({ target: { value } }) => onUpdateOption(value)}
                  data-test="option-label"
                  data-autofocus={autoFocus || null}
                  bold
                />
              </OptionField>
            </Flex>
            <OptionField>
              <Label htmlFor={`option-description-${answer.id}`}>
                Description (optional)
              </Label>
              <WrappingInput
                id={`option-description-${answer.id}`}
                name="description"
                value={answer.description}
                placeholder={descriptionPlaceholder}
                onChange={onChange}
                onBlur={onUpdate}
                data-test="option-description"
              />
            </OptionField>
          </StyledOption>
        )}
      </AdvancedProperties>
    </>
  );
};

DateSingle.propTypes = {
  answer: propType(answerFragment),
  onChange: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  multipleAnswers: PropTypes.bool.isRequired,
  labelPlaceholder: PropTypes.string,
  autoFocus: PropTypes.bool,
  descriptionPlaceholder: PropTypes.string,
  disableMutuallyExclusive: PropTypes.bool,
};

DateSingle.defaultProps = {
  label: "Label",
  name: "label",
};

DateSingle.fragments = Date.fragments;

export default DateSingle;
