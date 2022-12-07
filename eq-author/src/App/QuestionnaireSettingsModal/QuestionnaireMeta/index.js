import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import CustomPropTypes from "custom-prop-types";

import Theme from "contexts/themeContext";

import { Form, Field, Input, Label, Select } from "components/Forms";
import ToggleSwitch from "components/buttons/ToggleSwitch";
import withEntityEditor from "components/withEntityEditor";
import ValidationError from "components/ValidationError";
// import ButtonGroup from "components/buttons/ButtonGroup";
import Button from "components-themed/buttons";
import { Grid, Column } from "components/Grid";
import ScrollPane from "components/ScrollPane";
import { InformationPanel } from "components/Panel";
import { colors } from "constants/theme";

import questionnaireFragment from "graphql/fragments/questionnaire.graphql";

const StyledScrollPane = styled(ScrollPane)`
  padding: 0px 3px;
  margin: 0px;
`;

const ToggleWrapper = styled.div`
  margin: 0 0 1em;
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
  // TODO: remove updatedFontTheme when theme container is fixed for fontSize 18px
  updatedFontTheme,
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
        {/* <Grid>
        <Column cols={6}> */}
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
        {/* </Column>
        <Column cols={6}> */}
        {/* <Field disabled={!canEditType}>
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
          </Field> */}
        {/* </Column>
      </Grid> */}

        {/* <HorizontalSeparator style={{ marginTop: "0.5em" }} /> */}

        {/* <ToggleWrapper>
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
      </ToggleWrapper> */}
        <Theme themeName={"ons"}>
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

StatelessQuestionnaireMeta.defaultProps = {
  canEditType: false,
};

StatelessQuestionnaireMeta.propTypes = {
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
  questionnaire: CustomPropTypes.questionnaire.isRequired,
  confirmText: PropTypes.string.isRequired,
  canEditType: PropTypes.bool,
  updatedFontTheme: PropTypes.bool, // TODO: remove updatedFontTheme when theme container is fixed for fontSize 18px
};

StatelessQuestionnaireMeta.fragments = {
  Questionnaire: questionnaireFragment,
};

export default withEntityEditor("questionnaire")(StatelessQuestionnaireMeta);
