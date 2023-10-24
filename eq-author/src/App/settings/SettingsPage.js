import React, { useState } from "react";
import styled from "styled-components";
import { colors } from "constants/theme";
import { Field, Input, Label } from "components/Forms";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

import { useMutation } from "@apollo/react-hooks";

import updateQuestionnaireMutation from "graphql/updateQuestionnaire.graphql";
import updateQuestionnaireIntroductionMutation from "graphql/updateQuestionnaireIntroduction.graphql";

import ThemeSelect from "./ThemeSelect";

import { Grid, Column } from "components/Grid";
import Header from "components/EditorLayout/Header";
import ScrollPane from "components/ScrollPane";
import ToggleSwitch from "components/buttons/ToggleSwitch";
import ValidationError from "components/ValidationError";

import {
  SURVEY_ID_ERRORS,
  FORM_TYPE_ERRORS,
  EQ_ID_ERRORS,
} from "constants/validationMessages";
import LegalBasisSelect from "./LegalBasisSelect";

import { FormatText } from "components/modals/PasteModal";

const StyledPanel = styled.div`
  max-width: 97.5%;
  padding: 1.3em;
`;

const StyledInput = styled(Input)`
  width: ${(props) => (props.small ? `11em` : `31em`)};
  border-color: ${(props) => props.error && `${colors.errorPrimary}`};
`;

const Caption = styled.p`
  margin-top: 0.2em;
  margin-bottom: 0.6em;
  font-size: 0.85em;
`;

const HorizontalSeparator = styled.hr`
  border: 0;
  border-top: 0.0625em solid ${colors.lightMediumGrey};
  margin: 1.5em 0;
`;

const EnableDisableWrapper = styled.div`
  opacity: ${(props) => (props.disabled ? "0.6" : "1")};
  pointer-events: ${(props) => (props.disabled ? "none" : "auto")};
`;

const InlineField = styled(Field)`
  display: flex;
  align-items: center;
  margin-bottom: 0.4em;

  > * {
    margin-bottom: 0;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
`;

const SettingsContainer = styled.div`
  padding: 0.8em;
`;

const PageMainCanvas = styled.div`
  display: flex;
  border: 1px solid ${colors.lightGrey};
  border-radius: 4px;
  background: ${colors.white};
`;

const PageContainer = styled.div`
  padding: 0.8em;
  &:focus {
    border: 3px solid #fdbd56;
    margin: 0;
    outline: none;
  }
  &:focus:not(:focus-visible) {
    border: none;
    margin: 0;
    outline: none;
  }
`;

