import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import CustomPropTypes from "custom-prop-types";

import Theme from "contexts/themeContext";

import { Form, Field, Input, Label } from "components/Forms";
import withEntityEditor from "components/withEntityEditor";
import ValidationError from "components/ValidationError";
import Button from "components-themed/buttons";
import ScrollPane from "components/ScrollPane";
import { colors } from "constants/theme";

import questionnaireFragment from "graphql/fragments/questionnaire.graphql";

const StyledScrollPane = styled(ScrollPane)`
  padding: 0px 3px;
  margin: 0px;
`;

const StyledInput = styled(Input)`
  margin-top: 1em;
  &:invalid {
    border: 0.15em solid ${colors.errorPrimary};
  }
  &:focus {
    outline: 3px solid ${colors.primary};
  }
`;

const StyledButton = styled(Button)`
  margin-top: 1em;
  margin-right: ${(props) => props.margin && `0.5em`};
`;

const ButtonContainer = styled.div`
  float: right;
  padding-bottom: 0.3em;
`;

const Paragraph = styled.p`
  font-size: 0.8em;
`;

export const StatelessQuestionnaireMeta = ({
  questionnaire,
  onSubmit,
  onCancel,
  onChange,
  confirmText,
}) => {
  return (
    <StyledScrollPane>
      <Form onSubmit={onSubmit}>
        <Field>
          <Label htmlFor="title">Questionnaire title</Label>
          <StyledInput
            id="title"
            autoFocus
            defaultValue={questionnaire.title}
            onChange={onChange}
            required
            data-test="txt-questionnaire-title"
          />
          {!questionnaire.title && (
            <ValidationError>Questionnaire title required</ValidationError>
          )}
        </Field>
        <Field>
          <Label htmlFor="shortTitle">Short title (optional)</Label>

          <Paragraph>
            *This title is only viewable internally, respondents never see the
            short title*
          </Paragraph>
          <StyledInput
            id="shortTitle"
            defaultValue={questionnaire.shortTitle}
            onChange={onChange}
            data-test="txt-questionnaire-short-title"
          />
        </Field>
        <Theme themeName={"onsLegacyFont"}>
          <ButtonContainer>
            <StyledButton
              onClick={onCancel}
              margin
              variant="secondary"
              type="button"
            >
              Cancel
            </StyledButton>
            <StyledButton
              type="submit"
              variant="primary"
              disabled={!questionnaire.title}
              data-test="questionnaire-submit-button"
            >
              {confirmText}
            </StyledButton>
          </ButtonContainer>
        </Theme>
      </Form>
    </StyledScrollPane>
  );
};

StatelessQuestionnaireMeta.propTypes = {
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
  questionnaire: CustomPropTypes.questionnaire.isRequired,
  confirmText: PropTypes.string.isRequired,
};

StatelessQuestionnaireMeta.fragments = {
  Questionnaire: questionnaireFragment,
};

export default withEntityEditor("questionnaire")(StatelessQuestionnaireMeta);
