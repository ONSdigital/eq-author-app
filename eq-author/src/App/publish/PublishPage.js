import React, { useState } from "react";
import styled from "styled-components";
import { withRouter, Redirect } from "react-router";
import CustomPropTypes from "custom-prop-types";
import { useMutation } from "@apollo/react-hooks";

import { useMe } from "App/MeContext";
import { useQuestionnaire } from "components/QuestionnaireContext";

import { colors } from "constants/theme";
import { AWAITING_APPROVAL, PUBLISHED } from "constants/publishStatus";

import { Field, Input, Label } from "components/Forms";
import { Column } from "components/Grid";
import Button from "components/buttons/Button";
import { InformationPanel } from "components/Panel";
import ScrollPane from "components/ScrollPane";
import Header from "components/EditorLayout/Header";

import triggerPublishMutation from "./triggerPublish.graphql";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
`;

const StyledGrid = styled.div`
  padding: 1em 1em 2em;
  border: 1px solid ${colors.lightGrey};
  border-radius: 0.25em;
  margin: 1em;
  background: ${colors.white};
`;

const Shadow = styled.div`
  background: ${colors.lightMediumGrey};
  padding: 1.25em;
`;

const AlignedColumn = styled(Column)`
  padding: 0;
`;

const Separator = styled.hr`
  border: 0;
  border-top: 0.0625em solid ${colors.lightMediumGrey};
`;

const Caption = styled.p`
  color: ${colors.grey};
  margin-top: 0.2em;
  margin-bottom: 0.6em;
`;

const PublishPage = ({ match, history }) => {
  const questionnaireId = match.params.questionnaireId;
  const originalInputs = { surveyId: "", formType: "" };
  const [inputs, setInputs] = useState(originalInputs);
  const { me } = useMe();
  const { questionnaire } = useQuestionnaire();

  const [triggerPublish] = useMutation(triggerPublishMutation);

  const handleInputChange = event =>
    setInputs({
      ...inputs,
      [event.name]: event.value,
    });

  const publishStatus = questionnaire && questionnaire.publishStatus;
  if (
    !me.admin ||
    publishStatus === AWAITING_APPROVAL ||
    publishStatus === PUBLISHED
  ) {
    return <Redirect to={`/q/${match.params.questionnaireId}`} />;
  }

  return (
    <Container>
      <Header title="Publish" />
      <ScrollPane>
        <StyledGrid>
          <AlignedColumn cols={6}>
            <Field>
              <Label htmlFor="surveyId">Survey ID</Label>
              <Caption>Enter survey ID</Caption>
              <Shadow>
                <Input
                  id="surveyId"
                  onChange={handleInputChange}
                  value={inputs.surveyId}
                />
              </Shadow>
            </Field>
          </AlignedColumn>
          <Separator />
          <AlignedColumn cols={6}>
            <Field>
              <Label htmlFor="formType">Form type</Label>
              <Caption>Enter form type</Caption>
              <Shadow>
                <Input
                  id="formType"
                  onChange={handleInputChange}
                  value={inputs.formType}
                />
              </Shadow>
            </Field>
          </AlignedColumn>
          <Separator />
          <AlignedColumn>
            <InformationPanel maxWidth="50%">
              No further changes can be made to the questionnaire after it has
              been submitted for approval
            </InformationPanel>
          </AlignedColumn>
          <Button
            type="submit"
            variant="primary"
            disabled={!(inputs.surveyId && inputs.formType)}
            data-test="publish-survey-button"
            onClick={() => {
              triggerPublish({
                variables: {
                  input: {
                    questionnaireId,
                    surveyId: inputs.surveyId,
                    formType: inputs.formType,
                  },
                },
              }).then(() => history.push("/"));
            }}
          >
            Submit for approval
          </Button>
        </StyledGrid>
      </ScrollPane>
    </Container>
  );
};

PublishPage.propTypes = {
  match: CustomPropTypes.match.isRequired,
  history: CustomPropTypes.history.isRequired,
};

export default withRouter(PublishPage);
