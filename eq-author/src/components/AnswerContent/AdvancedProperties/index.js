import React from "react";
import PropType from "prop-types";
import styled from "styled-components";
import ToggleSwitch from "components/buttons/ToggleSwitch";
import InlineField from "components/AnswerContent/AnswerProperties/Format/InlineField";

const Container = styled.div`
  display: flex;
  align-items: center;
`;

const ToggleWrapper = styled.div`
  opacity: ${({ disabled }) => (disabled ? "0.6" : "1")};
  pointer-events: ${({ disabled }) => (disabled ? "none" : "auto")};
`;

const AdvancedProperties = ({
  answer: { id, advancedProperties },
  updateAnswer,
  children,
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
      <Container>
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
      </Container>
      <>{advancedProperties && children}</>
    </>
  );
};

AdvancedProperties.propTypes = {
  answer: PropType.object, //eslint-disable-line
  updateAnswer: PropType.func,
  children: PropType.node.isRequired,
};
export default AdvancedProperties;
