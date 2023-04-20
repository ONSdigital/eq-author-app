import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Field, Label } from "components/Forms";
import updateSectionMutation from "graphql/updateSection.graphql";
import { useMutation } from "@apollo/react-hooks";

import ToggleSwitch from "components/buttons/ToggleSwitch";
import CollapsibleToggled from "components/CollapsibleToggled";
import PageTitleContainer from "components/PageTitle";

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

const SectionSummary = ({
  id,
  sectionSummary,
  sectionSummaryPageDescription,
}) => {
  const [pageDescription, setPageDescription] = useState(
    sectionSummaryPageDescription
  );
  const [updateSection] = useMutation(updateSectionMutation);

  return (
    <>
      <SummaryLabel htmlFor="section-summary">
        Section summary page
      </SummaryLabel>
      <Caption>
        This allows respondents to view and change their answers within this
        section before submitting them. You can set the section summary to be
        collapsible, so respondents can show and hide the answers.
      </Caption>
      <InlineField>
        <ToggleWrapper>
          <CollapsibleToggled
            quoted={false}
            withContentSpace
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
            <PageTitleContainer
              heading="Section summary page title"
              pageDescription={pageDescription}
              onChange={({ value }) => setPageDescription(value)}
              onUpdate={({ value }) =>
                updateSection({
                  variables: {
                    input: { id, sectionSummaryPageDescription: value },
                  },
                })
              }
            />
          </CollapsibleToggled>
        </ToggleWrapper>
      </InlineField>
    </>
  );
};

SectionSummary.propTypes = {
  id: PropTypes.string.isRequired,
  sectionSummary: PropTypes.bool,
  sectionSummaryPageDescription: PropTypes.string,
};

export default SectionSummary;
