import React from "react";
import PropTypes from "prop-types";
import gql from "graphql-tag";
import { flowRight } from "lodash";

import { useMutation, useQuery } from "@apollo/react-hooks";

import { useHistory } from "react-router-dom";
import { buildQuestionnairePath } from "utils/UrlUtils";
import Layout from "components/Layout";
import Loading from "components/Loading";
import Error from "components/Error";
import Theme from "contexts/themeContext";

import * as Headings from "constants/table-headings";

import QuestionnairesTable from "components-themed/HomepageQuestionnairesView/QuestionnairesTable";
import QuestionnairesView from "components-themed/HomepageQuestionnairesView";

import deleteQuestionnaireMutation from "graphql/deleteQuestionnaire.graphql";

import { withShowToast } from "components/Toasts";
import withCreateQuestionnaire from "./withCreateQuestionnaire";
import withDuplicateQuestionnaire from "./withDuplicateQuestionnaire";

import useLockStatusSubscription from "hooks/useLockStatusSubscription";
import WarningBanner from "components/WarningBanner";
import bannerMessage from "constants/banner-message";

export const QUESTIONNAIRES_QUERY = gql`
  query GetQuestionnaireList {
    questionnaires {
      ...QuestionnaireDetails
    }
  }
  ${QuestionnairesTable.fragments.QuestionnaireDetails}
`;

const enabledHeadings = [
  Headings.TITLE,
  Headings.OWNER,
  Headings.CREATED,
  Headings.MODIFIED,
  Headings.LOCKED,
  Headings.STARRED,
  Headings.ACCESS,
  Headings.ACTIONS,
];

const QuestionnairesPage = ({
  showToast,
  onDuplicateQuestionnaire,
  onCreateQuestionnaire,
}) => {
  useLockStatusSubscription();
  const history = useHistory();
  const [deleteQuestionnaire] = useMutation(deleteQuestionnaireMutation);

  const { error, data, loading, refetch } = useQuery(QUESTIONNAIRES_QUERY, {
    fetchPolicy: "network-only",
  });

  if (loading) {
    return (
      <Theme themeName={"ons"}>
        <Layout title="Author">
          <Loading height="24.25rem">Questionnaires loading…</Loading>
        </Layout>
      </Theme>
    );
  }

  if (error || !data) {
    return (
      <Theme themeName={"ons"}>
        <Layout title="Author">
          <Error>Oops! Questionnaires could not be found</Error>
        </Layout>
      </Theme>
    );
  }
  const handleClick = (questionnaireId) =>
    history.push(
      buildQuestionnairePath({
        questionnaireId,
      })
    );

  const onDeleteQuestionnaire = (id) => {
    deleteQuestionnaire({ variables: { input: { id } } })
      .then(() => showToast("Questionnaire deleted"))
      .then(() => refetch());
  };

  return (
    <Theme themeName={"ons"}>
      <WarningBanner bannerMessage={bannerMessage}>
        Action required
      </WarningBanner>
      <Layout title="Author">
        <QuestionnairesView
          questionnaires={data.questionnaires}
          onDeleteQuestionnaire={onDeleteQuestionnaire}
          onDuplicateQuestionnaire={onDuplicateQuestionnaire}
          onCreateQuestionnaire={onCreateQuestionnaire}
          enabledHeadings={enabledHeadings}
          onQuestionnaireClick={handleClick}
          canCreateQuestionnaire
          padding="large"
        />
      </Layout>
    </Theme>
  );
};

QuestionnairesPage.propTypes = {
  onCreateQuestionnaire: PropTypes.func.isRequired,
  showToast: PropTypes.func.isRequired,
  onDuplicateQuestionnaire: PropTypes.func.isRequired,
};

export default flowRight(
  withShowToast,
  withCreateQuestionnaire,
  withDuplicateQuestionnaire
)(QuestionnairesPage);
