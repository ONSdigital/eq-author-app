import React from "react";
import PropTypes from "prop-types";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import { flowRight } from "lodash";

import { useHistory } from "react-router-dom";
import { buildQuestionnairePath } from "utils/UrlUtils";
import Layout from "components/Layout";
import Loading from "components/Loading";
import Error from "components/Error";

import * as Headings from "constants/table-headings";

import QuestionnairesTable from "components/QuestionnairesView/QuestionnairesTable";
import QuestionnairesView from "components/QuestionnairesView";

import withDeleteQuestionnaire from "./withDeleteQuestionnaire";
import withCreateQuestionnaire from "./withCreateQuestionnaire";
import withDuplicateQuestionnaire from "./withDuplicateQuestionnaire";

import useLockStatusSubscription from "hooks/useLockStatusSubscription";

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
  Headings.PERMISSIONS,
  Headings.LOCKED,
  Headings.STARRED,
  Headings.ACTIONS,
];

const QuestionnairesPage = ({
  onDeleteQuestionnaire,
  onDuplicateQuestionnaire,
  onCreateQuestionnaire,
}) => {
  useLockStatusSubscription();

  const history = useHistory();
  const handleClick = (questionnaireId) =>
    history.push(
      buildQuestionnairePath({
        questionnaireId,
      })
    );

  return (
    <Layout title="Questionnaires">
      <Query fetchPolicy="network-only" query={QUESTIONNAIRES_QUERY}>
        {(response) => {
          const { loading, error, data } = response;

          if (loading) {
            return <Loading height="24.25rem">Questionnaires loading…</Loading>;
          }

          if (error) {
            return <Error>Oops! Questionnaires could not be found</Error>;
          }

          return (
            <QuestionnairesView
              questionnaires={data.questionnaires}
              onDeleteQuestionnaire={onDeleteQuestionnaire}
              onDuplicateQuestionnaire={onDuplicateQuestionnaire}
              onCreateQuestionnaire={onCreateQuestionnaire}
              enabledHeadings={enabledHeadings}
              onQuestionnaireClick={handleClick}
              canCreateQuestionnaire
            />
          );
        }}
      </Query>
    </Layout>
  );
};

QuestionnairesPage.propTypes = {
  onCreateQuestionnaire: PropTypes.func.isRequired,
  onDeleteQuestionnaire: PropTypes.func.isRequired,
  onDuplicateQuestionnaire: PropTypes.func.isRequired,
};

export default flowRight(
  withCreateQuestionnaire,
  withDuplicateQuestionnaire,
  withDeleteQuestionnaire
)(QuestionnairesPage);
