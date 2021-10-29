import React from "react";
import gql from "graphql-tag";
import styled from "styled-components";
import { flowRight, noop } from "lodash/fp";
import { propType } from "graphql-anywhere";
import PropTypes from "prop-types";

import withPropRenamed from "enhancers/withPropRenamed";
import withChangeUpdate from "enhancers/withChangeUpdate";

import RichTextEditor from "components/RichTextEditor";
import withEntityEditor from "components/withEntityEditor";

import { colors } from "constants/theme";

import transformNestedFragments from "utils/transformNestedFragments";

import CollapsiblesEditor from "./CollapsiblesEditor";

import { InformationPanel } from "components/Panel";

import withUpdateQuestionnaireIntroduction from "./withUpdateQuestionnaireIntroduction";
import { Field, Input, Label } from "components/Forms";
import ToggleSwitch from "components/buttons/ToggleSwitch";

const Section = styled.section`
  &:not(:last-of-type) {
    border-bottom: 1px solid #e0e0e0;
  }
`;

const Padding = styled.div`
  padding: 2em;
`;

const SectionTitle = styled.h2`
  font-size: 1.1em;
  font-weight: bold;
  color: ${colors.text};
  margin: 0 0 1em;
`;

const SectionDescription = styled.p`
  margin: 0.1em 0 1em;
  color: ${colors.textLight};
`;

const titleControls = {
  emphasis: true,
  piping: true,
};

const descriptionControls = {
  bold: true,
  emphasis: true,
  piping: true,
  list: true,
  link: true,
};

const InlineField = styled(Field)`
  display: flex;
  align-items: center;
  margin-bottom: ${(props) => (props.open ? "0.4em" : "2em")};
  > * {
    margin-bottom: 0;
  }
`;

