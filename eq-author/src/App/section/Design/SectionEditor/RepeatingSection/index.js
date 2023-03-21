import React from "react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";
import { Field, Label } from "components/Forms";
import { useQuery } from "@apollo/react-hooks";
import COLLECTION_LISTS from "graphql/lists/collectionLists.graphql";
import Icon from "assets/icon-select.svg";
import Loading from "components/Loading";
import { find, some } from "lodash";
import { colors } from "constants/theme";
import { LIST_COLLECTOR_ERRORS } from "constants/validationMessages";
import ValidationError from "components/ValidationError";
import CustomPropTypes from "custom-prop-types";

import ToggleSwitch from "components/buttons/ToggleSwitch";

const InlineField = styled(Field)`
  display: flex;
  align-items: center;
  margin-bottom: 0.4rem;
  margin-left: 0;
  pointer-events: ${({ disabled }) => (disabled ? "none" : "auto")};
`;

const ToggleWrapper = styled.div`
  display: flex;
  margin-top: -0.3em;
`;

const Caption = styled.p`
  margin-top: 0.3rem;
  margin-bottom: 1.5rem;
  margin-left: 0;
  font-size: 0.85em;
`;

const SummaryLabel = styled.label`
  margin-top: 0s;
  margin-bottom: 1.5rem;
  margin-left: 0;
  font-weight: bold;
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
  margin-bottom: 1rem;
  ${errorCSS}

  &:hover {
    outline: none;
  }
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

const RepeatingSection = ({ section, handleUpdate }) => {
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

  return (
    <>
      <SummaryLabel>Repeating section</SummaryLabel>
      <Caption>
        When repeating sections are linked to a collection list, each selected
        item from the list forms a section on the Hub. The repeating section is
        used to ask the same questions for each item selected.
      </Caption>
      <InlineField disabled={!section.allowRepeatingSection}>
        <Label htmlFor="repeating-section">Repeating section</Label>
        <ToggleWrapper>
          <ToggleSwitch
            id="repeatingSection"
            name="repeatingSection"
            data-test="repeating-section"
            hideLabels={false}
            onChange={handleUpdate}
            checked={section?.repeatingSection}
          />
        </ToggleWrapper>
      </InlineField>
      {section?.repeatingSection && (
        <>
          <Label htmlFor="repeatingSectionListId">Linked collection list</Label>
          <CustomSelect
            id="repeatingSectionListId"
            name="repeatingSectionListId"
            data-test="list-select"
            onChange={({ target }) => {
              handleUpdate({
                name: "repeatingSectionListId",
                value: target.value,
              });
            }}
            value={section?.repeatingSectionListId}
            hasError={some(section.validationErrorInfo.errors, {
              field: "repeatingSectionListId",
            })}
          >
            <option value="">Select list</option>
            {lists.map((list) => (
              <option key={list.id} value={list.id}>
                {list.displayName}
              </option>
            ))}
          </CustomSelect>
          {renderErrors(
            section.validationErrorInfo.errors,
            "repeatingSectionListId"
          )}
        </>
      )}
    </>
  );
};

RepeatingSection.propTypes = {
  section: CustomPropTypes.section,
  handleUpdate: PropTypes.func,
};

export default RepeatingSection;
