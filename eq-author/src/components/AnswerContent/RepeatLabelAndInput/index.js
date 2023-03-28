import React, { useState } from "react";
import styled, { css } from "styled-components";
import InlineField from "components/AnswerContent/Format/InlineField";
import ToggleSwitch from "components/buttons/ToggleSwitch";
import { Label, Select } from "components/Forms";

import { LIST_COLLECTOR_ERRORS } from "constants/validationMessages";
import { find, some } from "lodash";
import ValidationError from "components/ValidationError";

import { useQuery } from "@apollo/react-hooks";
import COLLECTION_LISTS from "graphql/lists/collectionLists.graphql";

import Loading from "components/Loading";

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

  const { loading, data } = useQuery(COLLECTION_LISTS, {
    fetchPolicy: "cache-and-network",
  });

  if (loading) {
    return <Loading height="100%">Questionnaire lists loading…</Loading>;
  }
  let lists = [];

  if (data) {
    lists = data.collectionLists?.lists || [];
  }

  const handleChange = () => {
    setToggleStatus((prevToggleStatus) => !prevToggleStatus);
  };

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
            // value={mockList.listId}
            // hasError={some(page.validationErrorInfo.errors, {
            //   field: "listId",
            // })}
          >
            <option value="">Select list</option>
            {lists.map((list) => (
              <option key={list.id} value={list.id}>
                {list.displayName}
              </option>
            ))}
            <option value="newList">Create new list</option>
          </StyledSelect>
          {/* {renderErrors(page.validationErrorInfo.errors, "listId")} */}
        </>
      )}
    </>
  );
};

export default RepeatLabelAndInput;
