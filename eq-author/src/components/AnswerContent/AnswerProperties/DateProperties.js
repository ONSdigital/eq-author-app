import React from "react";
import PropTypes from "prop-types";
import { Select } from "components/Forms";
import Required from "components/AnswerContent/Required";
import MultiLineField from "components/AnswerContent/Format/MultiLineField";
import styled from "styled-components";

const StyledSelect = styled(Select)`
  width: 12em;
`;

const monthText = "mm";

const DateProperties = ({
  answer,
  updateAnswer,
  hasMutuallyExclusiveAnswer,
}) => {
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
      <MultiLineField id="date-format" label={"Date type"}>
        <StyledSelect
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
        </StyledSelect>
      </MultiLineField>
      <Required
        answer={answer}
        updateAnswer={updateAnswer}
        hasMutuallyExclusiveAnswer={hasMutuallyExclusiveAnswer}
      />
    </>
  );
};

DateProperties.propTypes = {
  answer: PropTypes.object, //eslint-disable-line
  updateAnswer: PropTypes.func.isRequired,
  hasMutuallyExclusiveAnswer: PropTypes.bool,
};

export default DateProperties;
