import React from "react";
import { useQuery } from "@apollo/react-hooks";
import styled from "styled-components";
import { colors } from "constants/theme.js";
import moment from "moment";

import GET_PUBLISH_HISTORY_QUERY from "./GetPublishHistory.graphql";

const HorizontalSeparator = styled.hr`
  border: 0;
  border-top: 0.0625em solid ${colors.lightMediumGrey};
  margin: 1.5em 0;
`;

const Title = styled.h2`
  font-size: 1.4em;
  font-weight: bold;
  color: ${colors.text};
  margin: 0;
  margin-bottom: 1em;
`;

const HistoryTable = styled.div`
  table,
  th,
  td {
    border: 1px solid #666666;
    text-align: left;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  thead {
    background-color: #e4e8eb;
    font-weight: bold;
  }
  th,
  td {
    padding: 12px;
  }
`;

const Content = styled.div`
  font-weight: 400;
  color: ${colors.text};
  margin-bottom: 1em;
`;

const formatDate = (date) => moment(date).format("DD/MM/YYYY [at] HH:mm:ss");

const PublishHistory = () => {
  let historyItems = [];

  const { data } = useQuery(GET_PUBLISH_HISTORY_QUERY, {
    fetchPolicy: "cache-and-network",
  });

  if (data) {
    historyItems = data.publishHistory.historyItems || [];
  }

  return (
    <div>
      <HorizontalSeparator />
      <Title>Publishing history</Title>
      {Object.keys(historyItems).length === 0 ? (
        <Content data-test="no-published-versions-text">
          No versions of this questionnaire have been published
        </Content>
      ) : (
        <HistoryTable data-test="history-table">
          <table>
            <thead>
              <tr>
                <th>Date of publication</th>
                <th>Survey ID</th>
                <th>Form type</th>
                <th>CIR ID</th>
                <th>CIR version</th>
              </tr>
            </thead>
            <tbody>
              {historyItems.map((historyItem) => {
                return (
                  <tr key={historyItem.id}>
                    <td>{formatDate(historyItem.published_at)}</td>
                    <td>{historyItem.survey_id}</td>
                    <td>{historyItem.form_type}</td>
                    <td>{historyItem.id}</td>
                    <td>{historyItem.ci_version}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </HistoryTable>
      )}
    </div>
  );
};

export default PublishHistory;
