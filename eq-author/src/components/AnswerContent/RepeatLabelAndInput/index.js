import React, { useState } from "react";
import styled, { css } from "styled-components";
import InlineField from "components/AnswerContent/Format/InlineField";
import ToggleSwitch from "components/buttons/ToggleSwitch";
import { Label } from "components/Forms";
import Icon from "assets/icon-select.svg";
import { colors } from "constants/theme";

import { some } from "lodash";

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
const errorCSS = css`
  ${({ hasError }) =>
    hasError &&
    css`
      border-color: ${colors.errorPrimary};
      &:focus,
      &:focus-within {
        border-color: ${colors.errorPrimary};
        outline-color: ${colors.errorPrimary};
        box-shadow: 0 0 0 2px ${colors.errorPrimary};
      }
      &:hover {
        border-color: ${colors.errorPrimary};
        outline-color: ${colors.errorPrimary};
      }
    `}
`;

const CustomSelect = styled.select`
  font-size: 1em;
  border: 2px solid #d6d8da;
  border-radius: 4px;
  appearance: none;
  background: white url("${Icon}") no-repeat right center;
  position: relative;
  transition: opacity 100ms ease-in-out;
  border-radius: 4px;
  padding: 0.3em 1.5em 0.3em 0.3em;
  color: #222222;
  display: block;
  min-width: 30%;
  ${errorCSS}

  &:hover {
    outline: none;
  }
`;

const RepeatLabelAndInput = (props) => {
  const { page } = props;
  const [toggleStatus, setToggleStatus] = useState(false);

  const handleChange = () => {
    setToggleStatus((prevToggleStatus) => !prevToggleStatus);
  };

  const mockList = [
    { id: 1, displayName: "Minnesota TimberWolves" },
    { id: 2, displayName: "Memphis Grizzlies" },
    { id: 3, displayName: "Dallas Mavericks" },
  ];

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
          <CustomSelect
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
          </CustomSelect>
        </>
      )}
    </>
  );
};

export default RepeatLabelAndInput;
