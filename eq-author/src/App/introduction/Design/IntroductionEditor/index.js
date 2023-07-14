import React, { useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import CustomPropTypes from "custom-prop-types";
import { useMutation } from "@apollo/react-hooks";
import { useParams, Link } from "react-router-dom";

import { colors } from "constants/theme";
import { introductionErrors } from "constants/validationMessages";

import { buildSettingsPath } from "utils/UrlUtils";

import RichTextEditor from "components/RichTextEditor";
import ValidationError from "components/ValidationError";
import { InformationPanel } from "components/Panel";
import { Field, Input, Label } from "components/Forms";
import ToggleSwitch from "components/buttons/ToggleSwitch";
import Panel from "components-themed/panels";
import IntroductionHeader from "../../IntroductionHeader";

import CollapsiblesEditor from "./CollapsiblesEditor";

import UPDATE_INTRODUCTION_MUTATION from "graphql/updateQuestionnaireIntroduction.graphql";

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
  color: ${colors.text};
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
  pointer-events: ${({ disabled }) => (disabled ? "none" : "auto")};
`;

const HorizontalSeparator = styled.hr`
  border: 0;
  border-top: 0.0625em solid #e0e0e0;
  margin: 1.2em 0;
`;

const StyledInput = styled(Input)`
  ${({ hasError }) =>
    hasError &&
    `
    border-color: ${colors.errorPrimary};
    &:focus,
    &:focus-within {
      border-color: ${colors.errorPrimary};
      outline-color: ${colors.errorPrimary};
      box-shadow: 0 0 0 2px ${colors.errorPrimary};
    }
    &:hover {
      border-color: ${colors.errorPrimary};
      outline-color: ${colors.errorPrimary};
    }
  `}
`;

const IntroductionEditor = ({ introduction, history }) => {
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
    previewQuestions,
    disallowPreviewQuestions,
    secondaryTitle,
    secondaryDescription,
    tertiaryTitle,
    tertiaryDescription,
    validationErrorInfo,
  } = introduction;

  const [updateQuestionnaireIntroduction] = useMutation(
    UPDATE_INTRODUCTION_MUTATION
  );

  const [phoneNumber, setPhoneNumber] = useState(contactDetailsPhoneNumber);
  const [email, setEmail] = useState(contactDetailsEmailAddress);
  const [emailSubject, setEmailSubject] = useState(contactDetailsEmailSubject);

  const { errors } = validationErrorInfo;

  const { TITLE_NOT_ENTERED, PHONE_NOT_ENTERED, EMAIL_NOT_ENTERED } =
    introductionErrors;

  const hasErrors = (requiredField) => {
    const result = errors.some(({ field }) => field === requiredField);
    return result;
  };

  const params = useParams();
  return (
    <>
      <IntroductionHeader history={history} />
      <Section>
        <Padding>
          <SectionTitle style={{ marginTop: "-2em", marginBottom: "0" }}>
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
            onUpdate={({ value }) =>
              updateQuestionnaireIntroduction({
                variables: {
                  input: {
                    title: value,
                  },
                },
              })
            }
            errorValidationMsg={
              (hasErrors("title") && TITLE_NOT_ENTERED) || null
            }
            controls={{
              heading: true,
              bold: true,
              link: true,
              emphasis: true,
              piping: true,
            }}
            testSelector="txt-intro-title"
            withoutMargin
          />
          <Panel variant="warning">
            You can have this page display on the Hub via the&nbsp;
            <Link to={`${buildSettingsPath(params)}`}>Settings page</Link>
          </Panel>
          <div>
            <HorizontalSeparator />
            <SectionTitle style={{ marginBottom: "0" }}>
              ONS contact details
            </SectionTitle>
            <SectionDescription>
              For business to report a change to company details or structure.
            </SectionDescription>
            <Field>
              <Label htmlFor="contactDetailsPhoneNumber">Phone Number</Label>
              <StyledInput
                id="contactDetailsPhoneNumber"
                value={phoneNumber}
                onChange={({ value }) => setPhoneNumber(value)}
                onBlur={() =>
                  updateQuestionnaireIntroduction({
                    variables: {
                      input: {
                        contactDetailsPhoneNumber: phoneNumber,
                      },
                    },
                  })
                }
                data-test="txt-contact-details-phone-number"
                hasError={hasErrors("contactDetailsPhoneNumber")}
              />
              {hasErrors("contactDetailsPhoneNumber") && (
                <ValidationError>{PHONE_NOT_ENTERED}</ValidationError>
              )}
            </Field>
            <Field>
              <Label htmlFor="contactDetailsEmailAddress">Email Address</Label>
              <StyledInput
                id="contactDetailsEmailAddress"
                value={email}
                onChange={({ value }) => setEmail(value)}
                onBlur={() =>
                  updateQuestionnaireIntroduction({
                    variables: {
                      input: {
                        contactDetailsEmailAddress: email,
                      },
                    },
                  })
                }
                data-test="txt-contact-details-email-address"
                hasError={hasErrors("contactDetailsEmailAddress")}
              />
              {hasErrors("contactDetailsEmailAddress") && (
                <ValidationError>{EMAIL_NOT_ENTERED}</ValidationError>
              )}
            </Field>
            <Field>
              <Label htmlFor="contactDetailsEmailSubject">Email Subject</Label>
              <Input
                id="contactDetailsEmailSubject"
                value={emailSubject}
                onChange={({ value }) => setEmailSubject(value)}
                onBlur={() =>
                  updateQuestionnaireIntroduction({
                    variables: {
                      input: {
                        contactDetailsEmailSubject: emailSubject,
                      },
                    },
                  })
                }
                data-test="txt-contact-details-email-subject"
              />
            </Field>
            <InlineField
              open={contactDetailsIncludeRuRef}
              style={{ marginBottom: "0" }}
            >
              <Label htmlFor="toggle-contact-details-include-ruref">
                Add RU ref to the subject line
              </Label>
              <ToggleSwitch
                id="toggle-contact-details-include-ruref"
                name="toggle-contact-details-include-ruref"
                hideLabels={false}
                onChange={() =>
                  updateQuestionnaireIntroduction({
                    variables: {
                      input: {
                        contactDetailsIncludeRuRef: !contactDetailsIncludeRuRef,
                      },
                    },
                  })
                }
                checked={contactDetailsIncludeRuRef}
              />
            </InlineField>
            <SectionDescription>
              Add the reporting unit reference to the end of the subject line,
              for example, Change of details reference 621476278652.
            </SectionDescription>
            <HorizontalSeparator />
          </div>
          <InlineField open={additionalGuidancePanelSwitch}>
            <Label htmlFor="toggle-additional-guidance-panel">
              Additional guidance panel
            </Label>

            <ToggleSwitch
              id="toggle-additional-guidance-panel"
              name="toggle-additional-guidance-panel"
              hideLabels={false}
              onChange={() =>
                updateQuestionnaireIntroduction({
                  variables: {
                    input: {
                      additionalGuidancePanelSwitch:
                        !additionalGuidancePanelSwitch,
                      additionalGuidancePanel: "",
                    },
                  },
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
              onUpdate={({ value }) =>
                updateQuestionnaireIntroduction({
                  variables: {
                    input: {
                      additionalGuidancePanel: value,
                    },
                  },
                })
              }
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
            onUpdate={({ value }) =>
              updateQuestionnaireIntroduction({
                variables: {
                  input: {
                    description: value,
                  },
                },
              })
            }
            testSelector="txt-intro-description"
          />

          <SectionTitle>Legal basis</SectionTitle>
          <InformationPanel>
            The legal basis can be changed on the Settings page
          </InformationPanel>
        </Padding>
      </Section>
      {/* //TODO: previewQuestions */}
      <Section>
        <Padding>
          <InlineField
            style={{ marginBottom: "0" }}
            disabled={disallowPreviewQuestions}
          >
            <Label
              labelFor="toggle-preview-questions"
              style={{
                color: disallowPreviewQuestions
                  ? colors.mediumGrey
                  : colors.text,
                marginBottom: "0",
              }}
            >
              Include a link to a page for previewing the questions
            </Label>
            <ToggleSwitch
              id="toggle-preview-questions"
              name="toggle-preview-questions"
              hideLabels={false}
              onChange={() =>
                updateQuestionnaireIntroduction({
                  variables: {
                    input: {
                      previewQuestions: !previewQuestions,
                    },
                  },
                })
              }
              checked={previewQuestions}
            />
          </InlineField>
          <SectionDescription
            style={{
              color: disallowPreviewQuestions ? colors.mediumGrey : colors.text,
              marginBottom: "0",
            }}
          >
            Each section is represented as a collapsible element, allowing users
            to show and hide its respective questions.
          </SectionDescription>
          {disallowPreviewQuestions ? (
            <InformationPanel>
              A link for previewing the questions cannot be provided for
              questionnaires that contain list collector question patterns.
            </InformationPanel>
          ) : null}
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
            onUpdate={({ value }) =>
              updateQuestionnaireIntroduction({
                variables: {
                  input: {
                    secondaryTitle: value,
                  },
                },
              })
            }
            testSelector="txt-intro-secondary-title"
          />
          <RichTextEditor
            id="secondary-description"
            name="secondaryDescription"
            label="Description"
            multiline
            value={secondaryDescription}
            controls={descriptionControls}
            onUpdate={({ value }) => {
              updateQuestionnaireIntroduction({
                variables: {
                  input: {
                    secondaryDescription: value,
                  },
                },
              });
            }}
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
            onUpdate={({ value }) =>
              updateQuestionnaireIntroduction({
                variables: {
                  input: {
                    tertiaryTitle: value,
                  },
                },
              })
            }
            testSelector="txt-intro-tertiary-title"
          />
          <RichTextEditor
            id="tertiary-description"
            name="tertiaryDescription"
            label="Description"
            multiline
            value={tertiaryDescription}
            controls={descriptionControls}
            onUpdate={({ value }) =>
              updateQuestionnaireIntroduction({
                variables: {
                  input: {
                    tertiaryDescription: value,
                  },
                },
              })
            }
            testSelector="txt-intro-tertiary-description"
          />
        </Padding>
      </Section>
    </>
  );
};

IntroductionEditor.propTypes = {
  introduction: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string,
    contactDetailsPhoneNumber: PropTypes.string,
    contactDetailsEmailSubject: PropTypes.string,
    contactDetailsIncludeRuRef: PropTypes.bool,
    additionalGuidancePanelSwitch: PropTypes.bool,
    additionalGuidancePanel: PropTypes.string,
    description: PropTypes.string,
    previewQuestions: PropTypes.bool,
    secondaryTitle: PropTypes.string,
    secondaryDescription: PropTypes.string,
    showOnHub: PropTypes.bool,
    tertiaryTitle: PropTypes.string,
    tertiaryDescription: PropTypes.string,
  }),
  history: CustomPropTypes.history,
};

export default IntroductionEditor;
