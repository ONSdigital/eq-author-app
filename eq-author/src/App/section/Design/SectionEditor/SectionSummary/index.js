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
  margin-bottom: 1.5rem;
  margin-left: 2rem;
  font-size: 0.85em;
`;

const SummaryLabel = styled.label`
  margin-top: 0s;
  margin-bottom: 1.5rem;
  margin-left: 2rem;
  font-weight: bold;
`;

const EnableDisableWrapper = styled.div`
  opacity: ${(props) => (props.disabled ? "0.6" : "1")};
  pointer-events: ${(props) => (props.disabled ? "none" : "auto")};
`;

const SectionSummary = ({ id, sectionSummary, collapsibleSummary }) => {
  const [updateSection] = useMutation(updateSectionMutation);

  return (
    <>
      <SummaryLabel>Section summary page</SummaryLabel>
      <Caption>
        This allows respondants to view and change their answers within this
        section before submitting them. You can set the section summary to be
        collapsible, so respondents can show and hide the answers.
      </Caption>

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
      <EnableDisableWrapper disabled={!sectionSummary}>
        <InlineField>
          <Label htmlFor="required-completed">Collapsible summary</Label>
          <ToggleWrapper>
            <ToggleSwitch
              id="collapsible-summary"
              name="collapsible-summary"
              data-test="collapsible-summary"
              hideLabels={false}
              onChange={({ value }) =>
                updateSection({
                  variables: {
                    input: { id, collapsibleSummary: value },
                  },
                })
              }
              checked={collapsibleSummary}
            />
          </ToggleWrapper>
        </InlineField>
      </EnableDisableWrapper>
    </>
  );
};

SectionSummary.propTypes = {
  id: PropTypes.string.isRequired,
  sectionSummary: PropTypes.bool,
  collapsibleSummary: PropTypes.bool,
};

export default SectionSummary;
