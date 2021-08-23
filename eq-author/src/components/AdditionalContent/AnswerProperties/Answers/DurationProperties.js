import React from "react";
import PropTypes from "prop-types";
import { Select } from "components/Forms";
import { map, groupBy } from "lodash";
import styled from "styled-components";

import Collapsible from "components/Collapsible";
import Required from "components/AdditionalContent/Required";

import * as durationTypes from "constants/duration-types";

import MultiLineField from "components/AdditionalContent/AnswerProperties/Format/MultiLineField";

const StyledSelect = styled(Select)`
  width: 15em;
`;

const HorizontalRule = styled.hr`
  margin: 1em 0 1em 0;
`;

const DurationProperties = ({
  answer,
  unit,
  getId,
  handleRequiredChange,
  onChange,
  ...otherProps
}) => {
  const sortedUnits = groupBy(durationTypes.durationConversion, "type");

  return (
    <Collapsible
      variant="properties"
      title="Duration properties"
      withoutHideThis
    >
      <Required answer={answer} onChange={handleRequiredChange} getId={getId} />
      <HorizontalRule />
      <MultiLineField label="Fields" id={getId("duration", answer.id)}>
        <StyledSelect
          onChange={onChange}
          value={unit}
          {...otherProps}
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
    </Collapsible>
  );
};

DurationProperties.propTypes = {
  answer: PropTypes.object, //eslint-disable-line
  unit: PropTypes.string.isRequired,
  getId: PropTypes.func,
  handleRequiredChange: PropTypes.func,
  onChange: PropTypes.func,
};

export default DurationProperties;
