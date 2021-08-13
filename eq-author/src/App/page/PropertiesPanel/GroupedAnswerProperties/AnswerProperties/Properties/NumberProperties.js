import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { flatMap } from "lodash";
import { groupBy, getOr } from "lodash/fp";
import { useMutation } from "@apollo/react-hooks";

import { colors } from "constants/theme";
import { UNIT } from "constants/answer-types";
import {
  characterErrors,
  SELECTION_REQUIRED,
} from "constants/validationMessages";
import { unitConversion } from "constants/unit-types";

import { Column } from "components/Grid";
import Collapsible from "components/Collapsible";
import IconText from "components/IconText";
import { Autocomplete } from "components/Autocomplete";

import { ToggleProperty } from "../Properties";

import ValidationErrorIcon from "../../validation-warning-icon.svg?inline";
import InlineField from "../../InlineField";
import MultiLineField from "../../MultiLineField";
import Decimal from "../../Decimal";

import AnswerValidation from "App/page/Design/Validation/AnswerValidation";

import updateAnswersOfTypeMutation from "graphql/updateAnswersOfType.graphql";

const ValidationWarning = styled(IconText)`
  color: ${colors.red};
  margin-top: 0.5em;
  justify-content: normal;
`;

const ValidationWarningUnit = styled(ValidationWarning)`
  margin-top: -0.5em;
`;

const filterCondition = (x, query) =>
  x.unit.toLowerCase().includes(query.toLowerCase().trim()) ||
  x.abbreviation.toLowerCase().includes(query.toLowerCase().trim()) ||
  x.type.toLowerCase().includes(query.toLowerCase().trim()) ||
  query.toLowerCase().trim().startsWith(x.unit.toLowerCase()) ||
  query.toLowerCase().trim().startsWith(x.abbreviation.toLowerCase());

const filterUnitOptions = (options, query) => {
  const common = Object.values(options)
    .filter((x) => filterCondition(x, query))
    .map((option, index) => (
      <span key={`unit-option-${index}`} value={option.unit}>
        {option.unit} <span aria-hidden="true">({option.abbreviation})</span>
      </span>
    ));
  if (!query.length) {
    const categorized = flatMap(
      groupBy("type", unitConversion),
      (item, index) => [index, ...item]
    );
    const categories = categorized.map((option, index) =>
      typeof option === "string" ? (
        <span category="true">{option}</span>
      ) : (
        <span key={`unit-option-${index}`} value={option.unit}>
          {option.unit} <span aria-hidden="true">({option.abbreviation})</span>
        </span>
      )
    );
    return [common, categories];
  }

  return [common];
};

const NumberProperties = ({
  answer,
  hasDecimalInconsistency,
  handleChange,
  page,
  getId,
}) => {
  const id = getId("required", answer.id);

  const hasUnitError = getOr([], "validationErrorInfo.errors", page)
    .map(({ field }) => field)
    .includes("unit");

  const handleUnitChange = (type, properties) => {
    updateAnswersOfType({
      variables: { input: { type, questionPageId: page.id, properties } },
    });
  };

  const [updateAnswersOfType] = useMutation(updateAnswersOfTypeMutation);

  return (
    <Collapsible
      title={`${answer.type} properties`}
      withoutHideThis
      variant="content"
    >
      <Column cols={3} gutters>
        <InlineField id={id} label={"Required"}>
          <ToggleProperty
            data-test="answer-properties-required-toggle"
            id={id}
            onChange={handleChange}
            value={answer.properties.required}
          />
        </InlineField>
      </Column>
      <Column cols={6} gutters={false}>
        <InlineField id={id} label={"Decimals"}>
          <Decimal
            id={id}
            data-test="decimals"
            onBlur={(decimals) => {
              handleChange(answer.type, {
                decimals,
              });
            }}
            value={answer.properties.decimals}
            hasDecimalInconsistency={hasDecimalInconsistency}
          />
        </InlineField>
        {answer.type === UNIT && (
          <>
            <MultiLineField id="unit" label={"Type"}>
              <Autocomplete
                options={unitConversion}
                filter={filterUnitOptions}
                placeholder={"Select a unit type"}
                updateOption={(element) => {
                  handleUnitChange(answer.type, {
                    unit: element && element.children[0]?.getAttribute("value"),
                  });
                }}
                hasError={hasUnitError}
                defaultValue={
                  answer.properties.unit
                    ? `${answer.properties.unit} (${
                        unitConversion[answer.properties.unit].abbreviation
                      })`
                    : ""
                }
              />
            </MultiLineField>
            {hasUnitError && (
              <ValidationWarningUnit
                icon={ValidationErrorIcon}
                data-test="unitRequired"
              >
                {SELECTION_REQUIRED}
              </ValidationWarningUnit>
            )}
          </>
        )}
      </Column>
      {hasDecimalInconsistency && (
        <ValidationWarning icon={ValidationErrorIcon}>
          {characterErrors.DECIMAL_MUST_BE_SAME}
        </ValidationWarning>
      )}
      <AnswerValidation answer={answer} />
    </Collapsible>
  );
};

NumberProperties.propTypes = {
  hasDecimalInconsistency: PropTypes.bool,
  handleChange: PropTypes.func,
  answer: PropTypes.object, //eslint-disable-line
  page: PropTypes.object, //eslint-disable-line
  getId: PropTypes.func,
};

export default NumberProperties;
