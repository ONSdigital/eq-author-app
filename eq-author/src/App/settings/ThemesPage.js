import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { withRouter, useParams } from "react-router-dom";
import { useMutation } from "@apollo/react-hooks";

import updateQuestionnaireMutation from "graphql/updateQuestionnaire.graphql";

import { colors } from "constants/theme";

import VerticalTabs from "components/VerticalTabs";
import tabItems from "./TabItems";
import enableThemeMutation from "graphql/enableTheme.graphql";
import disableThemeMutation from "graphql/disableTheme.graphql";
import CollapsibleToggled from "components/CollapsibleToggled";

import Header from "components/EditorLayout/Header";
import ScrollPane from "components/ScrollPane";
import { Field, Label } from "components/Forms";
import WrappingInput from "components/Forms/WrappingInput";
import { Grid, Column } from "components/Grid";

import { getThemeSettingsErrorCount } from "./utils";

import LegalBasis from "App/settings/LegalBasisSelect";
import PreviewTheme from "./PreviewTheme";
import FormType from "./FormType";
import EqId from "./EqId";

import { THEME_TITLES } from "constants/themeSettings";
import {
  THEME_ERROR_MESSAGES,
  SURVEY_ID_ERRORS,
} from "constants/validationMessages";

import ValidationError from "components/ValidationError";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
`;

const SettingsContainer = styled.div`
  padding: 0.8em;
  border-left: 1px solid ${colors.lightGrey};
`;

const PageMainCanvas = styled.div`
  display: flex;
  border: 1px solid ${colors.lightGrey};
  border-radius: 4px;
  background: ${colors.white};
`;

const PageContainer = styled.div`
  padding: 0.8em;
  border-left: 1px solid ${colors.lightGrey};
  &:focus-visible {
    border: 3px solid ${colors.focus};
    margin: 0;
    outline: none;
  }
`;

const Panel = styled.div`
  max-width: 97.5%;
  padding: 1.3em;
`;

const Flex = styled.div`
  overflow: hidden;
  padding: 0 0 4px 4px;
  margin: 1em 0;
  display: flex;
  gap: 0.5em;
  flex-wrap: wrap;
`;

const FlexBreak = styled.div`
  flex-basis: 100%;
  height: 0;
`;

const StyledInput = styled(WrappingInput)`
  width: 11em;
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

const Heading = styled.h2`
  font-size: 1em;
  margin-top: 0;
`;

const Text = styled.p``;

const ThemesPage = ({ questionnaire }) => {
  const { type, surveyId, id, themeSettings } = questionnaire;
  const { themes: questionnaireThemes, previewTheme } = themeSettings;
  const removedThemes = ["covid", "epe", "epenorthernireland"];

  const [updateQuestionnaire] = useMutation(updateQuestionnaireMutation);
  const [enableTheme] = useMutation(enableThemeMutation);
  const [disableTheme] = useMutation(disableThemeMutation);
  const [questionnaireId, setQuestionnaireId] = useState(surveyId);
  const params = useParams();

  const surveyIdError =
    SURVEY_ID_ERRORS[
      questionnaire?.validationErrorInfo?.errors?.find(
        ({ field }) => field === "surveyId"
      )?.errorCode
    ];

  const handleBlur = ({ value }) => {
    value = value.trim();
    updateQuestionnaire({
      variables: { input: { id, surveyId: value } },
    });
  };

  const toggleTheme = ({ shortName, enabled }) => {
    const mutation = enabled ? disableTheme : enableTheme;
    mutation({
      variables: { input: { questionnaireId: id, shortName } },
    });
  };

  const groupErrorMessages = themeSettings.validationErrorInfo.errors
    .filter(({ type }) => type === "themeSettings")
    .map(({ errorCode }) => THEME_ERROR_MESSAGES[errorCode]);

  const renderErrors = (errors) =>
    errors.map((errorMessage, index) => (
      <ValidationError key={index}>{errorMessage}</ValidationError>
    ));

  const findErrorsByCodePrefix = ({ errors }, prefix) =>
    errors.map(
      ({ errorCode, ...rest }) =>
        errorCode.includes(prefix) && { errorCode, ...rest }
    );

  const removeDisabledThemes = () => {
    return questionnaireThemes.filter(
      (theme) => !removedThemes.includes(theme.id)
    );
  };

  const renderThemes = (themes, previewTheme, questionnaireId) =>
    themes.map(
      ({
        shortName,
        eqId,
        enabled,
        formType,
        legalBasisCode,
        validationErrorInfo,
      }) => (
        <CollapsibleToggled
          key={`${shortName}-toggle`}
          title={THEME_TITLES[shortName]}
          isOpen={enabled}
          onChange={() => toggleTheme({ shortName, enabled })}
          data-test={`${shortName}-toggle`}
          ariaLabel={THEME_TITLES[shortName]}
          headerContent={
            enabled && (
              <PreviewTheme
                questionnaireId={questionnaireId}
                thisTheme={shortName}
                previewTheme={previewTheme}
              />
            )
          }
        >
          <Flex>
            <EqId eqId={eqId} questionnaireId={id} shortName={shortName} />
            <FormType
              formType={formType}
              questionnaireId={id}
              shortName={shortName}
              errors={findErrorsByCodePrefix(
                validationErrorInfo,
                "ERR_FORM_TYPE"
              )}
            />
            <FlexBreak />
            <LegalBasis
              legalBasis={legalBasisCode}
              questionnaireId={id}
              shortName={shortName}
            />
          </Flex>
        </CollapsibleToggled>
      )
    );

  return (
    <Container>
      <ScrollPane>
        <Header title="Settings" />
        <PageContainer tabIndex="-1" className="keyNav">
          <PageMainCanvas>
            <Grid>
              <VerticalTabs
                title="Questionnaire settings"
                cols={2.5}
                tabItems={tabItems({
                  params,
                  type,
                  themeErrorCount: getThemeSettingsErrorCount(questionnaire),
                })}
              />
              <Column gutters={false} cols={9.5}>
                <SettingsContainer>
                  <Panel>
                    <Heading>Themes, IDs, form types and legal bases</Heading>
                    <Text data-test="theme-description">
                      The theme sets the design of the eQ for respondents. It
                      changes the header across the survey, as well as the
                      contact details and the legal basis on the introduction
                      page. The COVID theme also changes the thank you page
                      respondents see once they&apos;ve submitted the survey.
                    </Text>
                    <Text>
                      The preview theme is applied when you view the survey
                      using the View Survey button.
                    </Text>
                    <Field>
                      <Label htmlFor="surveyId">Survey ID</Label>
                      <Caption>
                        The three-digit survey ID. For example, &apos;283&apos;
                      </Caption>
                      <StyledInput
                        maxLength="3"
                        id="surveyId"
                        value={questionnaireId}
                        onChange={({ value }) => setQuestionnaireId(value)}
                        onBlur={(e) => handleBlur({ ...e.target })}
                        data-test="change-questionnaire-id"
                        errorValidationMsg={surveyIdError}
                      />
                    </Field>
                    <HorizontalSeparator />
                    {renderErrors(groupErrorMessages)}
                    {renderThemes(removeDisabledThemes(), previewTheme, id)}
                  </Panel>
                </SettingsContainer>
              </Column>
            </Grid>
          </PageMainCanvas>
        </PageContainer>
      </ScrollPane>
    </Container>
  );
};
ThemesPage.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  questionnaire: PropTypes.object.isRequired,
};

export default withRouter(ThemesPage);
