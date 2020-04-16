import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import CustomPropTypes from "custom-prop-types";

import { Form, Field, Input, Label, Select } from "components/Forms";
import ToggleSwitch from "components/buttons/ToggleSwitch";
import withEntityEditor from "components/withEntityEditor";
import ButtonGroup from "components/buttons/ButtonGroup";
import Button from "components/buttons/Button";
import DescribedText from "components/DescribedText";
import { Grid, Column } from "components/Grid";

import questionnaireFragment from "graphql/fragments/questionnaire.graphql";

import showConfirmationIcon from "./icon-show-confirmation.svg";
import showNavIcon from "./icon-show-nav.svg";

const Icon = styled.img`
  height: 3em;
  vertical-align: middle;
  margin-right: 1em;
  transition: opacity 100ms linear;
  opacity: ${props => (props.fade ? 0.5 : 1)};
`;

const InlineField = styled(Field)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 1em 0;
  margin: 0 1em 0 0;
`;

const ToggleWrapper = styled.div`
  margin: 0 0 1em;
`;

const FlexLabel = styled(Label)`
  display: flex;
  align-items: center;
`;

export const StatelessQuestionnaireMeta = ({
  questionnaire,
  onSubmit,
  onCancel,
  onChange,
  confirmText,
  canEditType,
}) => (
  <Form onSubmit={onSubmit}>
    <Field>
      <Label htmlFor="title">Questionnaire Title</Label>
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

    <ToggleWrapper>
      <InlineField>
        <FlexLabel inline htmlFor="navigation">
          <Icon src={showNavIcon} alt="" fade={!questionnaire.navigation} />
          <DescribedText description="Allows respondents to navigate between sections when they are completing the survey.">
            Show section navigation
          </DescribedText>
        </FlexLabel>
        <ToggleSwitch
          id="navigation"
          name="navigation"
          onChange={onChange}
          checked={questionnaire.navigation}
        />
      </InlineField>
      <InlineField>
        <FlexLabel inline htmlFor="summary">
          <Icon
            src={showConfirmationIcon}
            alt=""
            fade={!questionnaire.summary}
          />
          <DescribedText description="A summary of all of the respondent's answers will be shown on the confirmation page at the end of the survey.">
            Show summary on confirmation page
          </DescribedText>
        </FlexLabel>
        <ToggleSwitch
          id="summary"
          name="summary"
          onChange={onChange}
          checked={questionnaire.summary}
        />
      </InlineField>
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
