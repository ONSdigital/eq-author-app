import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import CustomPropTypes from "custom-prop-types";
import InlineField from "./InlineField";
import MultiLineField from "./MultiLineField";
import { ToggleProperty } from "./AnswerProperties/Properties";
import { SimpleSelect } from "components/Forms/Select";
import Collapsible from "components/Collapsible";
import ValidationError from "components/ValidationError";

import { colors } from "constants/theme";
import { SELECTION_REQUIRED } from "constants/validationMessages";

const Select = styled(SimpleSelect)`
  ${({ hasError }) => hasError && `border-color: ${colors.errorPrimary};`}
`;

const StyledInlineField = styled(InlineField)`
  margin-top: 0.75em;
`;

const StyledCollapsible = styled(Collapsible)`
  .collapsible-title {
    padding-top: 0;
  }
  .collapsible-toggle-Collapsible-Button {
    &::before {
      margin-top: 0;
    }
  }
`;

const FALLBACK_ERRORS = {
  ERR_VALID_REQUIRED_START: SELECTION_REQUIRED,
  ERR_VALID_REQUIRED_END: SELECTION_REQUIRED,
};

const fallbackSelects = ({ label, secondaryLabel }) => [
  {
    id: "start-id",
    label,
    name: "start",
  },
  {
    id: "end-id",
    label: secondaryLabel,
    name: "end",
  },
];

export const Fallback = ({
  metadata,
  answer: { properties, type, validationErrorInfo, label, secondaryLabel },
  onChange,
}) => {
  return (
    <>
      <StyledInlineField id={"fallback-label"} label={"Fallback"}>
        <ToggleProperty
          id={"fallback-label"}
          value={properties?.fallback?.enabled ?? false}
          onChange={({ value }) =>
            onChange(type, {
              fallback: { ...properties.fallback, enabled: value },
            })
          }
        />
      </StyledInlineField>
      {properties?.fallback?.enabled
        ? fallbackSelects({ label, secondaryLabel }).map(
            ({ id, label, name }) => {
              const { errorCode } =
                validationErrorInfo?.errors.find(({ errorCode }) =>
                  errorCode.toLowerCase().includes(name)
                ) ?? false;
              return (
                <MultiLineField
                  id={id}
                  key={id}
                  label={label ? label : "Untitled answer"}
                >
                  <Select
                    data-test="fallback-select"
                    value={properties.fallback[name] || ""}
                    onChange={({ target }) =>
                      onChange(type, {
                        fallback: {
                          ...properties.fallback,
                          [name]: target.value,
                        },
                      })
                    }
                    hasError={errorCode}
                  >
                    {!properties.fallback[name] && (
                      <option value="">Select metadata</option>
                    )}
                    {metadata &&
                      metadata
                        .filter(({ type }) => type === "Date")
                        .map(({ id, displayName, key }) => {
                          return (
                            <option key={id} value={key}>
                              {displayName}
                            </option>
                          );
                        })}
                  </Select>
                  {errorCode ? (
                    <ValidationError>
                      {FALLBACK_ERRORS[errorCode]}
                    </ValidationError>
                  ) : null}
                </MultiLineField>
              );
            }
          )
        : null}
      <StyledCollapsible title="What is a fallback value?">
        <p>
          If this date range answer is piped into later questions, you can
          choose a fallback metadata value to be piped in its place if the
          respondent doesn&apos;t answer this question.
        </p>
      </StyledCollapsible>
    </>
  );
};

Fallback.propTypes = {
  metadata: PropTypes.arrayOf(CustomPropTypes.metadata).isRequired,
  answer: CustomPropTypes.answer.isRequired,
  onChange: PropTypes.func.isRequired,
};
