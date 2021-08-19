import React from "react";
import PropTypes from "prop-types";
import { enableOn } from "utils/featureFlags";

import Collapsible from "components/Collapsible";
import { Select } from "components/Forms";
import Required from "components/AdditionalContent/Required";

import MultiLineField from "../Format/MultiLineField";
import InlineField from "../Format/InlineField";

import AnswerValidation from "App/page/Design/Validation/AnswerValidation";

import styled from "styled-components";
import { colors } from "constants/theme";

const Container = styled.div`
  display: flex;
  align-items: center;
`;

const HorizontalRule = styled.hr`
  margin: 1em 0 1.5em 0;
`;

const VerticalRule = styled.div`
  width: 1px;
  height: 2.5em;
  background-color: ${colors.grey};
  margin: 0 1.4em 0 0.5em;
`;

const monthText = enableOn(["hub"]) ? "mm" : "Month";

const DateProperties = ({
  answer,
  value,
  onChange,
  handleRequiredChange,
  getId,
}) => {
  return (
    <Collapsible
      variant="properties"
      title={`${answer.type} properties`}
      withoutHideThis
    >
      <Container>
        <Required
          answer={answer}
          onChange={handleRequiredChange}
          getId={getId}
        />

        <VerticalRule />
        <InlineField id={getId("date-format", answer.id)} label={"Date type"}>
          <Select
            data-test="select"
            value={value}
            onChange={onChange}
            id={getId("date-format", answer.id)}
            name={getId("date-format", answer.id)}
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
      <HorizontalRule />
      <MultiLineField
        id={getId("date-format", answer.id)}
        label={"Validation settings"}
      >
        <AnswerValidation answer={answer} />
      </MultiLineField>
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
