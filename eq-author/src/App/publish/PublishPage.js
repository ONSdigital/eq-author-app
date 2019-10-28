import React, { useState, useEffect } from "react";
import { get } from "lodash/fp";
import styled from "styled-components";
import { colors } from "constants/theme";
import { withRouter } from "react-router";
import CustomPropTypes from "custom-prop-types";

import { useLazyQuery } from "@apollo/react-hooks";

import { Field, Input, Label } from "components/Forms";
import { Column } from "components/Grid";
import Button from "components/buttons/Button";
import Panel from "components/Panel";
import ScrollPane from "components/ScrollPane";
import Header from "components/EditorLayout/Header";

import TRIGGER_PUBLISH_QUERY from "./publishQuestionnaire.graphql";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const StyledGrid = styled.div`
  padding: 1em 1em 2em;
  border: 1px solid ${colors.lightGrey};
  border-radius: 0.25em;
  margin: 1em;
  background: ${colors.white};
  overflow: hidden;
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

const InformationPanel = styled(Panel)`
  background-color: ${colors.paleBlue};
  border: 0;
  border-radius: 0;
  border-left: 0.5em solid ${colors.darkerBlue};
  padding: 1em;
  margin: 1em 0;
  max-width: 50%;
`;

const StyledScrollPane = styled(ScrollPane)`
  padding: 5px;
`;

const PublishPage = ({ match }) => {
  const questionnaireId = match.params.questionnaireId;
  const originalInputs = { surveyId: "", formType: "" };
  const [inputs, setInputs] = useState(originalInputs);

  const [publishSurvey, { data: triggeredPublishData }] = useLazyQuery(
    TRIGGER_PUBLISH_QUERY
  );

  useEffect(() => {
    const launchUrl = get("triggerPublish.launchUrl", triggeredPublishData);

    if (launchUrl) {
      setInputs(originalInputs);
      alert(`You survey is now published at: ${launchUrl}`);
    }
  }, [triggeredPublishData]);

  const handleInputChange = event => {
    setInputs({
      ...inputs,
      [event.name]: event.value,
    });
  };

  return (
    <Container>
      <Header title="Publish" />
      <StyledGrid>
        <StyledScrollPane>
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
            <InformationPanel>
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
              publishSurvey({
                variables: {
                  input: {
                    questionnaireId: questionnaireId,
                    surveyId: inputs.surveyId,
                    formType: inputs.formType,
                  },
                },
              });
            }}
          >
            Publish
          </Button>
        </StyledScrollPane>
      </StyledGrid>
    </Container>
  );
};

PublishPage.propTypes = {
  match: CustomPropTypes.match,
};

export default withRouter(PublishPage);
