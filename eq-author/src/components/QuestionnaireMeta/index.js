import React from "react";
import PropTypes from "prop-types";
import CustomPropTypes from "custom-prop-types";
import { Form, Field, Input, Label } from "components/Forms";
import withEntityEditor from "components/withEntityEditor";
import questionnaireFragment from "graphql/fragments/questionnaire.graphql";
import ToggleSwitch from "components/ToggleSwitch";
import styled from "styled-components";
import showNavIcon from "./icon-show-nav.svg";
import showConfirmationIcon from "./icon-show-confirmation.svg";
import ButtonGroup from "components/ButtonGroup";
import Button from "components/Button";

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
  border-top: 1px solid #ebebeb;

  &:last-child {
    border-bottom: 1px solid #ebebeb;
  }
`;

const ToggleWrapper = styled.div`
  margin: 2em 0 3em;
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
    <ToggleWrapper>
      <InlineField>
        <Label inline htmlFor="navigation">
          <Icon src={showNavIcon} alt="" fade={!questionnaire.navigation} />
          Show section navigation
        </Label>
        <ToggleSwitch
          id="navigation"
          name="navigation"
          onChange={onChange}
          checked={questionnaire.navigation}
        />
      </InlineField>
      <InlineField>
        <Label inline htmlFor="summary">
          <Icon
            src={showConfirmationIcon}
            alt=""
            fade={!questionnaire.summary}
          />
          Show summary on confirmation page
        </Label>
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
