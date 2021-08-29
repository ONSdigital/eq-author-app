import React from "react";
import PropTypes from "prop-types";
import { Select } from "components/Forms";
import { map, groupBy } from "lodash";
import styled from "styled-components";
import Required from "components/AnswerContent/Required";

import * as durationTypes from "constants/duration-types";

import MultiLineField from "components/AnswerContent/AnswerProperties/Format/MultiLineField";

const StyledSelect = styled(Select)`
  width: 15em;
`;

const DurationProperties = ({ answer, updateAnswer, onUpdateUnit }) => {
  const sortedUnits = groupBy(durationTypes.durationConversion, "type");

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
                {map(unit, (durationConfig, key) => {
                  const optionLabel = durationConfig.abbreviation;
                  return (
                    <option value={`${durationConfig.duration}`} key={key}>
                      {optionLabel}
                    </option>
                  );
                })}
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
  updateAnswer: PropTypes.func,
  onUpdateUnit: PropTypes.func,
};

export default DurationProperties;
