import React from "react";
import PropTypes from "prop-types";
import { Select } from "components/Forms";
import { map, groupBy } from "lodash";
import styled from "styled-components";
import Required from "components/AnswerContent/Required";
import * as durationTypes from "constants/duration-types";
import MultiLineField from "components/AnswerContent/Format/MultiLineField";

const StyledSelect = styled(Select)`
  width: 15em;
`;

const DurationProperties = ({
  answer,
  page,
  updateAnswer,
  updateAnswerOfType,
}) => {
  const sortedUnits = groupBy(durationTypes.durationConversion, "type");
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
      <MultiLineField label="Fields" id="duration">
        <StyledSelect
          onChange={({ value }) => onUpdateUnit(value)}
          value={answer.properties.unit}
          data-test="duration-select"
        >
          {map(sortedUnits, (unit, durationType) => {
            return (
              <optgroup label={durationType} key={durationType}>
                {map(unit, (durationConfig, key) => (
                  <option value={`${durationConfig.duration}`} key={key}>
                    {durationConfig.abbreviation}
                  </option>
                ))}
              </optgroup>
            );
          })}
        </StyledSelect>
      </MultiLineField>
      <Required answer={answer} updateAnswer={updateAnswer} />
    </>
  );
};

DurationProperties.propTypes = {
  answer: PropTypes.object, //eslint-disable-line
  page: PropTypes.object, //eslint-disable-line
  updateAnswer: PropTypes.func,
  updateAnswerOfType: PropTypes.func,
};

export default DurationProperties;
