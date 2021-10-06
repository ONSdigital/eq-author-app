import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import styled from "styled-components";
import { colors, radius } from "constants/theme";
import { Field, Label } from "components/Forms";
import WrappingInput from "components/Forms/WrappingInput";
import withEntityEditor from "components/withEntityEditor";
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
import messageTemplate, {
  MISSING_LABEL,
  ADDITIONAL_LABEL_MISSING,
  buildLabelError,
} from "constants/validationMessages";

import UPDATE_OPTION_MUTATION from "graphql/updateOption.graphql";

const ENTER_KEY = 13;

export const ButtonsContainer = styled.div`
  position: absolute;
  left: 10px;
  top: 0;
  display: flex;
  z-index: 2;
  justify-content: flex-start;
`;

export const Flex = styled.div`
  display: flex;
  align-items: flex-start;
  margin-top: 1.5em;
`;

export const OptionField = styled(Field)`
  margin-bottom: 1.5em;
`;

export const LastOptionField = styled(OptionField)`
  margin-bottom: 2.5em;
`;

export const StyledOption = styled.div`
  border: 1px solid ${colors.bordersLight};
  padding: 1em 1em 0;
  padding-bottom: ${(option) => option?.additionalAnswer && "1em"};
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

export const StatelessOption = ({
  option,
  onChange,
  onUpdate,
  onDelete,
  onEnterKey,
  hasDeleteButton,
  type,
  labelPlaceholder = "",
  descriptionPlaceholder,
  autoFocus = true,
  label,
  canMoveUp,
  onMoveUp,
  canMoveDown,
  onMoveDown,
  hideMoveButtons,
}) => {
  const [otherLabelValue, setOtherLabelValue] = useState(
    option?.additionalAnswer?.label ?? ""
  );
  const [updateOption] = useMutation(UPDATE_OPTION_MUTATION);

  const handleDeleteClick = () => onDelete(option.id);
  const handleKeyDown = (e) => {
    if (e.keyCode === ENTER_KEY) {
      onEnterKey(e);
    }
  };
  const handleSaveOtherLabel = () =>
    updateOption({
      variables: {
        input: {
          id: option.id,
          additionalAnswer: {
            id: option.additionalAnswer.id,
            label: otherLabelValue,
          },
        },
      },
    });

  const renderToolbar = () => {
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
                tabIndex={!canMoveUp && -1}
                aria-label={"Move option up"}
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
                tabIndex={!canMoveDown && -1}
                aria-label={"Move option down"}
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
              onClick={handleDeleteClick}
              data-test="btn-delete-option"
              disabled={!hasDeleteButton}
              tabIndex={!hasDeleteButton && -1}
            />
          </Tooltip>
        )}
      </ButtonsContainer>
    );
  };

  const { ERR_UNIQUE_REQUIRED } = messageTemplate;

  const errorMsg = buildLabelError(MISSING_LABEL, `${lowerCase(type)}`, 8, 7);
  const uniqueErrorMsg = ERR_UNIQUE_REQUIRED({ label: "Option label" });
  let labelError = "";

  if (
    option.validationErrorInfo?.errors?.find(
      ({ errorCode }) => errorCode === "ERR_VALID_REQUIRED"
    )
  ) {
    labelError = errorMsg;
  } else if (
    option.validationErrorInfo?.errors?.find(
      ({ errorCode }) => errorCode === "ERR_UNIQUE_REQUIRED"
    )
  ) {
    labelError = uniqueErrorMsg;
  }

  const otherLabelError =
    option.additionalAnswer?.validationErrorInfo?.errors?.find(
      ({ errorCode }) => errorCode === "ADDITIONAL_LABEL_MISSING"
    ) && ADDITIONAL_LABEL_MISSING;

  return (
    <StyledOption id={getIdForObject(option)} key={option.id}>
      <div>
        {renderToolbar()}
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
              onKeyDown={handleKeyDown}
              data-test="option-label"
              data-autofocus={autoFocus || null}
              bold
              errorValidationMsg={labelError}
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
            value={option.description}
            placeholder={descriptionPlaceholder}
            onChange={onChange}
            onBlur={onUpdate}
            onKeyDown={handleKeyDown}
            data-test="option-description"
          />
        </OptionField>
        {option.additionalAnswer && (
          <LastOptionField>
            <Label htmlFor={`option-otherLabel-${option.additionalAnswer.id}`}>
              Other Label
            </Label>
            <WrappingInput
              id={`option-otherLabel-${option.additionalAnswer.id}`}
              name="otherLabel"
              value={otherLabelValue}
              onChange={({ value }) => setOtherLabelValue(value)}
              onBlur={handleSaveOtherLabel}
              onKeyDown={handleKeyDown}
              data-test="other-answer"
              errorValidationMsg={otherLabelError}
            />
          </LastOptionField>
        )}
      </div>
    </StyledOption>
  );
};

StatelessOption.propTypes = {
  option: CustomPropTypes.option.isRequired,
  onChange: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onEnterKey: PropTypes.func,
  hasDeleteButton: PropTypes.bool.isRequired,
  type: PropTypes.oneOf([RADIO, CHECKBOX]).isRequired,
  labelPlaceholder: PropTypes.string,
  descriptionPlaceholder: PropTypes.string,
  autoFocus: PropTypes.bool,
  label: PropTypes.string,
  canMoveUp: PropTypes.bool,
  onMoveUp: PropTypes.func,
  canMoveDown: PropTypes.bool,
  onMoveDown: PropTypes.func,
  hideMoveButtons: PropTypes.bool,
};

StatelessOption.fragments = {
  Option: optionFragment,
};

export default flowRight(withEntityEditor("option"))(StatelessOption);
