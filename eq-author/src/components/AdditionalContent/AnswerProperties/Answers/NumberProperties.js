import React from "react";
import PropTypes from "prop-types";
import { flatMap } from "lodash";
import { groupBy, getOr } from "lodash/fp";
import { useMutation } from "@apollo/react-hooks";
import styled from "styled-components";

import { UNIT } from "constants/answer-types";
import {
  characterErrors,
  SELECTION_REQUIRED,
} from "constants/validationMessages";
import { unitConversion } from "constants/unit-types";
import { colors } from "constants/theme";

import Collapsible from "components/Collapsible";
import { Autocomplete } from "components/Autocomplete";
import Required from "components/AdditionalContent/Required";
import ValidationError from "components/ValidationError";
import InlineField from "components/AdditionalContent/AnswerProperties/Format/InlineField";
import Decimal from "components/AdditionalContent/AnswerProperties/Decimal";
import { Label } from "components/Forms";

import AnswerValidation from "App/page/Design/Validation/AnswerValidation";

import updateAnswersOfTypeMutation from "graphql/updateAnswersOfType.graphql";

const Container = styled.div`
  display: flex;
  align-items: center;
`;

const HorizontalRule = styled.hr`
  margin: 1em 0 1.5em 0;
`;

const VerticalRule = styled.div`
  width: 1px;
  height: 2.5em;
  background-color: ${colors.grey};
  margin: 0 1.4em 0 0.5em;
`;

const StyledAutocomplete = styled(Autocomplete)`
  width: 15em;
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
  handleDecimalChange,
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

  const errorCount = answer.validationErrorInfo.errors.filter(
    ({ type, field }) => {
      if (type === "validation") {
        return true;
      }

      if (type === "answer" && field === "unit") {
        return true;
      }

      return false;
    }
  ).length;

  return (
    <Collapsible
      title={`${answer.type} properties`}
      withoutHideThis
      variant="properties"
      errorCount={errorCount}
    >
      <Container>
        <Required answer={answer} onChange={handleChange} getId={getId} />
        <VerticalRule />
        <InlineField id={id} label={"Decimals"}>
          <Decimal
            id={answer.id}
            answer={answer}
            data-test="decimals"
            onBlur={handleDecimalChange}
            value={answer.properties.decimals}
            hasDecimalInconsistency={hasDecimalInconsistency}
          />
        </InlineField>
      </Container>
      <HorizontalRule />
      {answer.type === UNIT && (
        <>
          <Label id="unit">Unit type</Label>
          <StyledAutocomplete
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
          {hasUnitError && (
            <ValidationError test="unitRequired">
              {SELECTION_REQUIRED}
            </ValidationError>
          )}
        </>
      )}
      <Label>Validation settings</Label>
      {hasDecimalInconsistency && (
        <ValidationError>
          {characterErrors.DECIMAL_MUST_BE_SAME}
        </ValidationError>
      )}
      <AnswerValidation answer={answer} />
    </Collapsible>
  );
};

NumberProperties.propTypes = {
  hasDecimalInconsistency: PropTypes.bool,
  handleChange: PropTypes.func,
  handleDecimalChange: PropTypes.func,
  answer: PropTypes.object, //eslint-disable-line
  page: PropTypes.object, //eslint-disable-line
  getId: PropTypes.func,
};

export default NumberProperties;
