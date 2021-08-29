import React from "react";
import PropTypes from "prop-types";
import { enableOn } from "utils/featureFlags";

import { Select } from "components/Forms";
import Required from "components/AnswerContent/Required";

import MultiLineField from "components/AnswerContent/Format/MultiLineField";

import styled from "styled-components";

const Container = styled.div`
  display: flex;
  align-items: center;
`;

const monthText = enableOn(["hub"]) ? "mm" : "Month";

const DateProperties = ({ answer, value, updateAnswer }) => {
  const onUpdateFormat = ({ value }) => {
    updateAnswer({
      variables: {
        input: {
          id: answer.id,
          properties: { ...answer.properties, format: value },
        },
      },
    });
  };
  return (
    <>
      <Container>
        <MultiLineField id="date-format" label={"Date type"}>
          <Select
            data-test="select"
            value={answer.properties.format}
            onChange={onUpdateFormat}
            id="date-format"
            name="format"
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
        </MultiLineField>
      </Container>
      <Required answer={answer} updateAnswer={updateAnswer} />
    </>
  );
};

DateProperties.propTypes = {
  answer: PropTypes.object, //eslint-disable-line
  value: PropTypes.string.isRequired,
  updateAnswer: PropTypes.func.isRequired,
  getId: PropTypes.func,
};

export default DateProperties;
