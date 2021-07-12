import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import CustomPropTypes from "custom-prop-types";

import { enableOn, disableOn } from "utils/featureFlags";

import { Form, Field, Input, Label, Select } from "components/Forms";
import ToggleSwitch from "components/buttons/ToggleSwitch";
import withEntityEditor from "components/withEntityEditor";
import ButtonGroup from "components/buttons/ButtonGroup";
import Button from "components/buttons/Button";
import { Grid, Column } from "components/Grid";
import ScrollPane from "components/ScrollPane";
import { InformationPanel } from "components/Panel";
import { colors } from "constants/theme";

import questionnaireFragment from "graphql/fragments/questionnaire.graphql";

const StyledScrollPane = styled(ScrollPane)`
  padding: 5px;
`;

const ToggleWrapper = styled.div`
  margin: 0 0 1em;
`;

const HorizontalSeparator = styled.hr`
  border: 0;
  border-top: 0.0625em solid ${colors.lightMediumGrey};
  margin: 1.5em 0 0.7em;
`;

const InlineField = styled(Field)`
  display: flex;
  align-items: center;
  margin-bottom: 0.4em;
  > * {
    margin-bottom: 0;
  }
`;

const EnableDisableWrapper = styled.div`
  opacity: ${(props) => (props.disabled ? "0.6" : "1")};
  pointer-events: ${(props) => (props.disabled ? "none" : "auto")};
`;

export const StatelessQuestionnaireMeta = ({
  questionnaire,
  onSubmit,
  onCancel,
  onChange,
  confirmText,
  canEditType,
}) => (
  <StyledScrollPane>
    <Form onSubmit={onSubmit}>
      <Field>
        <Label htmlFor="title">Questionnaire title</Label>
        <Input
          id="title"
          autoFocus
          defaultValue={questionnaire.title}
          onChange={onChange}
          required
          data-test="txt-questionnaire-title"
        />
      </Field>
      <Grid>
        <Column cols={6}>
          <Field>
            <Label htmlFor="shortTitle">Short title (optional)</Label>
            <Input
              id="shortTitle"
              defaultValue={questionnaire.shortTitle}
              onChange={onChange}
              data-test="txt-questionnaire-short-title"
            />
          </Field>
        </Column>
        <Column cols={6}>
          <Field disabled={!canEditType}>
            <Label htmlFor="type">Questionnaire type</Label>
            <Select
              id="type"
              onChange={onChange}
              defaultValue={questionnaire.type || ""}
              data-test="select-questionnaire-type"
              disabled={!canEditType}
            >
              <option value="" disabled>
                Please select...
              </option>
              <option value="Business">Business</option>
              <option value="Social">Social</option>
            </Select>
          </Field>
        </Column>
      </Grid>

      <HorizontalSeparator style={{ marginTop: "0.5em" }} />

      <ToggleWrapper>
        {enableOn(["hub"]) && (
          <EnableDisableWrapper disabled={questionnaire.summary}>
            <InlineField>
              <Label>Hub navigation</Label>
              <ToggleSwitch
                id="hub"
                name="hub"
                onChange={onChange}
                checked={questionnaire.hub}
                hideLabels={false}
              />
            </InlineField>
            <InformationPanel>
              Let respondents access different sections of the survey from a
              single central &quot;hub&quot; screen.
            </InformationPanel>
          </EnableDisableWrapper>
        )}
        {disableOn(["hub"]) && (
          <>
            <InlineField>
              <Label>Section navigation</Label>
              <ToggleSwitch
                id="navigation"
                name="navigation"
                onChange={onChange}
                checked={questionnaire.navigation}
                hideLabels={false}
              />
            </InlineField>
            <InformationPanel>
              Let respondents move between sections while they&apos;re
              completing their questionnaire.
            </InformationPanel>
          </>
        )}

        <HorizontalSeparator />
        <EnableDisableWrapper disabled={questionnaire.hub}>
          <InlineField>
            <Label>Answers summary</Label>
            <ToggleSwitch
              id="summary"
              name="summary"
              onChange={onChange}
              checked={questionnaire.summary}
              hideLabels={false}
            />
          </InlineField>
          <InformationPanel>
            Let respondents check their answers before submitting their
            questionnaire.
          </InformationPanel>
        </EnableDisableWrapper>
      </ToggleWrapper>
      <ButtonGroup horizontal align="right">
        <Button onClick={onCancel} variant="secondary" type="button">
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={!(questionnaire.title && questionnaire.type)}
          data-test="questionnaire-submit-button"
        >
          {confirmText}
        </Button>
      </ButtonGroup>
    </Form>
  </StyledScrollPane>
);

StatelessQuestionnaireMeta.defaultProps = {
  canEditType: true,
};

StatelessQuestionnaireMeta.propTypes = {
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
  questionnaire: CustomPropTypes.questionnaire.isRequired,
  confirmText: PropTypes.string.isRequired,
  canEditType: PropTypes.bool,
};

StatelessQuestionnaireMeta.fragments = {
  Questionnaire: questionnaireFragment,
};

export default withEntityEditor("questionnaire")(StatelessQuestionnaireMeta);
