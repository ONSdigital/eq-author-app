import React from "react";
import PropTypes from "prop-types";
import { propType } from "graphql-anywhere";
import { useMutation } from "@apollo/react-hooks";

import answerFragment from "graphql/fragments/answer.graphql";
import CREATE_MUTUALLY_EXCLUSIVE from "../BasicAnswer/graphql/createMutuallyExclusiveOption.graphql";
import DELETE_OPTION from "../BasicAnswer/graphql/deleteOption.graphql";
import UPDATE_OPTION_MUTATION from "graphql/updateOption.graphql";
import UPDATE_ANSWER from "graphql/updateAnswer.graphql";

import Date from "../Date";
import MultiLineField from "components/AnswerContent/Format/MultiLineField";
import AnswerProperties from "components/AnswerContent/AnswerProperties";
import AdvancedProperties from "components/AnswerContent/AdvancedProperties";
import AnswerValidation from "App/page/Design/Validation/AnswerValidation";
import MutuallyExclusive from "components/AnswerContent/MutuallyExclusive";

export const DateSingle = ({
  answer,
  onChange,
  onUpdate,
  multipleAnswers,
  autoFocus,
  ...otherProps
}) => {
  const [createMutuallyExclusive] = useMutation(CREATE_MUTUALLY_EXCLUSIVE);
  const [updateOption] = useMutation(UPDATE_OPTION_MUTATION);
  const [deleteOption] = useMutation(DELETE_OPTION);
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
        <MultiLineField id="validation-settingd" label="Validation settings">
          <AnswerValidation answer={answer} />
        </MultiLineField>
        <MutuallyExclusive
          answer={answer}
          createMutuallyExclusive={createMutuallyExclusive}
          disabled={multipleAnswers}
          updateOption={updateOption}
          deleteOption={deleteOption}
          autoFocus={autoFocus}
        />
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
  disableMutuallyExclusive: PropTypes.bool,
};

DateSingle.defaultProps = {
  label: "Label",
  name: "label",
};

DateSingle.fragments = Date.fragments;

export default DateSingle;