export const IntroductionEditor = ({
  introduction,
  onChangeUpdate,
  updateQuestionnaireIntroduction,
}) => {
  const {
    id,
    collapsibles,
    title,
    description,
    contactDetailsPhoneNumber,
    contactDetailsEmailAddress,
    contactDetailsEmailSubject,
    contactDetailsIncludeRuRef,
    additionalGuidancePanel,
    additionalGuidancePanelSwitch,
    secondaryTitle,
    secondaryDescription,
    tertiaryTitle,
    tertiaryDescription,
  } = introduction;

  return (
    <>
      <Section>
        <Padding>
          <SectionTitle style={{ marginBottom: "0" }}>
            Introduction content
          </SectionTitle>
          <SectionDescription>
            This content is displayed above the “start survey” button. The title
            is not editable.
          </SectionDescription>
          <RichTextEditor
            id="intro-title"
            name="title"
            label="Title"
            multiline
            value={title}
            size="large"
            disabled
            onUpdate={noop}
            testSelector="txt-intro-title"
          />
        </Padding>
      </Section>
      <Section>
        <Padding>
          <SectionTitle style={{ marginBottom: "0" }}>
            ONS contact detail
          </SectionTitle>
          <SectionDescription>
            For business to report a change to company details or structure.
          </SectionDescription>
          <Field>
            <Label htmlFor="contactDetailsPhoneNumber">Phone Number</Label>
            <Input
              id="contactDetailsPhoneNumber"
              value={contactDetailsPhoneNumber}
              onChange={onChangeUpdate}
              data-test="txt-contact-details-phone-number"
            />
          </Field>
          <Field>
            <Label htmlFor="contactDetailsEmailAddress">Email Address</Label>
            <Input
              id="contactDetailsEmailAddress"
              value={contactDetailsEmailAddress}
              onChange={onChangeUpdate}
              data-test="txt-contact-details-email-address"
            />
          </Field>
          <Field>
            <Label htmlFor="contactDetailsEmailSubject">Email Subject</Label>
            <Input
              id="contactDetailsEmailSubject"
              value={contactDetailsEmailSubject}
              onChange={onChangeUpdate}
              data-test="txt-contact-details-email-subject"
            />
          </Field>
          <InlineField
            open={additionalGuidancePanelSwitch}
            style={{ marginBottom: "0" }}
          >
            <Label>Add RU ref to the subject line</Label>
            <ToggleSwitch
              id="toggle-contact-details-include-ruref"
              name="toggle-contact-details-include-ruref"
              hideLabels={false}
              onChange={() =>
                updateQuestionnaireIntroduction({
                  id,
                  ...introduction,
                  contactDetailsIncludeRuRef: !contactDetailsIncludeRuRef,
                })
              }
              checked={contactDetailsIncludeRuRef}
            />
          </InlineField>
          <SectionDescription>
            Add the reporting unit reference to the end of the subject line, for
            example, Change of details eference 621476278652.
          </SectionDescription>
        </Padding>
      </Section>
      <Section>
        <Padding>
          <InlineField open={additionalGuidancePanelSwitch}>
            <Label>Additional guidance panel</Label>

            <ToggleSwitch
              id="toggle-additional-guidance-panel"
              name="toggle-additional-guidance-panel"
              hideLabels={false}
              onChange={() =>
                updateQuestionnaireIntroduction({
                  id,
                  ...introduction,
                  additionalGuidancePanelSwitch: !additionalGuidancePanelSwitch,
                })
              }
              checked={additionalGuidancePanelSwitch}
            />
          </InlineField>
          {additionalGuidancePanelSwitch ? (
            <RichTextEditor
              id={`details-additionalGuidancePanel-${id}`}
              name="additionalGuidancePanel"
              value={additionalGuidancePanel}
              label=""
              onUpdate={onChangeUpdate}
              multiline
              controls={{
                heading: true,
                list: true,
                bold: true,
                link: true,
              }}
              testSelector="txt-collapsible-additionalGuidancePanel"
            />
          ) : null}

          <RichTextEditor
            id="intro-description"
            name="description"
            label="Description"
            multiline
            value={description}
            controls={descriptionControls}
            onUpdate={onChangeUpdate}
            testSelector="txt-intro-description"
          />

          <SectionTitle>Legal basis</SectionTitle>
          <InformationPanel>
            The legal basis can be changed on the Settings page
          </InformationPanel>
        </Padding>
      </Section>
      <Section>
        <Padding>
          <SectionTitle style={{ marginBottom: "0" }}>
            Secondary content
          </SectionTitle>
          <SectionDescription>
            This content is displayed below the “start survey” button.
          </SectionDescription>
          <RichTextEditor
            id="secondary-title"
            name="secondaryTitle"
            label="Title"
            value={secondaryTitle}
            controls={titleControls}
            size="large"
            onUpdate={onChangeUpdate}
            testSelector="txt-intro-secondary-title"
          />
          <RichTextEditor
            id="secondary-description"
            name="secondaryDescription"
            label="Description"
            multiline
            value={secondaryDescription}
            controls={descriptionControls}
            onUpdate={onChangeUpdate}
            testSelector="txt-intro-secondary-description"
          />
          <SectionTitle style={{ marginBottom: "0" }}>
            Collapsibles
          </SectionTitle>
          <SectionDescription>
            Information which is displayed in a collapsible “twistie”.
          </SectionDescription>
          <CollapsiblesEditor introductionId={id} collapsibles={collapsibles} />
        </Padding>
      </Section>
      <Section>
        <Padding>
          <SectionTitle>Tertiary content</SectionTitle>
          <RichTextEditor
            id="tertiary-title"
            name="tertiaryTitle"
            label="Title"
            value={tertiaryTitle}
            controls={titleControls}
            size="large"
            onUpdate={onChangeUpdate}
            testSelector="txt-intro-tertiary-title"
          />
          <RichTextEditor
            id="tertiary-description"
            name="tertiaryDescription"
            label="Description"
            multiline
            value={tertiaryDescription}
            controls={descriptionControls}
            onUpdate={onChangeUpdate}
            testSelector="txt-intro-tertiary-description"
          />
        </Padding>
      </Section>
    </>
  );
};
const fragment = gql`
  fragment IntroductionEditor on QuestionnaireIntroduction {
    id
    title
    description
    contactDetailsPhoneNumber
    contactDetailsEmailAddress
    contactDetailsEmailSubject
    contactDetailsIncludeRuRef
    additionalGuidancePanel
    additionalGuidancePanelSwitch
    secondaryTitle
    secondaryDescription
    collapsibles {
      ...CollapsibleEditor
    }
    tertiaryTitle
    tertiaryDescription
  }
`;

IntroductionEditor.fragments = [fragment, ...CollapsiblesEditor.fragments];

IntroductionEditor.propTypes = {
  introduction: propType(
    transformNestedFragments(fragment, CollapsiblesEditor.fragments)
  ).isRequired,
  onChangeUpdate: PropTypes.func.isRequired,
  updateQuestionnaireIntroduction: PropTypes.func.isRequired,
};

const withWrappers = flowRight(
  withUpdateQuestionnaireIntroduction,
  withPropRenamed("updateQuestionnaireIntroduction", "onUpdate"),
  withEntityEditor("introduction"),
  withChangeUpdate
);

export default withWrappers(IntroductionEditor);
