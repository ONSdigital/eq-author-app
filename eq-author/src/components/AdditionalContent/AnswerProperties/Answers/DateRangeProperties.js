import React from "react";
import PropTypes from "prop-types";

import Collapsible from "components/Collapsible";
import Required from "components/AdditionalContent/Required";
import MultiLineField from "components/AdditionalContent/AnswerProperties/Format/MultiLineField";

import InlineField from "../Format/InlineField";

import AnswerValidation from "App/page/Design/Validation/AnswerValidation";

const DateRangeProperties = ({ answer, onChange, getId }) => {
  const id = getId("date-range", answer.id);

  return (
    <Collapsible
      variant="content"
      title={`Date range properties`}
      withoutHideThis
    >
      <InlineField id={id} label={"Answer required"}>
        <Required answer={answer} onChange={onChange} getId={getId} />
      </InlineField>
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
