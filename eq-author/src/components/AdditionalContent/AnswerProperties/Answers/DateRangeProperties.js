import React from "react";
import PropTypes from "prop-types";

import Collapsible from "components/Collapsible";
import Required from "components/AdditionalContent/Required";
import MultiLineField from "components/AdditionalContent/AnswerProperties/Format/MultiLineField";

import InlineField from "../Format/InlineField";
import styled from "styled-components";
import { colors } from "constants/theme";

import AnswerValidation from "App/page/Design/Validation/AnswerValidation";

const Container = styled.div`
  display: flex;
  align-items: center;
`;

const HorizontalRule = styled.hr`
  margin: 1em 0 1.5em 0;
`;

const DateRangeProperties = ({ answer, onChange, getId }) => {
  const id = getId("date-range", answer.id);

  return (
    <Collapsible
      variant="properties"
      title={`Date range properties`}
      withoutHideThis
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
