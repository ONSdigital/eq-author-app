import React from "react";
import PropTypes from "prop-types";
import CustomPropTypes from "custom-prop-types";
import { Form, Field, Input, Label, Select } from "components/Forms";
import { Grid, Column } from "components/Grid";
import withEntityEditor from "components/withEntityEditor";
import questionnaireFragment from "graphql/fragments/questionnaire.graphql";
import ToggleSwitch from "components/buttons/ToggleSwitch";
import styled from "styled-components";
import showNavIcon from "./icon-show-nav.svg";
import showConfirmationIcon from "./icon-show-confirmation.svg";
import ButtonGroup from "components/buttons/ButtonGroup";
import Button from "components/buttons/Button";

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

const Small = styled.small`
  font-weight: normal;
  font-size: 0.9em;
  &::before {
    content: "";
    display: block;
    margin-right: 1em;
  }
`;

export const StatelessQuestionnaireMeta = ({
  questionnaire,
  onSubmit,
  onCancel,
  onChange,
  confirmText
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
          <Label htmlFor="description">Short title (optional)</Label>
          <Input
            id="description"
            defaultValue={questionnaire.description}
            onChange={onChange}
          />
        </Field>
      </Column>
      <Column cols={6}>
        <Field>
          <Label htmlFor="theme">Questionnaire type</Label>
          <Select
            id="theme"
            onChange={onChange}
            defaultValue={questionnaire.theme}
          >
            <option value="default">Business</option>
            <option value="census">Social</option>
          </Select>
        </Field>
      </Column>
    </Grid>

    <ToggleWrapper>
      <InlineField>
        <FlexLabel inline htmlFor="navigation">
          <Icon
            src={showNavIcon}
            alt="Show section navigation"
            fade={!questionnaire.navigation}
          />
          <span>
            <span>Show section navigation</span>

            <Small>
              Allows respondents to navigate between sections when they are
              completing the survey.
            </Small>
          </span>
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
          <span>
            <span>Show summary on confirmation page</span>
            <Small>
              A summary of the all of the respondents answers will be on the
              confirmation page at the end of the survey.
            </Small>
          </span>
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
      <Button type="submit" variant="primary">
        {confirmText}
      </Button>
    </ButtonGroup>
  </Form>
);

StatelessQuestionnaireMeta.propTypes = {
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
  questionnaire: CustomPropTypes.questionnaire.isRequired,
  confirmText: PropTypes.string.isRequired
};

StatelessQuestionnaireMeta.fragments = {
  Questionnaire: questionnaireFragment
};

export default withEntityEditor("questionnaire", questionnaireFragment)(
  StatelessQuestionnaireMeta
);
