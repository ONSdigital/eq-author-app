import React from "react";
import styled from "styled-components";
import InlineField from "components/AnswerContent/Format/InlineField";
import ToggleSwitch from "components/buttons/ToggleSwitch";
import { Label, Select } from "components/Forms";

import PropTypes from "prop-types";
import { LIST_COLLECTOR_ERRORS } from "constants/validationMessages";
import { find, some } from "lodash";
import ValidationError from "components/ValidationError";

import { useQuery } from "@apollo/react-hooks";
import GET_LISTNAMES from "graphql/getListNames.graphql";

const ToggleWrapper = styled.div`
  margin: 0.7em 0 0 0;
  opacity: ${({ disabled }) => (disabled ? "0.6" : "1")};
  pointer-events: ${({ disabled }) => (disabled ? "none" : "auto")};
`;

const Paragraph = styled.p`
  margin: 0;
`;

const StyledInlineField = styled(InlineField)`
  padding: 0;
  margin: 0;
  margin-left: -0.2em;
`;

const StyledToggleSwitch = styled(ToggleSwitch)`
  margin: 0;
`;

const StyledSelect = styled(Select)`
  width: 15em;
`;

const renderErrors = (errors, field) => {
  const errorList = errors.filter((error) => error.field === field);
  return errorList.map((error, index) => (
    <ValidationError key={index}>
      {
        find(LIST_COLLECTOR_ERRORS, {
          errorCode: error.errorCode,
          field: error.field,
        }).message
      }
    </ValidationError>
  ));
};

const RepeatingLabelAndInput = (props) => {
  const { handleUpdate, answer, disabled } = props;
  const { id } = answer;

  const { data } = useQuery(GET_LISTNAMES, {
    fetchPolicy: "cache-and-network",
  });

  let listNames = [];

  if (data) {
    listNames = data.listNames || [];
  }

  return (
    <>
      <ToggleWrapper disabled={disabled}>
        <Label>Repeat label and input</Label>
        <Paragraph>
          Repeat this label and input for each answer added to the linked
          collection list. Each answer will be piped into a separate label.
        </Paragraph>

        <StyledInlineField
          id="repeat-label-and-input"
          htmlFor="repeat-label-and-input"
          label=""
        >
          <StyledToggleSwitch
            id="repeat-label-and-input-toggle"
            name="repeat-label-and-input-toggle"
            hideLabels={false}
            onChange={(target) => {
              handleUpdate({
                variables: {
                  input: {
                    id: id,
                    repeatingLabelAndInput: target.value,
                  },
                },
              });
            }}
            data-test="repeat-label-and-input-toggle"
            checked={answer.repeatingLabelAndInput}
            blockDisplay
          />
        </StyledInlineField>
      </ToggleWrapper>
      {answer?.repeatingLabelAndInput && (
        <>
          <Label>Linked collection list</Label>
          <StyledSelect
            name="listId"
            data-test="list-select"
            onChange={(target) => {
              handleUpdate({
                variables: {
                  input: {
                    id: id,
                    repeatingLabelAndInputListId: target.value,
                  },
                },
              });
            }}
            value={answer?.repeatingLabelAndInputListId}
            hasError={some(answer.validationErrorInfo.errors, {
              field: "repeatingLabelAndInputListId",
            })}
          >
            <option value="">Select a collection list</option>
            {listNames.map((list) => (
              <option key={list.id} value={list.id}>
                {list.displayName}
              </option>
            ))}
          </StyledSelect>
          {renderErrors(
            answer.validationErrorInfo.errors,
            "repeatingLabelAndInputListId"
          )}
        </>
      )}
    </>
  );
};

RepeatingLabelAndInput.propTypes = {
  handleUpdate: PropTypes.func.isRequired,
  answer: PropTypes.object, //eslint-disable-line
  disabled: PropTypes.bool,
};

export default RepeatingLabelAndInput;
