import React from "react";
import PropTypes from "prop-types";

import InlineField from "components/AnswerContent/Format/InlineField";
import ToggleSwitch from "components/buttons/ToggleSwitch";
import { InformationPanel } from "components/Panel";

const Required = ({
  answer,
  label,
  updateAnswer,
  hasMutuallyExclusiveAnswer,
}) => {
  const onUpdateRequired = ({ value }) => {
    updateAnswer({
      variables: {
        input: {
          id: answer.id,
          properties: { ...answer.properties, required: value },
        },
      },
    });
  };
  return (
    <>
      <InlineField id={answer.id} label={label}>
        <ToggleSwitch
          data-test="answer-properties-required-toggle"
          name="required"
          id={answer.id}
          onChange={onUpdateRequired}
          checked={answer.properties.required}
          hideLabels={false}
          ariaLabel={label}
        />
      </InlineField>
      {hasMutuallyExclusiveAnswer && (
        <InformationPanel>
          Answer required setting also applies to OR answer type.
        </InformationPanel>
      )}
    </>
  );
};

Required.propTypes = {
  answer: PropTypes.object, //eslint-disable-line
  updateAnswer: PropTypes.func.isRequired,
  label: PropTypes.string,
  hasMutuallyExclusiveAnswer: PropTypes.bool,
};

Required.defaultProps = {
  label: "Answer required",
};

export default Required;