const SettingsPage = ({ questionnaire }) => {
  const {
    title,
    shortTitle,
    id: questionnaireId,
    qcodes,
    hub,
    summary,
    introduction,
    surveyId: initialSurveyId,
    eqId: initialEqId,
    formType: initialFormType,
    theme,
    legalBasis,
  } = questionnaire;

  const showOnHub = introduction?.showOnHub;

  const handleTitleChange = ({ value }) => {
    value = value.trim();
    if (value !== "") {
      updateQuestionnaire({
        variables: { input: { id: questionnaireId, title: value } },
      });
    }
  };

  const handleShortTitleChange = ({ value }) => {
    value = value.trim();
    updateQuestionnaire({
      variables: { input: { id: questionnaireId, shortTitle: value } },
    });
  };

  const [updateQuestionnaire] = useMutation(updateQuestionnaireMutation);
  const [updateQuestionnaireIntroduction] = useMutation(
    updateQuestionnaireIntroductionMutation
  );

  const [questionnaireTitle, setQuestionnaireTitle] = useState(title);
  const [questionnaireShortTitle, setQuestionnaireShortTitle] =
    useState(shortTitle);
  const [surveyId, setSurveyId] = useState(initialSurveyId);
  const [eqId, setEqId] = useState(initialEqId);
  const [formType, setFormType] = useState(initialFormType);

  const getValidationErrorMessage = (contentType) => {
    if (contentType === "surveyId") {
      return SURVEY_ID_ERRORS[
        questionnaire?.validationErrorInfo?.errors?.find(
          ({ field }) => field === "surveyId"
        )?.errorCode
      ];
    }

    if (contentType === "formType") {
      return FORM_TYPE_ERRORS[
        questionnaire?.validationErrorInfo?.errors?.find(
          ({ field }) => field === "formType"
        )?.errorCode
      ];
    }

    if (contentType === "eqId") {
      return EQ_ID_ERRORS[
        questionnaire?.validationErrorInfo?.errors?.find(
          ({ field }) => field === "eqId"
        )?.errorCode
      ];
    }
  };

  return (
    <Container>
      <ScrollPane>
        <Header title="Settings" />
        <PageContainer tabIndex="-1" className="keyNav">
          <PageMainCanvas>
            <Grid>
              <Column gutters={false} cols={9.5}>
                <SettingsContainer>
                  <StyledPanel>
                    <Field>
                      <Label htmlFor="questionnaireTitle">
                        Questionnaire title
                      </Label>
                      <Caption>Changes the questionnaire&apos;s title.</Caption>
                      <StyledInput
                        id="questionnaireTitle"
                        value={questionnaireTitle}
                        onChange={({ value }) =>
                          setQuestionnaireTitle(FormatText(value))
                        }
                        onBlur={(e) => handleTitleChange({ ...e.target })}
                        data-test="change-questionnaire-title"
                      />
                    </Field>
                    <Field>
                      <Label htmlFor="shortTitle">Short title (optional)</Label>
                      <Caption>
                        {shortTitle ? "Changes" : "Adds"} the
                        questionnaire&apos;s short title. This is only used
                        within Author. Respondents always see the full
                        questionnaire title.
                      </Caption>
                      <StyledInput
                        id="shortTitle"
                        value={questionnaireShortTitle}
                        onChange={({ value }) =>
                          setQuestionnaireShortTitle(FormatText(value))
                        }
                        onBlur={(e) => handleShortTitleChange({ ...e.target })}
                        data-test="change-questionnaire-short-title"
                      />
                    </Field>
                    <Field>
                      <Label htmlFor="surveyId">Survey ID</Label>
                      <Caption>
                        The three-digit survey ID. For example, &apos;283&apos;
                      </Caption>
                      <StyledInput
                        id="surveyId"
                        maxLength="3"
                        small
                        value={surveyId}
                        onChange={({ value }) => setSurveyId(value)}
                        onBlur={() =>
                          updateQuestionnaire({
                            variables: {
                              input: {
                                id: questionnaireId,
                                surveyId,
                              },
                            },
                          })
                        }
                        error={getValidationErrorMessage("surveyId")}
                        data-test="input-survey-id"
                      />
                      {getValidationErrorMessage("surveyId") && (
                        <ValidationError>
                          {getValidationErrorMessage("surveyId")}
                        </ValidationError>
                      )}
                    </Field>
                    <Field>
                      <Label htmlFor="formType">Form type</Label>
                      <Caption>
                        A four-digit identifier. For example, &apos;2834&apos;
                      </Caption>
                      <StyledInput
                        id="formType"
                        maxLength="4"
                        small
                        value={formType}
                        onChange={({ value }) => {
                          setFormType(value);
                        }}
                        onBlur={() =>
                          updateQuestionnaire({
                            variables: {
                              input: { id: questionnaireId, formType },
                            },
                          })
                        }
                        error={getValidationErrorMessage("formType")}
                        data-test="input-form-type"
                      />
                      {getValidationErrorMessage("formType") && (
                        <ValidationError>
                          {getValidationErrorMessage("formType")}
                        </ValidationError>
                      )}
                    </Field>
                    <Field>
                      <Label htmlFor="eQID">eQ ID</Label>
                      <Caption>A freeform identifier</Caption>
                      <StyledInput
                        id="eQID"
                        small
                        value={eqId}
                        onChange={({ value }) => setEqId(value)}
                        onBlur={() =>
                          updateQuestionnaire({
                            variables: { input: { id: questionnaireId, eqId } },
                          })
                        }
                        error={getValidationErrorMessage("eqId")}
                        data-test="input-eq-id"
                      />
                      {getValidationErrorMessage("eqId") && (
                        <ValidationError>
                          {getValidationErrorMessage("eqId")}
                        </ValidationError>
                      )}
                    </Field>
                    <HorizontalSeparator />
                    <InlineField>
                      <Label htmlFor="toggle-qcodes">QCodes</Label>
                      <ToggleSwitch
                        id="toggle-qcodes"
                        name="toggle-qcodes"
                        hideLabels={false}
                        onChange={({ value }) =>
                          updateQuestionnaire({
                            variables: {
                              input: { id: questionnaireId, qcodes: value },
                            },
                          })
                        }
                        checked={qcodes}
                      />
                    </InlineField>
                    <Caption>
                      QCodes are a way to identify answers when they&apos;re
                      sent downstream.
                    </Caption>
                    <HorizontalSeparator />
                    <>
                      <EnableDisableWrapper
                        data-test="toggle-hub-introduction-wrapper"
                        disabled={!introduction || !hub}
                      >
                        <InlineField disabled={!hub}>
                          <Label htmlFor="toggle-hub-introduction">
                            Show introduction page on hub
                          </Label>
                          <ToggleSwitch
                            id="toggle-hub-introduction"
                            name="toggle-hub-introduction"
                            hideLabels={false}
                            onChange={({ value }) =>
                              updateQuestionnaireIntroduction({
                                variables: {
                                  input: { showOnHub: value },
                                },
                              })
                            }
                            checked={showOnHub}
                          />
                        </InlineField>
                      </EnableDisableWrapper>
                    </>
                    <HorizontalSeparator />
                    <Label>Summary page</Label>
                    <Caption>
                      Let respondents view and change their answers before
                      submitting them. You can set the list of sections to be
                      collapsible, so respondents can show and hide their
                      answers for individual sections.
                    </Caption>

                    <EnableDisableWrapper disabled={hub}>
                      <InlineField>
                        <Label htmlFor="toggle-answer-summary">
                          Answers summary
                        </Label>
                        <ToggleSwitch
                          id="toggle-answer-summary"
                          name="toggle-answer-summary"
                          hideLabels={false}
                          disabled={hub}
                          onChange={({ value }) =>
                            updateQuestionnaire({
                              variables: {
                                input: {
                                  id: questionnaireId,
                                  summary: value,
                                  collapsibleSummary: false,
                                },
                              },
                            })
                          }
                          checked={summary}
                        />
                      </InlineField>
                    </EnableDisableWrapper>
                    <HorizontalSeparator />
                    <Field>
                      <Label htmlFor="theme">Theme</Label>
                      <Caption>
                        The theme controls the design and branding of the header
                        within eQ.
                      </Caption>
                      <ThemeSelect
                        questionnaireId={questionnaireId}
                        selectedTheme={theme}
                      />
                    </Field>
                    <Field>
                      <Label htmlFor="legalBasis">Legal basis</Label>
                      <Caption>
                        The legal basis appears on the survey introduction page.
                      </Caption>
                      <LegalBasisSelect
                        questionnaireId={questionnaireId}
                        selectedLegalBasis={legalBasis}
                      />
                    </Field>
                  </StyledPanel>
                </SettingsContainer>
              </Column>
            </Grid>
          </PageMainCanvas>
        </PageContainer>
      </ScrollPane>
    </Container>
  );
};

SettingsPage.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  questionnaire: PropTypes.object.isRequired,
};

export default withRouter(SettingsPage);
