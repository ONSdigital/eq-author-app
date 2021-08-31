import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import CustomPropTypes from "custom-prop-types";
import styled from "styled-components";
import { Field, Label } from "components/Forms";
import ToggleSwitch from "components/buttons/ToggleSwitch";
import DummyMultipleChoice from "App/page/Design/answers/dummy/MultipleChoice";
import { colors, radius } from "constants/theme";
import { MISSING_LABEL } from "constants/validationMessages";
import { CHECKBOX } from "constants/answer-types";
import InlineField from "components/AnswerContent/Format/InlineField";
import WrappingInput from "components/Forms/WrappingInput";

const ToggleWrapper = styled.div`
  opacity: ${({ disabled }) => (disabled ? "0.6" : "1")};
  pointer-events: ${({ disabled }) => (disabled ? "none" : "auto")};
`;

export const StyledOption = styled.div`
  border: 1px solid ${colors.bordersLight};
  padding: 0 1em;
  border-radius: ${radius};
  position: relative;
  margin-bottom: 1em;
`;

export const Flex = styled.div`
  display: flex;
  align-items: flex-start;
  margin-top: 0.75em;
`;

export const OptionField = styled(Field)`
  margin-bottom: 1em;
`;

const MutuallyExclusive = ({
  answer,
  disabled,
  createMutuallyExclusive,
  updateOption,
  deleteOption,
  autoFocus,
}) => {
  const [mutuallyExclusiveLabel, setMutuallyExclusiveLabel] = useState("");
  const [mutuallyExclusiveDesc, setMutuallyExclusiveDesc] = useState("");
  useEffect(() => {
    setMutuallyExclusiveLabel(answer.options?.[0].label ?? "");
    setMutuallyExclusiveDesc(answer.options?.[0].description ?? "");
  }, [answer]);

  const onChangeToggle = () => {
    if (!answer.options) {
      createMutuallyExclusive({
        variables: { input: { answerId: answer.id, label: "" } },
      });
    } else {
      deleteOption({ variables: { input: { id: answer.options?.[0].id } } });
    }
  };

  const onUpdateOption = (label) => {
    updateOption({
      variables: { input: { id: answer.options?.[0].id, label } },
    });
  };

  const onUpdateOptionDesc = (description) => {
    updateOption({
      variables: { input: { id: answer.options?.[0].id, description } },
    });
  };

  return (
    <>
      <ToggleWrapper data-test="toggle-wrapper" disabled={disabled}>
        <InlineField
          id="toggle-or-option"
          htmlFor="toggle-or-option"
          label={`"Or" option`}
        >
          <ToggleSwitch
            id="toggle-or-option"
            name="toggle-or-option"
            hideLabels={false}
            onChange={onChangeToggle}
            checked={Boolean(answer.options)}
            data-test="toggle-or-option"
          />
        </InlineField>
      </ToggleWrapper>
      {answer.options && (
        <StyledOption>
          <Flex>
            <DummyMultipleChoice type={CHECKBOX} />
            <OptionField>
              <Label htmlFor={`option-label-${answer.id}`}>{"Label"}</Label>
              <WrappingInput
                id={`option-label-${answer.id}`}
                name="label"
                value={mutuallyExclusiveLabel}
                placeholder={""}
                onChange={({ value }) => setMutuallyExclusiveLabel(value)}
                onBlur={({ target: { value } }) => onUpdateOption(value)}
                data-test="option-label"
                data-autofocus={autoFocus || null}
                bold
                errorValidationMsg={
                  mutuallyExclusiveLabel === "" ? MISSING_LABEL : ""
                }
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
              value={mutuallyExclusiveDesc}
              placeholder={""}
              onChange={({ value }) => setMutuallyExclusiveDesc(value)}
              onBlur={({ target: { value } }) => onUpdateOptionDesc(value)}
              data-test="option-description"
            />
          </OptionField>
        </StyledOption>
      )}
    </>
  );
};

MutuallyExclusive.propTypes = {
  answer: CustomPropTypes.answer.isRequired,
  disabled: PropTypes.bool.isRequired,
  createMutuallyExclusive: PropTypes.func,
  updateOption: PropTypes.func,
  deleteOption: PropTypes.func,
  autoFocus: PropTypes.bool,
};

export default MutuallyExclusive;
