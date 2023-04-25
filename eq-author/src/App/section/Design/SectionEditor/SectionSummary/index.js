import React, { useState } from "react";
import PropTypes from "prop-types";
import CustomPropTypes from "custom-prop-types";
import styled from "styled-components";
import { Field, Label } from "components/Forms";
import { useMutation } from "@apollo/react-hooks";

import ToggleSwitch from "components/buttons/ToggleSwitch";
import CollapsibleToggled from "components/CollapsibleToggled";
import PageTitleContainer from "components/PageTitle";

import UPDATE_SECTION_MUTATION from "graphql/updateSection.graphql";

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
  errors,
}) => {
  const [pageDescription, setPageDescription] = useState(
    sectionSummaryPageDescription
  );
  const [updateSection] = useMutation(UPDATE_SECTION_MUTATION);

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
            id={"section-summary"}
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
              inputTitlePrefix={"Section summary"}
              onChange={({ value }) => setPageDescription(value)}
              onUpdate={({ value }) =>
                updateSection({
                  variables: {
                    input: { id, sectionSummaryPageDescription: value },
                  },
                })
              }
              altFieldName={"sectionSummaryPageDescription"}
              altError={"SECTION_SUMMARY_PAGE_DESCRIPTION_MISSING"}
              errors={errors}
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
  errors: CustomPropTypes.errors,
};

export default SectionSummary;
