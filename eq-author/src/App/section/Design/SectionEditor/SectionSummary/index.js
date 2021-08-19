import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Field, Label } from "components/Forms";
import updateSectionMutation from "graphql/updateSection.graphql";
import { useMutation } from "@apollo/react-hooks";

import ToggleSwitch from "components/buttons/ToggleSwitch";

const InlineField = styled(Field)`
  display: flex;
  align-items: center;
  margin-bottom: 0.4em;
  margin-left: 2em;
`;

const ToggleWrapper = styled.div`
  display: flex;
  margin-top: -0.3em;
`;

const Caption = styled.p`
  margin-top: 0.2em;
  margin-bottom: 2em;
  margin-left: 2.4em;
  font-size: 0.85em;
`;

const SectionSummary = ({ id, sectionSummary }) => {
  console.log(`sectionSummary`, sectionSummary);
  const [updateSection] = useMutation(updateSectionMutation);

  return (
    <>
      <InlineField>
        <Label htmlFor="required-completed">section summary</Label>
        <ToggleWrapper>
          <ToggleSwitch
            id="section-summary"
            name="section-summary"
            data-test="section-summary"
            hideLabels={false}
            onChange={({ value }) =>
              updateSection({
                variables: {
                  input: { id, sectionSummary: value },
                },
              })
            }
            checked={sectionSummary}
          />
        </ToggleWrapper>
      </InlineField>
      <Caption>
        This allows respondents to view and change their answers within this
        section before submitting them.
      </Caption>
    </>
  );
};

SectionSummary.propTypes = {
  id: PropTypes.string.isRequired,
  sectionSummary: PropTypes.bool,
};

export default SectionSummary;
