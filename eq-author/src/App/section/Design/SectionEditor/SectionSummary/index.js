import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Field, Label } from "components/Forms";
import updateSectionMutation from "graphql/updateSection.graphql";
import { useMutation } from "@apollo/react-hooks";

import ToggleSwitch from "components/buttons/ToggleSwitch";
import CollapsibleToggled from "components/CollapsibleToggled";

const InlineField = styled(Field)`
  display: flex;
  align-items: center;
  margin-bottom: 0.4rem;
  margin-left: 0;
`;

const ToggleWrapper = styled.div`
  display: flex;
  margin-top: -0.3em;
`;

const Caption = styled.p`
  margin-top: 0.3rem;
  margin-left: 0;
  font-size: 0.85em;
`;

const SummaryLabel = styled.label`
  margin-top: 0s;
  margin-bottom: 1.5rem;
  margin-left: 0;
  font-weight: bold;
`;

const SectionSummary = ({ id, sectionSummary }) => {
  const [updateSection] = useMutation(updateSectionMutation);

  return (
    <>
      <SummaryLabel htmlFor="section-summary">
        Section summary page
      </SummaryLabel>
      <Caption>
        This allows respondants to view and change their answers within this
        section before submitting them. You can set the section summary to be
        collapsible, so respondents can show and hide the answers.
      </Caption>
      <InlineField>
        <ToggleWrapper>
          <CollapsibleToggled
            quoted={false}
            onChange={({ value }) =>
              updateSection({
                variables: {
                  input: {
                    id,
                    sectionSummary: value,
                    collapsibleSummary: false,
                  },
                },
              })
            }
            isOpen={sectionSummary}
          >
            <h1>Test</h1>
          </CollapsibleToggled>
        </ToggleWrapper>
      </InlineField>
    </>
  );
};

SectionSummary.propTypes = {
  id: PropTypes.string.isRequired,
  sectionSummary: PropTypes.bool,
  collapsibleSummary: PropTypes.bool,
  disabled: PropTypes.bool,
  errorValidationMsg: PropTypes.string,
};

export default SectionSummary;
