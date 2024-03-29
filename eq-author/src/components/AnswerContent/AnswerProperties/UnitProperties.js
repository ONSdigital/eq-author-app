import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import MultiLineField from "components/AnswerContent/Format/MultiLineField";
import Decimal from "components/AnswerContent/Decimal";
import Required from "components/AnswerContent/Required";
import { Autocomplete } from "components/Autocomplete";
import { unitConversion } from "constants/unit-types";
import { flatMap, filter } from "lodash";
import { groupBy } from "lodash/fp";
import { unitPropertyErrors } from "constants/validationMessages";
import ValidationError from "components/ValidationError";

const Paragraph = styled.p`
  margin-top: 0em;
  margin-bottom: 0.5em;
`;

const Container = styled.div`
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

const UnitProperties = ({
  answer,
  page,
  updateAnswer,
  updateAnswerOfType,
  hasMutuallyExclusiveAnswer,
}) => {
  const errors = filter(answer.validationErrorInfo.errors, { field: "unit" });
  const onUpdateUnit = (value) => {
    updateAnswerOfType({
      variables: {
        input: {
          type: answer.type,
          questionPageId: page.id,
          properties: { ...answer.properties, unit: value },
        },
      },
    });
  };
  return (
    <>
      <Container>
        <MultiLineField id="unit" label={"Unit type"}>
          <Autocomplete
            options={unitConversion}
            filter={filterUnitOptions}
            placeholder={"Select a unit type"}
            updateOption={(element) => {
              onUpdateUnit(
                element && element.children[0]?.getAttribute("value")
              );
            }}
            hasError={errors.length > 0}
            defaultValue={
              answer.properties.unit
                ? `${answer.properties.unit} (${
                    unitConversion[answer.properties.unit].abbreviation
                  })`
                : ""
            }
          />
        </MultiLineField>
      </Container>
      {errors.length !== 0 && (
        <ValidationError>
          {unitPropertyErrors[errors[0].errorCode].message}
        </ValidationError>
      )}
      <MultiLineField
        id={`${answer.id}-decimals`}
        label="Maximum number of decimal places"
      >
        <Paragraph>
          Must be between 0 and 6. For example, 2 to allow numbers such as 1.11
        </Paragraph>
        <Decimal
          id="decimals"
          answer={answer}
          page={page}
          data-test="decimals"
          updateAnswerOfType={updateAnswerOfType}
          value={answer.properties.decimals}
        />
      </MultiLineField>
      <Required
        answer={answer}
        updateAnswer={updateAnswer}
        hasMutuallyExclusiveAnswer={hasMutuallyExclusiveAnswer}
      />
    </>
  );
};

UnitProperties.propTypes = {
  answer: PropTypes.object, //eslint-disable-line
  page: PropTypes.object, //eslint-disable-line
  updateAnswer: PropTypes.func,
  updateAnswerOfType: PropTypes.func,
  hasMutuallyExclusiveAnswer: PropTypes.bool,
};

export default UnitProperties;
