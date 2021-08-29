import React from "react";
import PropType from "prop-types";
import styled from "styled-components";
import ToggleSwitch from "components/buttons/ToggleSwitch";
import InlineField from "components/AnswerContent/Format/InlineField";

const ToggleWrapper = styled.div`
  opacity: ${({ disabled }) => (disabled ? "0.6" : "1")};
  pointer-events: ${({ disabled }) => (disabled ? "none" : "auto")};
`;

const HorizontalRule = styled.hr`
  margin: 0.2em 0 0.9em;
`;

const AdvancedProperties = ({
  answer: { id, advancedProperties },
  updateAnswer,
  children,
  enableHorizontalRule,
}) => {
  const onUpdateFormat = (value) => {
    updateAnswer({
      variables: {
        input: {
          id: id,
          advancedProperties: value,
        },
      },
    });
  };
  return (
    <>
      <ToggleWrapper data-test="toggle-wrapper-advanced-properties">
        <InlineField
          id="advanced-properties"
          htmlFor="advanced-properties"
          label="Advanced properties"
        >
          <ToggleSwitch
            id="advanced-properties"
            name="advanced-properties"
            hideLabels={false}
            onChange={() => onUpdateFormat(!advancedProperties)}
            data-test="advanced-properties"
            checked={advancedProperties || false}
          />
        </InlineField>
      </ToggleWrapper>
      {advancedProperties && enableHorizontalRule && <HorizontalRule />}
      {advancedProperties && children}
    </>
  );
};

AdvancedProperties.defaultProps = {
  enableHorizontalRule: true,
};

AdvancedProperties.propTypes = {
  answer: PropType.object, //eslint-disable-line
  updateAnswer: PropType.func,
  children: PropType.node.isRequired,
  enableHorizontalRule: PropType.bool,
};
export default AdvancedProperties;
