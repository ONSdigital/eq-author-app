import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Field, Label } from "components/Forms";
import updateSectionMutation from "graphql/updateSection.graphql";
import { useMutation } from "@apollo/react-hooks";

import ToggleSwitch from "components/buttons/ToggleSwitch";

import DescribedText from "components/DescribedText";
import WrappingInput from "components/Forms/WrappingInput";

const StyledDescribedText = styled(DescribedText)`
  font-weight: 700;
`;
const StyledField = styled(Field)`
  margin-left: 0;
  margin-right: 2em;
`;

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
  margin-top: 0s;
  margin-bottom: 1.5rem;
  margin-left: 0;
  font-size: 0.85em;
`;

const SummaryLabel = styled.label`
  margin-top: 0s;
  margin-bottom: 1.5rem;
  margin-left: 0;
  font-weight: bold;
`;

const EnableDisableWrapper = styled.div`
  opacity: ${(props) => (props.disabled ? "0.6" : "1")};
  pointer-events: ${(props) => (props.disabled ? "none" : "auto")};
`;

const SectionSummary = ({
  id,
  sectionSummary,
  collapsibleSummary,
  summaryTitle,
  errorValidationMsg,
}) => {
  const [updateSection] = useMutation(updateSectionMutation);

  const [title, setSummaryTitle] = useState(summaryTitle);

  useEffect(() => {
    setSummaryTitle(summaryTitle);
  }, [summaryTitle]);

  return (
    <>
      <SummaryLabel>Section summary page</SummaryLabel>
      <Caption>
        This allows respondants to view and change their answers within this
        section before submitting them. You can set the section summary to be
        collapsible, so respondents can show and hide the answers.
      </Caption>
      <StyledField>
        <Label htmlFor={`summary-title-${id}`}>
          <StyledDescribedText
            description={`This will be shown on section and answer summaries.`}
          >
            Summary title
          </StyledDescribedText>
        </Label>
        <WrappingInput
          id={`summary-title-${id}`}
          name="summaryTitle"
          onChange={(e) => setSummaryTitle(e.value)}
          onBlur={(e) =>
            updateSection({
              variables: { input: { id, summaryTitle: e.target.value } },
            })
          }
          value={title || ""}
          placeholder={``}
          data-test="txt-folder-input"
          bold
          errorValidationMsg={errorValidationMsg}
        />
      </StyledField>
      <InlineField>
        <Label htmlFor="section-summary">Section summary</Label>
        <ToggleWrapper>
          <ToggleSwitch
            id="section-summary"
            name="section-summary"
            data-test="section-summary"
            hideLabels={false}
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
            checked={sectionSummary}
          />
        </ToggleWrapper>
      </InlineField>
      <EnableDisableWrapper
        data-test="collapsible-summary-wrapper"
        disabled={!sectionSummary}
      >
        <InlineField>
          <Label htmlFor="collapsible-summary">Collapsible summary</Label>
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
  summaryTitle: PropTypes.string,
  disabled: PropTypes.bool,
  errorValidationMsg: PropTypes.string,
};

export default SectionSummary;
