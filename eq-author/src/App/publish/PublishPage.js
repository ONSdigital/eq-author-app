import React, { useState } from "react";
import PropTypes from "prop-types";
import { withRouter, Redirect } from "react-router-dom";
import CustomPropTypes from "custom-prop-types";
import { useMutation } from "@apollo/react-hooks";
import { map, isEmpty, some } from "lodash";

import { useQuestionnaire } from "components/QuestionnaireContext";
import styled, { css } from "styled-components";
import { colors } from "constants/theme";
import { AWAITING_APPROVAL, PUBLISHED } from "constants/publishStatus";

import { Field, Input, Label } from "components/Forms";
import Button from "components/buttons/Button";
import Panel, { InformationPanel } from "components/Panel";
import ScrollPane from "components/ScrollPane";
import Header from "components/EditorLayout/Header";
import ErrorInline from "components/ErrorInline";

import triggerPublishMutation from "./triggerPublish.graphql";

export const themes = [
  "ONS",
  "Northern Ireland",
  "UKIS ONS",
  "UKIS Northern Ireland",
  "Social",
];

export const ErrorContext = styled.div`
  position: relative;

  ${props =>
    props.isInvalid &&
    css`
      margin-bottom: 2em;
      border: 1px solid ${colors.red};
      padding: 1em;
    `}
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
`;

const Shadow = styled.div`
  background: ${colors.lightMediumGrey};
  padding: 1.25em;
  max-width: 45%;
  margin: 0 0.5em 0.5em 0;
  flex: 0 0 45%;
`;

const Separator = styled.hr`
  border: 0;
  border-top: 0.0625em solid ${colors.lightMediumGrey};
`;

const StyledPanel = styled(Panel)`
  max-width: 97.5%;
  margin: 1.5em auto;
  padding: 1.5em;
`;

const Caption = styled.p`
  color: ${colors.grey};
  margin-top: 0.2em;
  margin-bottom: 0.6em;
`;

const ThemeSelector = styled.div`
  display: flex;
  margin: 1.25em 2em 0 0;
`;

const ThemeContainer = styled.div`
  display: inline-flex;
`;

const ThemeInputs = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const LabeledCheckbox = ({ label, handleChange }) => (
  <ThemeSelector>
    <Input
      id={`${label}-input`}
      type="checkbox"
      onChange={e => handleChange(e, label)}
    />
    <Label htmlFor={`${label}-input`}>{label}</Label>
  </ThemeSelector>
);

LabeledCheckbox.propTypes = {
  label: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
};

const PublishPage = ({ match, history }) => {
  const questionnaireId = match.params.questionnaireId;
  const [surveyId, setSurveyId] = useState("");
  const [variants, setVariants] = useState([]);
  const { questionnaire } = useQuestionnaire();

  const [triggerPublish] = useMutation(triggerPublishMutation);

  // const errorValidationMsg = this.props.getValidationError({
  //   field: "variant",
  //   message: "IDs must be different",
  // });
  const handleThemeSelect = (themeCheckbox, label) => {
    const isSelected = themeCheckbox.value;

    if (isSelected) {
      setVariants([...variants, { theme: label, formType: null }]);
    } else {
      setVariants(variants.filter(variant => variant.theme !== label));
    }
  };

  const handleValidation = variant => {
    console.log(variant.theme + " , " + variant.formType);

    // for (const variantIDs of variant) {
    //   if (variantIDs.theme === theme) {
    //     variantIDs.formType = formType;
    //   }

    //   variantIDArray.push(variant);
    //   console.log(variantIDArray);
    // }
  };

  const handleInputChange = event => {
    const theme = event.name;
    const formType = event.value;
    const variantsArray = [];

    for (const variant of variants) {
      if (variant.theme === theme) {
        variant.formType = formType;
      }

      variantsArray.push(variant);
    }
    setVariants(variantsArray);
    let idValidation = false;
    // console.log("first one " + variantsArray[0].formType);
    if (variantsArray[1]) {
      // console.log("second one " + variantsArray[1].formType);

      if (variantsArray[0].formType === variantsArray[1].formType) {
        idValidation = true;
        console.log(idValidation);
      }
    }
  };

  const publishStatus = questionnaire && questionnaire.publishStatus;

  const canPublish = () => {
    if (!questionnaire) {
      return true;
    }
    return questionnaire.permission === "Write";
  };
  if (
    publishStatus === AWAITING_APPROVAL ||
    publishStatus === PUBLISHED ||
    !canPublish()
  ) {
    return <Redirect to={`/q/${match.params.questionnaireId}`} />;
  }

  return (
    <Container>
      <Header title="Publish" />
      <ScrollPane>
        <StyledPanel>
          <Field>
            <Label>Themes</Label>
            <Caption>Select themes to be used for this survey</Caption>
            <ThemeContainer>
              {themes.map(theme => (
                <LabeledCheckbox
                  id={`${theme}-selector`}
                  key={`${theme}-selector`}
                  handleChange={handleThemeSelect}
                  label={theme}
                />
              ))}
            </ThemeContainer>
          </Field>
          <Separator />
          <Field>
            <Label htmlFor="surveyId">Survey ID</Label>
            <Caption>Enter survey ID</Caption>
            <Shadow>
              <Input
                id="surveyId"
                onChange={e => setSurveyId(e.value)}
                value={surveyId}
              />
            </Shadow>
          </Field>
          <Separator />
          {variants.length > 0 && (
            <>
              <Field>
                <Label>Form type</Label>
                <Caption>Enter relevant form types for selected themes</Caption>
                {/* <ErrorContext isInvalid={isInvalid}> */}
                <ThemeInputs>
                  {map(variants, variant => (
                    <Shadow key={`${variant.theme}-entry`}>
                      <Label htmlFor={variant.theme}>{variant.theme}</Label>
                      <Input
                        id={`${variant.theme}`}
                        onChange={handleInputChange}
                        value={variant.formType}
                        data-test={`${variant.theme}-input`}
                        onBlur={handleValidation(variant)}
                      />
                    </Shadow>
                  ))}
                </ThemeInputs>
                {/* {isInvalid && <ErrorInline>{errorValidationMsg}</ErrorInline>} */}
                {/* </ErrorContext> */}
              </Field>
              <Separator />
            </>
          )}
          <InformationPanel>
            No further changes can be made to the questionnaire after it has
            been submitted for approval
          </InformationPanel>
          <Button
            type="submit"
            variant="primary"
            disabled={
              !surveyId ||
              isEmpty(variants) ||
              some(variants, ["formType", null])
            }
            data-test="publish-survey-button"
            onClick={() => {
              triggerPublish({
                variables: {
                  input: {
                    questionnaireId,
                    surveyId,
                    variants,
                  },
                },
              }).then(() => history.push("/"));
            }}
          >
            Submit for approval
          </Button>
        </StyledPanel>
      </ScrollPane>
    </Container>
  );
};

PublishPage.propTypes = {
  match: CustomPropTypes.match.isRequired,
  history: CustomPropTypes.history.isRequired,
};

export default withRouter(PublishPage);
