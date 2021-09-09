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
  margin-bottom: 0.4rem;
  margin-left: 2rem;
`;

const ToggleWrapper = styled.div`
  display: flex;
  margin-top: -0.3em;
`;

const Caption = styled.p`
  margin-top: 0s;
  margin-bottom: 2rem;
  margin-left: 2rem;
  font-size: 0.85em;
`;

const SectionSummary = ({ id, sectionSummary }) => {
  const [updateSection] = useMutation(updateSectionMutation);

  return (
    <>
      <InlineField>
        <Label htmlFor="required-completed">Section summary</Label>
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
