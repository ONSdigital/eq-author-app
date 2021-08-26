import React, { useState } from "react";
import PropType from "prop-types";
import styled from "styled-components";
import ToggleSwitch from "components/buttons/ToggleSwitch";
import InlineField from "components/AdditionalContent/AnswerProperties/Format/InlineField";

const Container = styled.div`
  display: flex;
  align-items: center;
`;

const ToggleWrapper = styled.div`
  opacity: ${({ disabled }) => (disabled ? "0.6" : "1")};
  pointer-events: ${({ disabled }) => (disabled ? "none" : "auto")};
`;

const AdvancedProperties = ({ children }) => {
  const [advancedProperties, setAdvancedProperties] = useState(false);
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
              onChange={() => setAdvancedProperties(!advancedProperties)}
              data-test="advanced-properties"
              checked={advancedProperties}
            />
          </InlineField>
        </ToggleWrapper>
      </Container>
      <>{advancedProperties && children}</>
    </>
  );
};

AdvancedProperties.propTypes = {
  children: PropType.node.isRequired,
};
export default AdvancedProperties;
