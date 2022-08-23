import React from "react";
import PropTypes from "prop-types";
import { propType } from "graphql-anywhere";
import { useMutation } from "@apollo/react-hooks";

import answerFragment from "graphql/fragments/answer.graphql";
import UPDATE_ANSWER from "graphql/updateAnswer.graphql";

import Date from "../Date";
import AnswerProperties from "components/AnswerContent/AnswerProperties";
import AdvancedProperties from "components/AnswerContent/AdvancedProperties";
import AnswerValidation from "App/page/Design/Validation/AnswerValidation";

export const DateSingle = ({ answer, onChange, onUpdate, ...otherProps }) => {
  const [updateAnswer] = useMutation(UPDATE_ANSWER);

  return (
    <>
      <Date
        key={`from-${answer.id}`}
        answer={answer}
        name="label"
        showDay
        showMonth
        showYear
        onChange={onChange}
        onUpdate={onUpdate}
        showDummyDate={false}
        {...otherProps}
      />
      <AnswerProperties answer={answer} updateAnswer={updateAnswer} />
      <AdvancedProperties answer={answer} updateAnswer={updateAnswer}>
        <AnswerValidation answer={answer} />
      </AdvancedProperties>
    </>
  );
};

DateSingle.propTypes = {
  answer: propType(answerFragment),
  onChange: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  multipleAnswers: PropTypes.bool.isRequired,
  labelPlaceholder: PropTypes.string,
  autoFocus: PropTypes.bool,
  descriptionPlaceholder: PropTypes.string,
};

DateSingle.defaultProps = {
  label: "Label",
  name: "label",
};

DateSingle.fragments = Date.fragments;

export default DateSingle;
