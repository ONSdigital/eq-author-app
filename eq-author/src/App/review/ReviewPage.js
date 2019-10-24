import React from "react";
import styled from "styled-components";
import { withRouter, Redirect } from "react-router";
import { useMutation } from "@apollo/react-hooks";
import CustomPropTypes from "custom-prop-types";

import { useMe } from "App/MeContext";
import { useQuestionnaire } from "components/QuestionnaireContext";

import { colors } from "constants/theme";
import { AWAITING_APPROVAL } from "constants/publishStatus";

import Header from "components/EditorLayout/Header";
import Panel from "components/Panel";
import { Label } from "components/Forms";
import Button from "components/buttons/Button";

import reviewQuestionnaireMutation from "./reviewQuestionnaire.graphql";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const ContentContainer = styled(Panel)`
  margin: 1em;
  padding: 1em;
`;

const Caption = styled.p`
  color: ${colors.grey};
  margin-top: 0.2em;
  margin-bottom: 0.6em;
`;

const Separator = styled.hr`
  border: 0;
  border-top: 0.0625em solid ${colors.lightMediumGrey};
  margin: 1.5em 0;
`;

const ReviewPage = ({ match, history }) => {
  const [reviewQuestionnaire] = useMutation(reviewQuestionnaireMutation);
  const questionnaireId = match.params.questionnaireId;
  const { me } = useMe();
  const { questionnaire } = useQuestionnaire();

  const sendReview = reviewAction =>
    reviewQuestionnaire({
      variables: {
        input: {
          questionnaireId,
          reviewAction,
        },
      },
    });

  const publishStatus = questionnaire && questionnaire.publishStatus;
  if (!me.admin || publishStatus !== AWAITING_APPROVAL) {
    return <Redirect to={`/q/${match.params.questionnaireId}`} />;
  }

  return (
    <Container>
      <Header title="Review" />
      <ContentContainer>
        <Label>Questionnaire review</Label>
        <Caption>
          This questionnaire is awaiting review, please approve or reject below
        </Caption>
        <Separator />
        <Button
          type="submit"
          variant="positive"
          data-test="approve-review-btn"
          onClick={() => sendReview("Approved").then(() => history.push("/"))}
        >
          Approve
        </Button>
      </ContentContainer>
    </Container>
  );
};

ReviewPage.propTypes = {
  match: CustomPropTypes.match.isRequired,
  history: CustomPropTypes.history.isRequired,
};

export default withRouter(ReviewPage);
