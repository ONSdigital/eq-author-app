import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import MultiLineField from "components/AdditionalContent/AnswerProperties/Format/MultiLineField";
import Decimal from "components/AdditionalContent/AnswerProperties/Decimal";
import Required from "components/AdditionalContent/Required";
import { Autocomplete } from "components/Autocomplete";
import { unitConversion } from "constants/unit-types";
import { flatMap } from "lodash";
import { groupBy } from "lodash/fp";

const Container = styled.div`
  display: flex;
  align-items: center;
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
  onUpdateUnit,
  onUpdateDecimal,
  onUpdateRequired,
}) => {
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
            hasError={false}
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
      <Container>
        <MultiLineField id="decimal" htmlFor="decimal" label="Decimal places">
          <Decimal
            id={answer.id}
            answer={answer}
            data-test="decimals"
            onBlur={onUpdateDecimal}
            value={answer.properties.decimals}
            hasDecimalInconsistency={false}
          />
        </MultiLineField>
      </Container>
      <Container>
        <Required answer={answer} onChange={onUpdateRequired} />
      </Container>
    </>
  );
};

UnitProperties.propTypes = {
  answer: PropTypes.object, //eslint-disable-line
  onUpdateUnit: PropTypes.func,
  onUpdateDecimal: PropTypes.func,
  onUpdateRequired: PropTypes.func,
};

export default UnitProperties;
