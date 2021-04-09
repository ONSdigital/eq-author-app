import React, { useState } from "react";
import styled from "styled-components";
import { colors } from "constants/theme";
import { Field, Input, Label } from "components/Forms";
import PropTypes from "prop-types";
import { withRouter, useParams } from "react-router-dom";

import { useMutation } from "react-apollo";

import updateQuestionnaireMutation from "graphql/updateQuestionnaire.graphql";

import VerticalTabs from "components/VerticalTabs";
import tabItems from "./TabItems";

import { Grid, Column } from "components/Grid";
import Header from "components/EditorLayout/Header";
import ScrollPane from "components/ScrollPane";
import ToggleSwitch from "components/buttons/ToggleSwitch";
import { InformationPanel } from "components/Panel";

const StyledPanel = styled.div`
  max-width: 97.5%;
  padding: 1.3em;
`;

const StyledInput = styled(Input)`
  width: 31em;
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

const VerticalSeparator = styled.div`
  width: 1px;
  height: 1.5em;
  background-color: ${colors.blue};
  margin-left: 0.8em;
  margin-bottom: 0.4em;
`;

const CollapsibleWrapper = styled.div`
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
`;

const Pill = ({ children, testId }) => {
  const Container = styled.div`
    width: 4em;
    padding: 0.5em 1em;
    box-sizing: content-box;
    background-color: ${colors.lightMediumGrey};
    text-align: center;

    p {
      margin: 0;
      font-weight: bold;
    }
  `;
  return (
    <Container>
      <p data-test={testId}>{children}</p>
    </Container>
  );
};

Pill.propTypes = {
  children: PropTypes.string.isRequired,
  testId: PropTypes.string.isRequired,
};

const GeneralSettingsPage = ({ questionnaire }) => {
  const {
    title,
    shortTitle,
    type,
    id,
    navigation,
    summary,
    collapsibleSummary,
  } = questionnaire;

  const handleTitleChange = ({ value }) => {
    value = value.trim();
    if (value !== "") {
      updateQuestionnaire({
        variables: { input: { id, title: value } },
      });
    }
  };

  const handleShortTitleChange = ({ value }) => {
    value = value.trim();
    updateQuestionnaire({
      variables: { input: { id, shortTitle: value } },
    });
  };

  const [updateQuestionnaire] = useMutation(updateQuestionnaireMutation);
  const [questionnaireTitle, setQuestionnaireTitle] = useState(title);
  const [questionnaireShortTitle, setQuestionnaireShortTitle] = useState(
    shortTitle
  );

  const params = useParams();

  return (
    <Container>
      <ScrollPane>
        <Header title="Settings" />
        <PageContainer>
          <PageMainCanvas>
            <Grid>
              <VerticalTabs
                title="Questionnaire settings"
                cols={2.5}
                tabItems={tabItems(params, type)}
              />
              <Column gutters={false} cols={9.5}>
                <SettingsContainer>
                  <StyledPanel>
                    <Field>
                      <Label>Questionnaire title</Label>
                      <Caption>Changes the questionnaire&apos;s title.</Caption>
                      <StyledInput
                        value={questionnaireTitle}
                        onChange={({ value }) => setQuestionnaireTitle(value)}
                        onBlur={(e) => handleTitleChange({ ...e.target })}
                        data-test="change-questionnaire-title"
                      />
                    </Field>
                    <Field>
                      <Label>Short title (optional)</Label>
                      <Caption>
                        {shortTitle ? "Changes" : "Adds"} the
                        questionnaire&apos;s short title. This is only used
                        within Author. Respondents always see the full
                        questionnaire title.
                      </Caption>
                      <StyledInput
                        value={questionnaireShortTitle}
                        onChange={({ value }) =>
                          setQuestionnaireShortTitle(value)
                        }
                        onBlur={(e) => handleShortTitleChange({ ...e.target })}
                        data-test="change-questionnaire-short-title"
                      />
                    </Field>
                    <HorizontalSeparator />
                    <Field>
                      <Label>Questionnaire type</Label>
                      <Pill testId="questionnaire-type">{type}</Pill>
                    </Field>
                    <HorizontalSeparator />
                    <InlineField>
                      <Label>Section navigation</Label>
                      <VerticalSeparator />
                      <ToggleSwitch
                        id="toggle-section-navigation"
                        name="toggle-section-navigation"
                        hideLabels={false}
                        onChange={({ value }) =>
                          updateQuestionnaire({
                            variables: { input: { id, navigation: value } },
                          })
                        }
                        checked={navigation}
                      />
                    </InlineField>
                    <InformationPanel>
                      Let respondents move between sections while they&apos;re
                      completing the questionnaire.
                    </InformationPanel>
                    <HorizontalSeparator />
                    <Label>Summary page</Label>
                    <Caption>
                      Let respondents view and change their answers before
                      submitting them. You can set the list of sections to be
                      collapsible, so respondents can show and hide their
                      answers for individual sections.
                    </Caption>
                    <InlineField>
                      <Label>Answers summary</Label>
                      <VerticalSeparator />
                      <ToggleSwitch
                        id="toggle-answer-summary"
                        name="toggle-answer-summary"
                        hideLabels={false}
                        onChange={({ value }) =>
                          updateQuestionnaire({
                            variables: {
                              input: {
                                id,
                                summary: value,
                                collapsibleSummary: false,
                              },
                            },
                          })
                        }
                        checked={summary}
                      />
                    </InlineField>
                    <CollapsibleWrapper disabled={!summary}>
                      <InlineField>
                        <Label>Collapsible sections</Label>
                        <VerticalSeparator />
                        <ToggleSwitch
                          id="toggle-collapsible-summary"
                          name="toggle-collapsible-summary"
                          hideLabels={false}
                          onChange={({ value }) =>
                            updateQuestionnaire({
                              variables: {
                                input: { id, collapsibleSummary: value },
                              },
                            })
                          }
                          checked={collapsibleSummary}
                        />
                      </InlineField>
                    </CollapsibleWrapper>
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

GeneralSettingsPage.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  questionnaire: PropTypes.object.isRequired,
};

export default withRouter(GeneralSettingsPage);
