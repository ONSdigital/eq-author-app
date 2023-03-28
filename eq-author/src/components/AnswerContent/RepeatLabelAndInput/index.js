import React, { useState } from "react";
import styled, { css } from "styled-components";
import InlineField from "components/AnswerContent/Format/InlineField";
import ToggleSwitch from "components/buttons/ToggleSwitch";
import { Label, Select } from "components/Forms";

import { LIST_COLLECTOR_ERRORS } from "constants/validationMessages";
import { find, some } from "lodash";
import ValidationError from "components/ValidationError";

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
`;

const StyledToggleSwitch = styled(ToggleSwitch)`
  margin: 0;
`;

const StyledSelect = styled(Select)`
  width: 15em;
`;

const RepeatLabelAndInput = () => {
  const [toggleStatus, setToggleStatus] = useState(false);

  const handleChange = () => {
    setToggleStatus((prevToggleStatus) => !prevToggleStatus);
  };

  const mockList = [
    { id: 1, displayName: "Minnesota TimberWolves" },
    { id: 2, displayName: "Memphis Grizzlies" },
    { id: 3, displayName: "Dallas Mavericks" },
  ];

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
  const page = {
    __typename: "Page",
    id: "1",
    displayName: "Question",
    position: 1,
    title: "List Names",
    alias: "Who am I?",
    drivingQuestion: "",
    pageDescription: "",
    additionalGuidancePanelSwitch: false,
    additionalGuidancePanel: "",
    drivingPositive: "Yes",
    drivingNegative: "No",
    drivingPositiveDescription: "",
    drivingNegativeDescription: "",
    anotherNegativeDescription: "",
    anotherPositiveDescription: "",
    addItemTitle: "What are the names of everyone who live at ?",
    anotherTitle: "Does anyone live at  as their permanent or family home?",
    pageType: "ListCollectorPage",
    anotherPositive: "Yes",
    listId: "list1",
    anotherNegative: "No",
    validationErrorInfo: {
      totalCount: 0,
      errors: [],
      id: "1",
      __typename: "ValidationErrorInfo",
    },
    answers: [
      {
        __typename: "BasicAnswer",
        id: "1",
        title: "First name",
        description: "",
        type: "TextField",
      },
      {
        __typename: "BasicAnswer",
        id: "2",
        title: "Last name",
        description: "",
        type: "TextField",
      },
    ],
    section: { id: "3", questionnaire: { id: "1", metadata: [] } },
  };

  return (
    <>
      <ToggleWrapper>
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
            onChange={handleChange}
            data-test="repeat-label-and-input-toggle"
            checked={toggleStatus}
            blockDisplay
          />
        </StyledInlineField>
      </ToggleWrapper>
      {toggleStatus && (
        <>
          <Label>Linked collection list</Label>
          <StyledSelect
            name="listId"
            data-test="list-select"
            onChange={() => {}}
            value={mockList.listId}
            hasError={some(page.validationErrorInfo.errors, {
              field: "listId",
            })}
          >
            <option value="">Select list</option>
            {mockList.map((list) => (
              <option key={list.id} value={list.id}>
                {list.displayName}
              </option>
            ))}
            <option value="newList">Create new list</option>
          </StyledSelect>
          {renderErrors(page.validationErrorInfo.errors, "listId")}
        </>
      )}
    </>
  );
};

export default RepeatLabelAndInput;
