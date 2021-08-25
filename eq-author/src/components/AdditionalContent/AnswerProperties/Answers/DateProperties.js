import React from "react";
import PropTypes from "prop-types";
import { enableOn } from "utils/featureFlags";
import { reduce } from "lodash";

import Collapsible from "components/Collapsible";
import { Select } from "components/Forms";
import Required from "components/AdditionalContent/Required";

import MultiLineField from "../Format/MultiLineField";
import InlineField from "../Format/InlineField";
import AnswerValidation from "App/page/Design/Validation/AnswerValidation";

import styled from "styled-components";

const Container = styled.div`
  display: flex;
  align-items: center;
`;

const HorizontalRule = styled.hr`
  margin: 1em 0 1.5em;
`;

const HorizontalSpacer = styled.div`
  margin: 1em 0 0;
`;

const AnswerValidationSurround = styled.div`
  margin: 1em 0 0;
`;

const monthText = enableOn(["hub"]) ? "mm" : "Month";

const DateProperties = ({
  answer,
  value,
  onChange,
  handleRequiredChange,
  getId,
}) => {
  const errorCount = reduce(
    answer.validationErrorInfo.errors,
    (result, { type }) => {
      if (type === "validation") {
        result = result + 1;
      }
      return result;
    },
    0
  );

  const id = getId("date-format", answer.id);

  const checkDefaultOpen = (answer) => {
    let collapsibleOpen = false;

    if (
      answer.properties.format !== "dd/mm/yyyy" ||
      answer.required ||
      answer.validation.earliestDate.enabled ||
      answer.validation.latestDate.enabled
    ) {
      collapsibleOpen = true;
    }

    return collapsibleOpen;
  };

  return (
    <Collapsible
      variant="properties"
      title={`${answer.type} properties`}
      withoutHideThis
      errorCount={errorCount}
      defaultOpen={checkDefaultOpen(answer)}
    >
      <Required answer={answer} onChange={handleRequiredChange} getId={getId} />

      <HorizontalRule />

      <Container>
        <InlineField id={id} label={"Date type"}>
          <Select
            data-test="select"
            value={value}
            onChange={onChange}
            id={id}
            name={id}
          >
            <option
              data-test="day-month-year"
              value="dd/mm/yyyy"
            >{`dd / ${monthText} / yyyy`}</option>
            <option
              data-test="month-year"
              value="mm/yyyy"
            >{`${monthText} / yyyy`}</option>
            <option data-test="year" value="yyyy">
              yyyy
            </option>
          </Select>
        </InlineField>
      </Container>
      <HorizontalSpacer>
        <MultiLineField id={id} label={"Validation settings"}>
          <AnswerValidationSurround>
            <AnswerValidation answer={answer} />
          </AnswerValidationSurround>
        </MultiLineField>
      </HorizontalSpacer>
    </Collapsible>
  );
};

DateProperties.propTypes = {
  answer: PropTypes.object, //eslint-disable-line
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  handleRequiredChange: PropTypes.func.isRequired,
  getId: PropTypes.func,
};

export default DateProperties;
