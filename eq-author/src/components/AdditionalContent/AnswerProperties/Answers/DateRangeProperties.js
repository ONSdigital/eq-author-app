import React from "react";
import PropTypes from "prop-types";
import { reduce, some } from "lodash";

import Collapsible from "components/Collapsible";
import Required from "components/AdditionalContent/Required";
import MultiLineField from "components/AdditionalContent/AnswerProperties/Format/MultiLineField";

import InlineField from "../Format/InlineField";
import styled from "styled-components";
import AnswerValidation from "App/page/Design/Validation/AnswerValidation";

const Container = styled.div`
  display: flex;
  align-items: center;
`;

const HorizontalRule = styled.hr`
  margin: 1em 0 1.5em;
`;

const DateRangeProperties = ({ answer, onChange, getId }) => {
  const id = getId("date-range", answer.id);

  const errorCount = reduce(
    answer.validationErrorInfo.errors,
    (result, value) => {
      const { type, field } = value;

      // If the field already exists, skip it.
      if (some(result, ["field", field])) {
        return result;
      }

      // Add any validation errors.
      if (type === "validation") {
        result.push(value);
        return result;
      }

      return result;
    },
    []
  ).length;

  const checkDefaultOpen = (answer) => {
    let collapsibleOpen = false;

    if (
      answer.properties.required ||
      answer.validation.earliestDate.enabled ||
      answer.validation.latestDate.enabled ||
      answer.validation.maxDuration.enabled ||
      answer.validation.minDuration.enabled
    ) {
      collapsibleOpen = true;
    }

    return collapsibleOpen;
  };

  return (
    <Collapsible
      variant="properties"
      title={`Date range properties`}
      withoutHideThis
      errorCount={errorCount}
      defaultOpen={checkDefaultOpen(answer)}
    >
      <Container>
        <InlineField id={id}>
          <Required answer={answer} onChange={onChange} getId={getId} />
        </InlineField>
      </Container>
      <HorizontalRule />
      <MultiLineField id={id} label={"Validation settings"}>
        <AnswerValidation answer={answer} />
      </MultiLineField>
    </Collapsible>
  );
};

DateRangeProperties.propTypes = {
  answer: PropTypes.object, //eslint-disable-line
  getId: PropTypes.func,
  onChange: PropTypes.func,
};

export default DateRangeProperties;
