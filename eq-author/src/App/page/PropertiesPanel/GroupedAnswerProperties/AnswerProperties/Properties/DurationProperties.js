import React from "react";
import PropTypes from "prop-types";
import { Select } from "components/Forms";
import { map, groupBy } from "lodash";

import Collapsible from "components/Collapsible";

import * as durationTypes from "constants/duration-types";

import MultiLineField from "../../MultiLineField";
import InlineField from "../../InlineField";
import { ToggleProperty } from "../Properties";

const DurationProperties = ({
  answer,
  unit,
  getId,
  onChange,
  ...otherProps
}) => {
  const sortedUnits = groupBy(durationTypes.durationConversion, "type");

  const id = getId("duration", answer.id);
  return (
    <Collapsible variant="content" title="Duration properties" withoutHideThis>
      <InlineField id={id} label={"Required"}>
        <ToggleProperty
          data-test="answer-properties-required-toggle"
          id={id}
          onChange={onChange}
          value={answer.properties.required}
        />
      </InlineField>
      <MultiLineField label="Fields" id={getId("duration", answer.id)}>
        <Select value={unit} {...otherProps} data-test="duration-select">
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
        </Select>
      </MultiLineField>
    </Collapsible>
  );
};

DurationProperties.propTypes = {
  answer: PropTypes.object, //eslint-disable-line
  unit: PropTypes.string.isRequired,
  getId: PropTypes.func,
  onChange: PropTypes.func,
};

export default DurationProperties;
